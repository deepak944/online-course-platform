class Config:
    SECRET_KEY = "secret-key"
    JWT_SECRET_KEY = "jwt-secret-key"

    SQLALCHEMY_DATABASE_URI = (
        "postgresql://postgres:9353046405@localhost:9353/online_course_db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
