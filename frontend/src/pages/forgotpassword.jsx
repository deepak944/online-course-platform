import { useState } from "react"
import { useNavigate } from "react-router-dom"

function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const res = await fetch(
        "http://127.0.0.1:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email })
        }
      )

      const data = await res.json()
      setMessage(data.message)
    } catch (err) {
      setMessage("Something went wrong. Please try again.")
    }

    setLoading(false)
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg w-96 text-white"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Forgot Password
        </h2>

        <p className="text-sm text-gray-300 mb-4 text-center">
          Enter your registered email.  
          If it exists, you will receive a reset link.
        </p>

        <input
          type="email"
          placeholder="Email address"
          className="w-full p-2 mb-3 rounded bg-gray-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {message && (
          <p className="text-green-400 text-sm mt-4 text-center">
            {message}
          </p>
        )}

        <p
          className="text-sm text-blue-400 mt-4 text-center cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </p>
      </form>
    </div>
  )
}

export default ForgotPassword
