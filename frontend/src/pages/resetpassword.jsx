import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  // 🔐 Verify token when page loads
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/auth/reset-password/${token}`)
      .then(res => {
        if (!res.ok) throw new Error("Invalid or expired link")
        return res.json()
      })
      .then(() => setLoading(false))
      .catch(() => {
        setError("Reset link is invalid or expired")
        setLoading(false)
      })
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    const res = await fetch("http://127.0.0.1:5000/api/auth/update-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token,
        new_password: password
      })
    })

    if (res.ok) {
      const data = await res.json()
      // clear enrolled courses stored in localStorage for this user
      try {
        if (data.email) {
          localStorage.removeItem(`enrolledCourses_${data.email}`)
          localStorage.removeItem("currentEnrolledCourses")
          // also clear currentUser to force fresh login
          localStorage.removeItem("currentUser")
        }
      } catch (e) {
        console.warn("Failed to clear localStorage after password reset", e)
      }

      alert("Password updated successfully")
      navigate("/login")
    } else {
      setError("Failed to update password")
    }
  }

  if (loading) return <p className="text-center mt-10">Verifying link...</p>
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg w-96 text-white"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="New Password"
          className="w-full p-2 mb-3 rounded bg-gray-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-2 mb-3 rounded bg-gray-700"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-400 mb-2">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded"
        >
          Update Password
        </button>
      </form>
    </div>
  )
}

export default ResetPassword
