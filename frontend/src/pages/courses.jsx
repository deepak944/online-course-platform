import { Link } from "react-router-dom"
import courses from "../data/courses"

function Courses() {
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
            <div>
              <h3 className="text-2xl font-semibold text-gray-800">
                {course.title}
              </h3>
              <p className="text-gray-600 mt-2">
                Instructor: {course.instructor}
              </p>
            </div>

            <Link
              to={`/courses/${course.id}`}
              className="mt-6 md:mt-0 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Courses
