import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import logo from "../assets/logo.png"

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  // ---------------- EMAIL + PASSWORD LOGIN ----------------
  const handleLogin = async (e) => {
    e.preventDefault()

    const res = await fetch("http://127.0.0.1:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.message)
      return
    }

    localStorage.setItem("token", data.access_token)
    localStorage.setItem("currentUser", data.user.email)

    setIsLoggedIn(true)
    navigate("/courses")
  }

  // ---------------- GOOGLE LOGIN ----------------
  const handleGoogleLogin = async (response) => {
    const res = await fetch("http://127.0.0.1:5000/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential: response.credential }),
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.message || "Google login failed")
      return
    }

    localStorage.setItem("token", data.access_token)
    localStorage.setItem("currentUser", data.user.email)

    setIsLoggedIn(true)
    navigate("/courses")
  }

  // ---------------- LOAD GOOGLE SCRIPT ----------------
  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: "494167809954-v18ralbpt12musct4pcbutpl7t5rrlqd.apps.googleusercontent.com",
        callback: handleGoogleLogin,
      })

      google.accounts.id.renderButton(
        document.getElementById("google-login-btn"),
        {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "continue_with",
        }
      )
    }
  }, [])

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
<img src={logo} alt="Logo" className="h-10 mb-5 bg-center" />
        <h2 className="text-2xl font-bold mb-6 text-center">
          Welcome back
        </h2>

        {/* GOOGLE BUTTON */}
        <div id="google-login-btn" className="mb-4 flex justify-center"></div>

        <div className="text-center text-gray-500 mb-4">
          — or login with email —
        </div>

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
          New here?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
