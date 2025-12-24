from . import db
from datetime import datetime

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    email = db.Column(db.String(120), unique=True, nullable=False)

    # nullable because Google users don't have passwords
    password = db.Column(db.String(255), nullable=True)

    # "local" or "google"
    auth_provider = db.Column(db.String(20), nullable=False, default="local")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
