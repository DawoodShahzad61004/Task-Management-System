"use client"

import { useState, useEffect } from "react"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { useLocation } from "react-router-dom"

function ProfilePage({ setActivePage }) {
  const location = useLocation()

  // Sample data for user and task stats
  const [userData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    assignedTasks: 42,
    completedTasks: 16,
    pendingTasks: 33,
    roles: ["Team Lead", "Developer", "UI/UX Designer"], // Dynamic roles array
  })

  // Calculate percentages for circular progress bars
  const completedPercentage = (userData.completedTasks / userData.assignedTasks) * 100
  const pendingPercentage = (userData.pendingTasks / userData.assignedTasks) * 100

  // State for hover effects on progress bars
  const [hoveredStat, setHoveredStat] = useState(null)
  const [isNavbarHovered, setIsNavbarHovered] = useState(false)

  // Set active page to profile when this component mounts
  useEffect(() => {
    // Find the navbar element to detect hover
    const navbar = document.querySelector(".navbar")

    if (navbar) {
      // Check if navbar is already in hover state (has expanded width)
      const isHovered = window.getComputedStyle(navbar).width === "250px"
      setIsNavbarHovered(isHovered)

      // Add event listeners to detect navbar hover
      const handleMouseEnter = () => setIsNavbarHovered(true)
      const handleMouseLeave = () => setIsNavbarHovered(false)

      navbar.addEventListener("mouseenter", handleMouseEnter)
      navbar.addEventListener("mouseleave", handleMouseLeave)

      // Cleanup event listeners
      return () => {
        navbar.removeEventListener("mouseenter", handleMouseEnter)
        navbar.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [])

  return (
    <div className={`content profile-content ${isNavbarHovered ? "navbar-expanded" : ""}`}>
      <div className="profile-header">
        <h2>My Profile</h2>
      </div>

      <div className="profile-info">
        <h3>{userData.name}</h3>
        <p>{userData.email}</p>
        <div className="profile-badges">
          {userData.roles.map((role, index) => (
            <span key={index} className="badge">
              {role}
            </span>
          ))}
        </div>
      </div>

      <div className="task-stats-container">
        <h3 className="stats-title">Task Statistics</h3>
        <div className="task-stats">
          <div
            className={`stat ${hoveredStat === "assigned" ? "stat-hovered" : ""}`}
            onMouseEnter={() => setHoveredStat("assigned")}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <h4>Assigned Tasks</h4>
            <div className="progress-wrapper">
              <CircularProgressbar
                value={userData.assignedTasks}
                maxValue={100}
                text={`${userData.assignedTasks}`}
                strokeWidth={10}
                styles={buildStyles({
                  textSize: "28px",
                  pathColor: "#3498db",
                  textColor: "#2c3e50",
                  trailColor: "#d6eaf8",
                  pathTransition: hoveredStat === "assigned" ? "stroke-dashoffset 0.5s ease 0s" : "none",
                })}
              />
            </div>
            <p className="stat-description">Total tasks assigned to you</p>
          </div>

          <div
            className={`stat ${hoveredStat === "completed" ? "stat-hovered" : ""}`}
            onMouseEnter={() => setHoveredStat("completed")}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <h4>Completed Tasks</h4>
            <div className="progress-wrapper">
              <CircularProgressbar
                value={completedPercentage}
                maxValue={100}
                text={`${completedPercentage.toFixed(0)}%`}
                strokeWidth={10}
                styles={buildStyles({
                  textSize: "28px",
                  pathColor: "#2ecc71",
                  textColor: "#2c3e50",
                  trailColor: "#d5f5e3",
                  pathTransition: hoveredStat === "completed" ? "stroke-dashoffset 0.5s ease 0s" : "none",
                })}
              />
            </div>
            <p className="stat-description">{userData.completedTasks} tasks completed</p>
          </div>

          <div
            className={`stat ${hoveredStat === "pending" ? "stat-hovered" : ""}`}
            onMouseEnter={() => setHoveredStat("pending")}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <h4>Pending Tasks</h4>
            <div className="progress-wrapper">
              <CircularProgressbar
                value={pendingPercentage}
                maxValue={100}
                text={`${pendingPercentage.toFixed(0)}%`}
                strokeWidth={10}
                styles={buildStyles({
                  textSize: "28px",
                  pathColor: "#f39c12",
                  textColor: "#2c3e50",
                  trailColor: "#fdebd0",
                  pathTransition: hoveredStat === "pending" ? "stroke-dashoffset 0.5s ease 0s" : "none",
                })}
              />
            </div>
            <p className="stat-description">{userData.pendingTasks} tasks pending</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
