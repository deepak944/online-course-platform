# 🔴 MUST be at the very top
from dotenv import load_dotenv
load_dotenv()

import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import Config
from models import db
from routes.auth_routes import auth_bp
from routes.enroll_routes import enroll_bp
from utils.email import send_email

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
db.init_app(app)
jwt = JWTManager(app)

app.register_blueprint(auth_bp)
app.register_blueprint(enroll_bp)


@app.route("/test-email")
def test_email():
    send_email(
        to_email="appudeepak944@gmail.com",
        subject="Test Email",
        body="Email configuration is working successfully 🚀"
    )
    return "Email sent"


@app.route("/")
def home():
    return jsonify({"message": "Backend running"})


@app.route("/forgot-password", methods=["POST"])
def forgot_password():
    return jsonify({
        "message": "If the email exists, a reset link has been sent"
    }), 200


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
