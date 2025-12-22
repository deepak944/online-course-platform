import { useParams } from "react-router-dom"
import courses from "../data/courses"

function CourseDetails({ enrolledCourses, setEnrolledCourses }) {
  const { id } = useParams()
  const course = courses.find(c => c.id === Number(id))

  if (!course) {
    return (
      <div className="text-center mt-10 text-red-600 text-lg">
        Course not found
      </div>
    )
  }

  const isEnrolled = enrolledCourses.some(c => c.id === course.id)

  const handleEnroll = () => {
    if (isEnrolled) return

    const updated = [...enrolledCourses, course]
    setEnrolledCourses(updated)

    const currentUser = localStorage.getItem("currentUser")
    localStorage.setItem(
      `enrolledCourses_${currentUser}`,
      JSON.stringify(updated)
    )

    alert("Enrolled successfully ✅")
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        {/* Course Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {course.title}
        </h2>

        {/* Instructor */}
        <p className="text-gray-600 mb-6">
          Instructor: <span className="font-medium">{course.instructor}</span>
        </p>

        {/* Description */}
        <p className="text-gray-700 leading-relaxed mb-8">
          {course.description}
        </p>

        {/* Enroll Section */}
        {isEnrolled ? (
          <div className="inline-block bg-green-100 text-green-700 px-6 py-3 rounded-lg font-medium">
            ✅ You are already enrolled
          </div>
        ) : (
          <button
            onClick={handleEnroll}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
          >
            Enroll Now
          </button>
        )}
      </div>
    </div>
  )
}

export default CourseDetails
