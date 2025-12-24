import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import "../index.css"
import logo from "../assets/logo.png"

function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  // ---------------- EMAIL + PASSWORD REGISTER ----------------
  const handleRegister = async (e) => {
    e.preventDefault()

    const res = await fetch("http://127.0.0.1:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      alert("Account already exists. Please login or use Forgot Password.")
      navigate("/login")
      return
    }

    alert("Registration successful. Please login.")
    navigate("/login")
  }

  // ---------------- GOOGLE REGISTER / LOGIN ----------------
  const handleGoogleRegister = async (response) => {
    const res = await fetch("http://127.0.0.1:5000/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential: response.credential }),
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.message || "Google sign up failed")
      return
    }

    localStorage.setItem("token", data.access_token)
    localStorage.setItem("currentUser", data.user.email)

    navigate("/courses")
  }

  // ---------------- LOAD GOOGLE BUTTON ----------------
  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: "494167809954-v18ralbpt12musct4pcbutpl7t5rrlqd.apps.googleusercontent.com",
        callback: handleGoogleRegister,
      })

      google.accounts.id.renderButton(
        document.getElementById("google-register-btn"),
        {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "signup_with",
        }
      )
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_40px_rgba(124,58,237,0.15)] p-8">
<img src={logo} alt="Logo" className="h-14 mb-2" />
        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-center text-gray-900">
          Create your account
        </h2>
        <p className="text-sm text-gray-500 text-center mt-2 mb-6">
          Start your learning journey with us 🚀
        </p>

        {/* GOOGLE BUTTON */}
        <div id="google-register-btn" className="mb-5 flex justify-center"></div>

        <div className="text-center text-gray-500 mb-6">
          — or sign up with email —
        </div>

        {/* FORM */}
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              required
              className="
                w-full px-4 py-3 rounded-xl border border-gray-300
                focus:outline-none focus:ring-2 focus:ring-purple-500
                focus:border-transparent transition
              "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              className="
                w-full px-4 py-3 rounded-xl border border-gray-300
                focus:outline-none focus:ring-2 focus:ring-purple-500
                focus:border-transparent transition
              "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="
              w-full mt-2 py-3 rounded-xl
              bg-purple-600 text-white font-semibold
              hover:bg-purple-700 active:scale-[0.98]
              transition-all duration-200
              shadow-md hover:shadow-lg
            "
          >
            Create Account
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center text-gray-600 mt-8">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
