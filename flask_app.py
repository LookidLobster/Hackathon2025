from flask import Flask, request, send_from_directory
from werkzeug.utils import secure_filename
from flask_cors import CORS
from pyngrok import ngrok
import os
from pydantic import BaseModel
from ollama import chat
from pathlib import Path


class ImageAnalysisResult(BaseModel):
    problem: bool
    message: str
    details: str

def analysis(path: Path) -> str:
  response = chat(
    model="gemma3",
    format=ImageAnalysisResult.model_json_schema(),  # Instruct the model to reply with this schema
    messages=[
        {
            "role": "user",
            "content": (
                "Analyze the image, and return a JSON description based on the given schema. For the message field, Provide a message that we can send to business owners that could potentially fix the problem. These include potholes, damages in infrastructure, or anything else that can be seen in the image. No need to include any names. " +
                "If no issues are found, return a message indicating everything is fine."
            ),
            "images": [path],                 # Supply the generated PNG (super important part)
        }
    ],
    options={"temperature": 0},                   # Deterministic output
)

  image_analysis = ImageAnalysisResult.model_validate_json(response.message.content)


  problem = image_analysis.problem
  message = image_analysis.message
  details = image_analysis.details

  return problem, message, details

UPLOAD_FOLDER = '/tmp'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__, static_folder='client/dist')
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

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
        problem, message, details = analysis(file_path)
        return {"message": message, "problem": problem, "details": details}
    else:
        return {'message': 'File not allowed'}

if __name__ == "__main__":
    public_url = ngrok.connect(5000)
    print(f" * ngrok tunnel URL: {public_url}")
    app.run(host="0.0.0.0", port=5000)