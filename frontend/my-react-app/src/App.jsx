"use client"

import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import User_HomePage from "./user_HomePage"
import LoginPage from "./loginpage"
import TasksPage from "./Taskspage"
import ProfilePage from "./profilepage"
import Navbar from "./Navbar"
import { useAuth } from "../context/AuthContext.jsx"

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  const { isAuthenticated, loading } = useAuth()
  const [activePage, setActivePage] = useState("home")

  // Update active page based on current path
  const updateActivePage = (path) => {
    if (path === "/" || path === "") setActivePage("home")
    else if (path === "/profile") setActivePage("profile")
    else if (path === "/tasks") setActivePage("tasks")
  }

  // Set initial active page based on current path
  useState(() => {
    const path = window.location.pathname
    updateActivePage(path)
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <Router>
      <div className="app">
        {isAuthenticated && <Navbar activePage={activePage} setActivePage={setActivePage} />}
        <div className="main-content">
          <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <User_HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <TasksPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
              onEnter={() => setActivePage("profile")}
            />

            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
