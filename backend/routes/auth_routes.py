from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from datetime import datetime, timedelta
import secrets
from urllib.parse import quote, unquote

from models import db
from models.user import User
from models.login_log import LoginLog
from models.password_reset_token import PasswordResetToken

from utils.email import send_email

# ✅ Blueprint
auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


# ---------------- REGISTER ----------------
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists"}), 400

    hashed_password = generate_password_hash(password)
    user = User(email=email, password=hashed_password)

    db.session.add(user)
    db.session.commit()

    send_email(
        to_email=email,
        subject="Welcome to Online Course Platform 🎉",
        body=(
            "Hello,\n\n"
            "Your account has been successfully created on Online Course Platform.\n\n"
            "If this was not you, please contact support immediately.\n\n"
            "Happy Learning 🚀"
        )
    )

    return jsonify({"message": "Registration successful"}), 201


# ---------------- LOGIN ----------------
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"message": "Invalid email or password"}), 401

    access_token = create_access_token(identity=str(user.id))

    login_log = LoginLog(user_id=user.id)
    db.session.add(login_log)
    db.session.commit()

    # ✅ OPTIONAL: login alert (NO reset link here)
    send_email(
        to_email=email,
        subject="Login Alert – Online Course Platform",
        body=(
            "Hello,\n\n"
            "You have successfully logged in to your account🚀.\n\n"
            "If this was not you, please reset your password immediately.\n\n"
            "Online Course Platform Team 😊❤️"
        )
    )

    return jsonify({
        "access_token": access_token,
        "user": {
            "email": user.email
        }
    }), 200


# ---------------- FORGOT PASSWORD ----------------
@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json(silent=True) or {}
    email = data.get("email")

    response = {
        "message": "If the email exists, a reset link has been sent"
    }

    if not email:
        return jsonify(response), 200

    user = User.query.filter_by(email=email).first()
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

    safe_token = quote(token)
    reset_link = f"http://localhost:5173/reset-password/{safe_token}"

    send_email(
        to_email=email,
        subject="Reset Your Password – Online Course Platform",
        body=(
            "Hello,\n\n"
            "We received a request to reset your password.\n\n"
            f"{reset_link}\n\n"
            "This link will expire in 15 minutes.\n\n"
            "If you did not request this, please ignore this email.\n\n"
            "Online Course Platform Team"
        )
    )

    return jsonify(response), 200


# ---------------- VERIFY RESET TOKEN ----------------
@auth_bp.route("/reset-password/<token>", methods=["GET"])
def verify_reset_token(token):
    # ensure any percent-encoding is decoded before lookup
    token = unquote(token)

    reset_token = PasswordResetToken.query.filter_by(
        token=token,
        used=False
    ).first()

    if not reset_token or reset_token.expires_at < datetime.utcnow():
        return jsonify({"message": "Invalid or expired reset link"}), 400

    return jsonify({"message": "Token valid"}), 200


# ---------------- UPDATE PASSWORD ----------------
@auth_bp.route("/update-password", methods=["POST"])
def update_password():
    data = request.get_json(silent=True) or {}

    token = data.get("token")
    new_password = data.get("new_password")

    if not token or not new_password:
        return jsonify({"message": "Token and new password required"}), 400

    # decode token in case frontend sent an encoded value
    token = unquote(token)

    reset_token = PasswordResetToken.query.filter_by(
        token=token,
        used=False
    ).first()

    if not reset_token or reset_token.expires_at < datetime.utcnow():
        return jsonify({"message": "Invalid or expired token"}), 400

    user = User.query.get(reset_token.user_id)

    # log before/after for debugging
    current_app.logger.info(f"Reset token id={reset_token.id} for user_id={reset_token.user_id}")
    current_app.logger.info(f"Old password hash: {user.password}")

    user.password = generate_password_hash(new_password)

    # verify hashing works as expected
    from werkzeug.security import check_password_hash as _check
    ok = _check(user.password, new_password)
    current_app.logger.info(f"New password hash set, verification ok={ok}")

    reset_token.used = True
    db.session.commit()

    return jsonify({"message": "Password updated successfully", "email": user.email}), 200
