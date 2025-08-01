from flask import Flask, request, send_from_directory
from werkzeug.utils import secure_filename
from flask_cors import CORS
from pyngrok import ngrok
import os

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
        return {'message': 'success'}
    else:
        return {'message': 'File not allowed'}

if __name__ == "__main__":
    public_url = ngrok.connect(5000)
    print(f" * ngrok tunnel URL: {public_url}")
    app.run()
