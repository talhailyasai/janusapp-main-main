from flask import Blueprint, request, jsonify, current_app

upload_bp = Blueprint('upload', __name__)

@upload_bp.route('/upload/<path:filename>', methods=['POST'])
def save_upload(filename):
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
            
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
            
        mongo = current_app.mongo
        mongo.save_file(filename, file)
        return jsonify({"message": "File uploaded successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
