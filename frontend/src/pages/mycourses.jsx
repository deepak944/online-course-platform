function MyCourses({ enrolledCourses }) {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          My Courses
        </h2>

        {enrolledCourses.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-lg shadow-md p-10 text-center">
            <p className="text-gray-600 text-lg">
              You haven’t enrolled in any courses yet.
            </p>
            <p className="text-gray-500 mt-2">
              Browse courses and start learning today 🚀
            </p>
          </div>
        ) : (
          /* Enrolled Courses Grid */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map(course => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {course.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {course.description}
                </p>

                <div className="mt-auto inline-block bg-green-100 text-green-700 px-4 py-2 rounded-md text-sm font-medium">
                  ✅ Enrolled
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyCourses
