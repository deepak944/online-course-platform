from datetime import datetime
from models import db

class PasswordResetToken(db.Model):
    __tablename__ = "password_reset_tokens"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    token = db.Column(db.String, nullable=False, unique=True)
    expires_at = db.Column(db.DateTime, nullable=False)

    # ✅ THIS IS MISSING IN YOUR PROJECT
    used = db.Column(db.Boolean, default=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", backref="password_reset_tokens")
