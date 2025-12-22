import os
import smtplib
from email.message import EmailMessage

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")

def send_email(to_email, subject, body):
    try:
        msg = EmailMessage()
        msg["From"] = "Online Learning Platform <{}>"
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.set_content(body)

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(EMAIL_USER, EMAIL_PASS)
            server.send_message(msg)

    except Exception as e:
        print("Email error:", e)
