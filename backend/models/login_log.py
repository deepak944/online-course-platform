from . import db
from datetime import datetime

class LoginLog(db.Model):
    __tablename__ = "login_logs"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    login_time = db.Column(db.DateTime, default=datetime.utcnow)
    ip_address = db.Column(db.String(50))
    user_agent = db.Column(db.Text)
