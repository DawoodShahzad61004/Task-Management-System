"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

function AddTask() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [employees, setEmployees] = useState([])
  const navigate = useNavigate()

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "Medium",
    employee_email: "",
  })

  const [formErrors, setFormErrors] = useState({})
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Fetch employees for assignment
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/tasks/employees")
        if (response.ok) {
          const data = await response.json()
          setEmployees(data)
        }
      } catch (error) {
        console.error("Error fetching employees:", error)
      }
    }

    fetchEmployees()
  }, [])

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      const userRole = JSON.parse(localStorage.getItem("userRole"))
      if (userRole !== 1) {
        navigate("/")
      }
    }

    checkAdminStatus()
  }, [navigate])

  // Monitor navbar hover state
  useEffect(() => {
    const navbar = document.querySelector(".navbar")
    if (navbar) {
      const isHovered = window.getComputedStyle(navbar).width === "250px"
      setIsNavbarOpen(isHovered)

      const handleMouseEnter = () => setIsNavbarOpen(true)
      const handleMouseLeave = () => setIsNavbarOpen(false)

      navbar.addEventListener("mouseenter", handleMouseEnter)
      navbar.addEventListener("mouseleave", handleMouseLeave)

      return () => {
        navbar.removeEventListener("mouseenter", handleMouseEnter)
        navbar.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setTaskData({
      ...taskData,
      [name]: value,
    })

    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!taskData.title.trim()) {
      errors.title = "Title is required"
    }

    if (!taskData.description.trim()) {
      errors.description = "Description is required"
    }

    if (!taskData.deadline) {
      errors.deadline = "Deadline is required"
    } else {
      const selectedDate = new Date(taskData.deadline)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (selectedDate < today) {
        errors.deadline = "Deadline cannot be in the past"
      }
    }

    if (!taskData.employee_email) {
      errors.assignedTo = "Please select an employee"
    }

    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsLoading(true)

    try {
      const adminId = JSON.parse(localStorage.getItem("user"))
      console.log("Admin ID:", adminId)

      const response = await fetch("http://localhost:5000/api/tasks/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: taskData.title,
          description: taskData.description,
          deadline: taskData.deadline, 
          priority: taskData.priority,
          employee_email: taskData.employee_email
        }),
      })
      console.log("Data sent:", {
        title: taskData.title,
        description: taskData.description,
        deadline: taskData.deadline,
        priority: taskData.priority,
        employee_email: taskData.employee_email,
        admin_id: adminId
      })
      console.log("Response status:", response.status)
      if (response.ok) {
         console.log("✅ Task created in DB!");
        setSubmitSuccess(true)
        // Reset form
        setTaskData({
          title: "",
          description: "",
          deadline: "",
          priority: "Medium",
          employee_email: "",
        })

        // Redirect after short delay
        setTimeout(() => {
          navigate("/")
        }, 2000)
      } else {
        const data = await response.json()
        setFormErrors({ submit: data.message || "Failed to create task" })
      }
    } catch (error) {
      console.error("Error creating task:", error)
      setFormErrors({ submit: "Network error. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="dashboard">
      <section className={`content ${isNavbarOpen ? "navbar-expanded" : ""}`}>
        <div className="header">
          <h2 className="header-title">ADD NEW TASK</h2>
          <div className="profile-image">
            <img src="/DefaultImage.png?height=40&width=40" alt="Profile" />
          </div>
        </div>

        <div className="add-task-container">
          {submitSuccess ? (
            <div className="success-message">
              <div className="success-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#27ae60"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3>Task Created Successfully!</h3>
              <p>Redirecting to dashboard...</p>
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
            </div>
          ) : (
            <div className="form-card">
              <div className="form-header">
                <div className="form-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
                <h3>Create New Task</h3>
                <p>Fill in the details below to create a new task</p>
              </div>

              <form className="add-task-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="title">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="4 7 4 4 20 4 20 7"></polyline>
                      <line x1="9" y1="20" x2="15" y2="20"></line>
                      <line x1="12" y1="4" x2="12" y2="20"></line>
                    </svg>
                    Task Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={taskData.title}
                    onChange={handleChange}
                    className={formErrors.title ? "error" : ""}
                    placeholder="Enter task title"
                  />
                  {formErrors.title && <span className="error-message">{formErrors.title}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="description">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="21" y1="6" x2="3" y2="6"></line>
                      <line x1="21" y1="12" x2="3" y2="12"></line>
                      <line x1="21" y1="18" x2="3" y2="18"></line>
                    </svg>
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={taskData.description}
                    onChange={handleChange}
                    rows="4"
                    className={formErrors.description ? "error" : ""}
                    placeholder="Describe the task in detail"
                  ></textarea>
                  {formErrors.description && <span className="error-message">{formErrors.description}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="deadline">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      Deadline
                    </label>
                    <input
                      type="date"
                      id="deadline"
                      name="deadline"
                      value={taskData.deadline}
                      onChange={handleChange}
                      className={formErrors.deadline ? "error" : ""}
                    />
                    {formErrors.deadline && <span className="error-message">{formErrors.deadline}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="priority">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                      </svg>
                      Priority
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={taskData.priority}
                      onChange={handleChange}
                      className={`priority-select ${taskData.priority.toLowerCase()}`}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="employee_email">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Assign To
                  </label>
                  <select
                    id="employee_email"
                    name="employee_email"
                    value={taskData.employee_email}
                    onChange={handleChange}
                    className={formErrors.employee_email ? "error" : ""}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((employee) => (
                      <option key={employee.employee_id} value={employee.email}>
                        {employee.email}
                      </option>
                    ))}
                  </select>
                  {formErrors.employee_email && <span className="error-message">{formErrors.employee_email}</span>}
                </div>

                {formErrors.submit && <div className="error-message submit-error">{formErrors.submit}</div>}

                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={() => navigate("/")}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <svg
                          className="spinner"
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="12" y1="2" x2="12" y2="6"></line>
                          <line x1="12" y1="18" x2="12" y2="22"></line>
                          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                          <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                          <line x1="2" y1="12" x2="6" y2="12"></line>
                          <line x1="18" y1="12" x2="22" y2="12"></line>
                          <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                          <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                          <polyline points="17 21 17 13 7 13 7 21"></polyline>
                          <polyline points="7 3 7 8 15 8"></polyline>
                        </svg>
                        Create Task
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default AddTask
