from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db
from models.enrollment import Enrollment

enroll_bp = Blueprint("enroll", __name__, url_prefix="/api/enroll")


@enroll_bp.route("", methods=["POST"])
@jwt_required()
def enroll_course():
    user_id = get_jwt_identity()
    data = request.get_json()
    course_id = data.get("course_id")

    if not course_id:
        return jsonify({"message": "Course ID required"}), 400

    existing = Enrollment.query.filter_by(
        user_id=user_id,
        course_id=course_id
    ).first()

    if existing:
        return jsonify({"message": "Already enrolled"}), 400

    enrollment = Enrollment(user_id=user_id, course_id=course_id)
    db.session.add(enrollment)
    db.session.commit()

    return jsonify({"message": "Enrolled successfully"}), 201
