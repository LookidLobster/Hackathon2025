import os, base64
from flask import Flask, render_template, flash, request, redirect, url_for, send_from_directory
from werkzeug.utils import secure_filename
from flask_cors import CORS

UPLOAD_FOLDER = '/tmp'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
# # Example: list of lat/lng points (simulate user reports)
# locations = [
#     {"lat": 37.782, "lng": -122.447},
#     {"lat": 37.782, "lng": -122.445},
#     {"lat": 37.785, "lng": -122.442},
#     {"lat": 37.779, "lng": -122.448},
#     # add more for testing
# ]

# @app.route('/api/locations')
# def get_locations():
#     return jsonify(locations)

app = Flask(__name__, static_folder='client/dist')
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
print(app.config)

def read_file(path):
    with open(path, 'rb') as f:
        return f.read()


@app.post("/upload")
async def uploadPhoto():
    if 'file' not in request.files:
        flash('No file part')
        return {'message': 'No file part'}
    file = request.files['file']

    if file.filename == "":
        flash('No selected file')
        return {'message': 'No selected file'}
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        return {'message': 'success'}
    else:
        return {'message': 'File not allowed'}
    
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/download_file")
def downloadFile():
    return render_template("downloadFile.html")

        

if __name__ == "__main__": 
    app.run(debug=True, use_reloader=True, threaded=True) 