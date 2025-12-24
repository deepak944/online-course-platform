import { Link, useNavigate } from "react-router-dom"
import courses from "../data/courses"

function Courses() {
  const navigate = useNavigate()

  const user = localStorage.getItem("currentUser")
  const enrolledCourses =
    JSON.parse(localStorage.getItem(`enrolledCourses_${user}`)) || []

  const handleAction = (course) => {
    // FREE COURSE
    if (course.price === 0) {
      navigate(`/courses/${course.id}`)
      return
    }

    // PAID COURSE - ALREADY ENROLLED
    if (enrolledCourses.includes(course.id)) {
      alert("Payment successful ✅ You are already enrolled.")
      navigate("/courses")
      return
    }

    // PAID COURSE - NOT ENROLLED
    navigate(`/pay/${course.id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-10 px-6">
      <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-800">
        Available Courses
      </h2>

      <div className="max-w-6xl mx-auto space-y-8">
        {courses.map(course => (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row md:items-center md:justify-between hover:shadow-xl transition"
          >
            {/* LEFT */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-800">
                {course.title}
              </h3>

              <p className="text-gray-600 mt-2">
                Instructor: {course.instructor}
              </p>

              <p className="mt-2 font-semibold">
                {course.price === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  <span className="text-purple-600">
                    ₹{course.price}
                  </span>
                )}
              </p>
            </div>

            {/* RIGHT */}
            <div className="mt-6 md:mt-0 flex gap-4">
              <Link
                to={`/courses/${course.id}`}
                className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                View Details
              </Link>

              {/* ACTION BUTTON */}
              {course.price === 0 ? (
                <button
                  onClick={() => handleAction(course)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                >
                  Access Course
                </button>
              ) : (
                <button
                  onClick={() => handleAction(course)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  {enrolledCourses.includes(course.id)
                    ? "Go to Courses"
                    : "Pay & Enroll"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Courses
