import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    const res = await fetch("http://127.0.0.1:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.message || "Invalid email or password")
      return
    }

    localStorage.setItem("token", data.access_token)
    localStorage.setItem("currentUser", email)
 const userCourses =
    JSON.parse(localStorage.getItem(`enrolledCourses_${email}`)) || []

  // store temp (App.jsx will read it)
  localStorage.setItem("currentEnrolledCourses", JSON.stringify(userCourses))
    setIsLoggedIn(true)
    navigate("/courses")
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full px-4 py-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="w-full px-4 py-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        <p className="text-sm mt-4 text-center">
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </p>

        <p className="text-sm mt-2 text-center">
          New user?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
