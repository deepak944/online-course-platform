import { Link, useNavigate, useLocation } from "react-router-dom"

function Navbar({ setIsLoggedIn }) {
  const navigate = useNavigate()
  const location = useLocation()

  const logout = () => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("token")
    localStorage.removeItem("currentEnrolledCourses")
    setIsLoggedIn(false)
    navigate("/login")
  }

  const navLinkClass = (path) =>
    `px-3 py-2 text-sm font-medium transition ${
      location.pathname === path
        ? "text-white border-b-2 border-white"
        : "text-gray-300 hover:text-white"
    }`

  return (
    <nav className="bg-gray-900 px-8 py-4 flex justify-between items-center">
      {/* Brand text (NOT a link) */}
      <div className="text-2xl font-bold text-white">
        Online Course Platform
      </div>

      {/* Right side navigation */}
      <div className="flex items-center gap-6">
        <Link to="/courses" className={navLinkClass("/courses")}>
          Courses
        </Link>

        <Link to="/my-courses" className={navLinkClass("/my-courses")}>
          My Courses
        </Link>

        <button
          onClick={logout}
          className="ml-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar
