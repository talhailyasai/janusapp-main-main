from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo
import os 
from dotenv import load_dotenv

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:5173"],
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type"]
        }
    })

    app.config['MONGO_URI'] = os.getenv('MONGO_URI')
    mongo = PyMongo(app)
    app.mongo = mongo

    # Register blueprints
    from process_bp import process_bp
    app.register_blueprint(process_bp)

    @app.route('/')
    def hello_world():
        return 'Hello, World!'

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5001)