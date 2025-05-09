"use client"

import { useState, useEffect } from "react"

function TasksPage() {
  const [isNavbarHovered, setIsNavbarHovered] = useState(false)

  useEffect(() => {
    const navbar = document.querySelector(".navbar")
    if (navbar) {
      const isHovered = window.getComputedStyle(navbar).width === "250px"
      setIsNavbarHovered(isHovered)

      const handleMouseEnter = () => setIsNavbarHovered(true)
      const handleMouseLeave = () => setIsNavbarHovered(false)

      navbar.addEventListener("mouseenter", handleMouseEnter)
      navbar.addEventListener("mouseleave", handleMouseLeave)

      return () => {
        navbar.removeEventListener("mouseenter", handleMouseEnter)
        navbar.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [])

  return (
    <div className={`content ${isNavbarHovered ? "navbar-expanded" : ""}`}>
      <div className="tasks-container">
        <div className="header">
          <h2 className="header-title">TASKS PAGE</h2>
          <div className="search-filter-container">
            <input type="text" className="search-bar" placeholder="Search tasks..." />
          </div>
        </div>

        <div className="tasks-list-container">
          <h3>My Tasks</h3>
          <div className="tasks-list">
            <div className="task-item">
              <div className="task-header">
                <h4>Project Documentation</h4>
                <span className="task-badge high">High</span>
              </div>
              <p>Complete the documentation for the new project features</p>
              <div className="task-footer">
                <span className="task-status inProgress">In Progress</span>
                <span className="task-due">Due: Tomorrow</span>
              </div>
            </div>

            <div className="task-item">
              <div className="task-header">
                <h4>Bug Fixes</h4>
                <span className="task-badge medium">Medium</span>
              </div>
              <p>Fix reported bugs in the login system</p>
              <div className="task-footer">
                <span className="task-status pending">Pending</span>
                <span className="task-due">Due: Next Week</span>
              </div>
            </div>

            <div className="task-item">
              <div className="task-header">
                <h4>UI Improvements</h4>
                <span className="task-badge low">Low</span>
              </div>
              <p>Implement design changes to improve user experience</p>
              <div className="task-footer">
                <span className="task-status completed">Completed</span>
                <span className="task-due">Completed: Yesterday</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TasksPage
