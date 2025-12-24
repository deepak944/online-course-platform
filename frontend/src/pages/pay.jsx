import { useParams, useNavigate } from "react-router-dom"
import courses from "../data/courses"

function Pay() {
  const { courseId } = useParams()
  const navigate = useNavigate()

  const course = courses.find(
    (c) => c.id === Number(courseId)
  )

  const handlePayment = () => {
    alert("Payment successful 💳✅")

    const user = localStorage.getItem("currentUser")
    const enrolled =
      JSON.parse(localStorage.getItem(`enrolledCourses_${user}`)) || []

    if (!enrolled.includes(course.id)) {
      enrolled.push(course.id)
      localStorage.setItem(
        `enrolledCourses_${user}`,
        JSON.stringify(enrolled)
      )
    }

    localStorage.setItem(
      "currentEnrolledCourses",
      JSON.stringify(enrolled)
    )

    navigate(`/courses/${course.id}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Payment
        </h2>

        <p className="mb-4">
          Course: <b>{course.title}</b>
        </p>

        <p className="mb-6">
          Amount: <b>₹{course.price}</b>
        </p>

        <button
          onClick={handlePayment}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          Pay Now
        </button>
      </div>
    </div>
  )
}

export default Pay
