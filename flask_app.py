from flask import Flask, request, send_from_directory, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.utils import secure_filename
from pyngrok import ngrok
from pathlib import Path
import os
import cv2

from pydantic import BaseModel
from vonage import Vonage, Auth
from vonage_sms import SmsMessage

# --- Configuration ---

UPLOAD_FOLDER = '/tmp'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov', 'avi', 'mkv'}

# --- App Setup ---

app = Flask(__name__, static_folder='client/dist')
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///uploads.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --- Vonage Setup ---

secret = "mnbd6STwSIUSQDdA"
key = "6540c50a"
vonage = Vonage(auth=Auth(api_key=key, api_secret=secret))

# --- Data Models ---

class Upload(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    comments = db.Column(db.Text, nullable=True)
    date = db.Column(db.String(20), nullable=True)
    location = db.Column(db.String(50), nullable=True)
    status = db.Column(db.String(20), nullable=False, default='not started')

with app.app_context():
    db.create_all()

# --- Helpers ---

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def is_video(filename):
    ext = filename.rsplit('.', 1)[1].lower()
    return ext in {'mp4', 'mov', 'avi', 'mkv'}

def extract_sample_frames(video_path, num_frames=3):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return []
    length = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    frames = []
    if length < num_frames:
        frame_indices = range(length)
    else:
        frame_indices = [int(i * length / num_frames) for i in range(num_frames)]
    for idx in frame_indices:
        cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
        ret, frame = cap.read()
        if ret:
            frame_path = f"{video_path}_frame_{idx}.jpg"
            cv2.imwrite(frame_path, frame)
            frames.append(frame_path)
    cap.release()
    return frames

class ImageAnalysisResult(BaseModel):
    problem: bool
    message: str
    details: str
    solution: str

import ollama

def analysis(path: Path):
    client = ollama.Client()
    response = client.chat(
        model="gemma3",
        format=ImageAnalysisResult.model_json_schema(),
        messages=[
            {
                "role": "user",
                "content": (
                    "Analyze the image, and return a JSON description based on the given schema. For the message field, Provide a message that we can send to business owners about any potential issues. These include potholes, damages in infrastructure, or anything else that can be seen in the image. No need to include any names. For the solution field, describe to the user how the problem is going to be solved by a potential business."
                    "If no issues are found, leave the solution and message field blank"
                ),
                "images": [path],
            }
        ],
        options={"temperature": 0},
    )
    image_analysis = ImageAnalysisResult.model_validate_json(response.message.content)
    return image_analysis.problem, image_analysis.message, image_analysis.details, image_analysis.solution

# --- Routes ---

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.post("/upload")
def upload_photo():
    if 'file' not in request.files:
        return {'message': 'No file part'}
    file = request.files['file']

    if file.filename == "":
        return {'message': 'No selected file'}
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        comments = request.form.get('comments')
        date = request.form.get('date')
        location = request.form.get('location')

        upload_record = Upload(
            filename=filename,
            comments=comments,
            date=date,
            location=location
        )
        db.session.add(upload_record)
        db.session.commit()

        if is_video(filename):
            frames = extract_sample_frames(file_path, num_frames=3)
            results = [analysis(Path(frame)) for frame in frames]
            problem = any(r[0] for r in results)
            message = " ".join(r[1] for r in results if r[1])
            details = "\n".join(r[2] for r in results if r[2])
            solution = " ".join(r[3] for r in results if r[3])
            sms_message = message if message else "A new video has been uploaded for review."
        else:
            problem, message, details, solution = analysis(Path(file_path))
            sms_message = message

        message_obj = SmsMessage(to='919741057312', from_='InfraAlert', text=sms_message)
        response = vonage.sms.send(message_obj)
        print(response.model_dump_json(exclude_unset=True))

        return {
            "message": message,
            "problem": problem,
            "details": details,
            "id": upload_record.id,
            "solution": solution
        }
    else:
        return {'message': 'File not allowed'}

@app.route("/locations")
def get_locations():
    uploads = Upload.query.filter(Upload.status != 'done').all()
    coords = []
    for upload in uploads:
        if upload.location:
            try:
                lat_str, lng_str = upload.location.split(",")
                intensity = 0.7
                if upload.status == "in progress":
                    intensity = 0.9
                elif upload.status == "not started":
                    intensity = 0.6
                coords.append([float(lat_str), float(lng_str), intensity])
            except Exception:
                continue
    return jsonify(coords)

@app.route("/upload/<int:upload_id>/status", methods=["POST"])
def update_status(upload_id):
    new_status = request.json.get("status")
    if new_status not in ['not started', 'in progress', 'done']:
        return {"message": "Invalid status value"}, 400
    upload = Upload.query.get(upload_id)
    if not upload:
        return {"message": "Upload not found"}, 404
    upload.status = new_status
    db.session.commit()
    return {"message": "Status updated", "status": upload.status}

@app.route("/api/uploads")
def get_uploads():
    uploads = Upload.query.all()
    data = [
        {
            "id": u.id,
            "filename": u.filename,
            "comments": u.comments,
            "date": u.date,
            "location": u.location,
            "status": u.status,
        }
        for u in uploads
    ]
    return jsonify(data)

# --- Main ---

if __name__ == "__main__":
    public_url = ngrok.connect(5000)
    print(f" * ngrok tunnel URL: {public_url}")
    app.run(host="0.0.0.0", port=5000)
