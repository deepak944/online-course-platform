import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

const API_URL = import.meta.env.VITE_API_URL;

function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/api/auth/reset-password/${token}`)
      .then(res => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(() => setLoading(false))
      .catch(() => {
        setError("Server may be waking up. Please refresh and try again.")
        setLoading(false)
      })
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/update-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: password })
      })

      if (res.ok) {
        alert("Password updated successfully")
        navigate("/login")
      } else {
        setError("Failed to update password")
      }
    } catch {
      setError("Server error. Try again.")
    }
  }

  if (loading) return <p className="text-center mt-10">Verifying link...</p>
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
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
