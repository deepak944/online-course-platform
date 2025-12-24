from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from datetime import datetime, timedelta
import secrets
from urllib.parse import quote, unquote
import requests

from models import db
from models.user import User
from models.login_log import LoginLog
from models.password_reset_token import PasswordResetToken
from utils.email import send_email

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

# ======================================================
# REGISTER (EMAIL + PASSWORD)
# ======================================================
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password are required."}), 400

    if not email.endswith("@gmail.com"):
        return jsonify({
            "message": "Please enter a valid Gmail address or sign up with Google."
        }), 400

    if User.query.filter_by(email=email).first():
        return jsonify({
            "message": "Account already exists. Please login or use Google."
        }), 400

    user = User(
        email=email,
        password=generate_password_hash(password),
        auth_provider="local"
    )

    db.session.add(user)
    db.session.commit()

    send_email(
        to_email=email,
        subject="Welcome to Online Course Platform 🎉",
        body="Your account has been created successfully."
    )

    return jsonify({"message": "Registration successful"}), 201


# ======================================================
# LOGIN (EMAIL + PASSWORD)
# ======================================================
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = data.get("email")
    password = data.get("password")

    if not email:
        return jsonify({"message": "Email is required."}), 400

    if not email.endswith("@gmail.com"):
        return jsonify({
            "message": "This is not a valid email or Google email. Please try to register first."
        }), 400

    if not password:
        return jsonify({"message": "Password is required."}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({
            "message": "This is not a valid email or Google email. Please try to register first."
        }), 404

    if user.auth_provider == "google":
        return jsonify({
            "message": "This account uses Google login. Please continue with Google."
        }), 400

    if not user.password or not check_password_hash(user.password, password):
        return jsonify({
            "message": "Incorrect password. Please try again."
        }), 401

    access_token = create_access_token(identity=str(user.id))

    db.session.add(LoginLog(user_id=user.id))
    db.session.commit()

    return jsonify({
        "access_token": access_token,
        "user": {"email": user.email}
    }), 200


# ======================================================
# GOOGLE LOGIN / REGISTER (ONE BUTTON)
# ======================================================
@auth_bp.route("/google", methods=["POST"])
def google_auth():
    data = request.get_json(silent=True) or {}
    credential = data.get("credential")

    if not credential:
        return jsonify({"message": "Google token required"}), 400

    google_resp = requests.get(
        "https://oauth2.googleapis.com/tokeninfo",
        params={"id_token": credential}
    )

    if google_resp.status_code != 200:
        return jsonify({"message": "Invalid Google token"}), 401

    google_data = google_resp.json()
    email = google_data.get("email")
    email_verified = google_data.get("email_verified")

    if not email or not email_verified:
        return jsonify({"message": "Unverified Google account"}), 401

    user = User.query.filter_by(email=email).first()

    if not user:
        user = User(
            email=email,
            password=None,
            auth_provider="google"
        )
        db.session.add(user)
        db.session.commit()

        send_email(
            to_email=email,
            subject="Welcome to Online Course Platform 🎉",
            body="You signed up using Google successfully."
        )

    access_token = create_access_token(identity=str(user.id))
    db.session.add(LoginLog(user_id=user.id))
    db.session.commit()

    return jsonify({
        "access_token": access_token,
        "user": {
            "email": user.email,
            "auth_provider": user.auth_provider
        }
    }), 200


# ======================================================
# FORGOT PASSWORD (LOCAL USERS ONLY)
# ======================================================
@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json(silent=True) or {}
    email = data.get("email")

    response = {"message": "If the email exists, a reset link has been sent"}

    user = User.query.filter_by(email=email, auth_provider="local").first()
    if not user:
        return jsonify(response), 200

    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(minutes=15)

    reset_token = PasswordResetToken(
        user_id=user.id,
        token=token,
        expires_at=expires_at,
        used=False
    )

    db.session.add(reset_token)
    db.session.commit()

    reset_link = f"http://localhost:5173/reset-password/{quote(token)}"

    send_email(
        to_email=email,
        subject="Reset Your Password – Online Course Platform",
        body=f"""
Hello,

Click the link below to reset your password.
This link expires in 15 minutes.

{reset_link}

If you didn’t request this, ignore this email.
"""
    )

    return jsonify(response), 200

# ======================================================
# UPDATE PASSWORD
# ======================================================
@auth_bp.route("/update-password", methods=["POST"])
def update_password():
    data = request.get_json(silent=True) or {}
    token = unquote(data.get("token", ""))
    new_password = data.get("new_password")

    if not token or not new_password:
        return jsonify({"message": "Token and password required"}), 400

    reset_token = PasswordResetToken.query.filter_by(
        token=token,
        used=False
    ).first()

    if not reset_token:
        return jsonify({"message": "Invalid or expired token"}), 400

    if reset_token.expires_at < datetime.utcnow():
        return jsonify({"message": "Reset token expired"}), 400

    user = User.query.get(reset_token.user_id)
    user.password = generate_password_hash(new_password)
    reset_token.used = True

    db.session.commit()

    return jsonify({
        "message": "Password updated successfully",
        "email": user.email
    }), 200

@auth_bp.route("/reset-password/<token>", methods=["GET"])
def verify_reset_token(token):
    token = unquote(token)

    reset_token = PasswordResetToken.query.filter_by(
        token=token,
        used=False
    ).first()

    if not reset_token:
        return jsonify({"message": "Invalid reset token"}), 400

    if reset_token.expires_at < datetime.utcnow():
        return jsonify({"message": "Reset token expired"}), 400

    return jsonify({"message": "Token valid"}), 200
