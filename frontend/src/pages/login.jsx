import { Routes, Route, Navigate } from "react-router-dom"

import { useState, useEffect } from "react"


import Login from "./pages/login"
import Register from "./pages/register"
import Courses from "./pages/courses"
import CourseDetails from "./pages/coursedetails"
import MyCourses from "./pages/mycourses"
import Navbar from "./components/navbar"
import ForgotPassword from "./pages/forgotpassword"
import ResetPassword from "./pages/resetpassword"


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("currentUser")
  )

  const currentUser = localStorage.getItem("currentUser")

  const [enrolledCourses, setEnrolledCourses] = useState([])

useEffect(() => {
  const currentUser = localStorage.getItem("currentUser")
  if (!currentUser) {
    setEnrolledCourses([])
    return
  }

  const stored =
    JSON.parse(
      localStorage.getItem(`enrolledCourses_${currentUser}`)
    ) || []

  setEnrolledCourses(stored)
}, [isLoggedIn])


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar only after login */}
      {isLoggedIn && <Navbar setIsLoggedIn={setIsLoggedIn} />}

      <div className="p-6">
        <Routes>
          <Route
            path="/"
            element={<Navigate to={isLoggedIn ? "/courses" : "/login"} />}
          />

          <Route
            path="/login"
            element={
              isLoggedIn
                ? <Navigate to="/courses" />
                : <Login setIsLoggedIn={setIsLoggedIn} />
            }
          />

          <Route
            path="/register"
            element={
              isLoggedIn
                ? <Navigate to="/courses" />
                : <Register />
            }
          />

          <Route
            path="/courses"
            element={
              isLoggedIn
                ? <Courses />
                : <Navigate to="/login" />
            }
          />

          <Route
            path="/courses/:id"
            element={
              isLoggedIn ? (
                <CourseDetails
                  enrolledCourses={enrolledCourses}
                  setEnrolledCourses={setEnrolledCourses}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/my-courses"
            element={
              isLoggedIn
                ? <MyCourses enrolledCourses={enrolledCourses} />
                : <Navigate to="/login" />
            }
          />
<Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
