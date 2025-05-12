"use client";

import { useState, useEffect } from "react";
import {
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaExclamationTriangle,
  FaSpinner
} from "react-icons/fa";

function TasksPage() {
  const [tasks, setTasks] = useState([]); // Store tasks in state
  const [isNavbarHovered, setIsNavbarHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [adminDetails, setAdminDetails] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const checkUserRole = async (user) => {
        const response = await fetch(
          `http://localhost:5000/api/tasks/checkUser/${user}`
        );
        if (!response.ok) throw new Error("Failed to fetch user role");
        const data = await response.json();
        return data.roleId;
      };

      const role = await checkUserRole(user);
      localStorage.setItem("userRole", JSON.stringify(role));

      let urlPending = "";
      let urlInProgress = "";

      if (role === 1) {
        urlPending =
          "http://localhost:5000/api/tasks/search/status?status=Pending";
        urlInProgress =
          "http://localhost:5000/api/tasks/search/status?status=In Progress";
      } else if (role === 0) {
        urlPending =
          "http://localhost:5000/api/tasks/employee/search/partial-status";
        urlInProgress =
          "http://localhost:5000/api/tasks/employee/search/status";
      }

      const [res1, res2] = await Promise.all([
        fetch(urlPending),
        fetch(urlInProgress)
      ]);
      const [data1, data2] = await Promise.all([res1.json(), res2.json()]);

      const transformedTasks1 = Array.isArray(data1)
        ? data1.map((task) => ({
            id: task.order_id || task.id,
            title: task.title || "Untitled Task",
            orderID: `Order ID ${task.order_id || task.id}`,
            status: task.status || "Pending",
            priority: task.priority || "Low",
            description: task.description || "No description",
            deadline: formatDate(task.deadline) || "No deadline",
            createdAt: formatDateTime(task.created_at) || "Unknown",
            adminId: task.admin_id
          }))
        : [];

      const transformedTasks2 = Array.isArray(data2)
        ? data2.map((task) => ({
            id: task.order_id || task.id,
            title: task.title || "Untitled Task",
            orderID: `Order ID ${task.order_id || task.id}`,
            status: task.status || "Pending",
            priority: task.priority || "Low",
            description: task.description || "No description",
            deadline: formatDate(task.deadline) || "No deadline",
            createdAt: formatDateTime(task.created_at) || "Unknown",
            adminId: task.admin_id
          }))
        : [];

      // Combine and sort tasks by orderID
      const combinedTasks = [...transformedTasks1, ...transformedTasks2];
      combinedTasks.sort((a, b) => a.orderID.localeCompare(b.orderID)); // Sorting tasks by orderID
      setTasks(combinedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdminDetails = async (adminId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/adminDetails`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ admin_id: adminId })
        }
      );
      if (!response.ok) throw new Error("Failed to fetch admin details");
      const data = await response.json();
      return {
        name: data.FullName,
        email: data.email
      };
    } catch (error) {
      console.error("Error fetching admin details:", error);
      return {
        name: "Unknown Admin",
        email: "admin@example.com"
      };
    }
  };

  // Function to format date without time
  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Get date part only (YYYY-MM-DD)
  };

  // Function to format date with time
  const formatDateTime = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const openTaskDetail = async (task) => {
    setSelectedTask(task);
    setIsPopupOpen(true);

    // Fetch admin details when opening the popup
    const adminData = await fetchAdminDetails(task.adminId);
    setAdminDetails(adminData);
  };

  const closeTaskDetail = () => {
    setIsPopupOpen(false);
    setAdminDetails(null);
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (!selectedTask || selectedTask.status === newStatus) return;

    setStatusUpdating(true);

    try {
      // Get user role and ID from localStorage
      const userRole = JSON.parse(localStorage.getItem("userRole"));
      const userId = JSON.parse(localStorage.getItem("user"));

      // Determine which API endpoint to use based on user role
      const endpoint =
        userRole === 1
          ? `http://localhost:5000/api/tasks/admin/updateStatus`
          : `http://localhost:5000/api/tasks/employee/updateStatus`;

      // Make API call to update status
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          orderId: selectedTask.id,
          status: newStatus
        })
      });

      if (!response.ok) {
        throw new Error("Failed to update task status");
      }

      // Update local state
      const updatedTasks = tasks.map((task) =>
        task.id === selectedTask.id ? { ...task, status: newStatus } : task
      );

      setTasks(updatedTasks);
      setSelectedTask({ ...selectedTask, status: newStatus });
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("Failed to update task status. Please try again.");
    } finally {
      setStatusUpdating(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Monitor navbar hover state
  useEffect(() => {
    const navbar = document.querySelector(".navbar");
    if (navbar) {
      const isHovered = window.getComputedStyle(navbar).width === "250px";
      setIsNavbarHovered(isHovered);

      const handleMouseEnter = () => setIsNavbarHovered(true);
      const handleMouseLeave = () => setIsNavbarHovered(false);

      navbar.addEventListener("mouseenter", handleMouseEnter);
      navbar.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        navbar.removeEventListener("mouseenter", handleMouseEnter);
        navbar.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, []);

  return (
    <div className={`content ${isNavbarHovered ? "navbar-expanded" : ""}`}>
      <div className="tasks-container">
        <div className="header">
          <h2 className="header-title">TASKS PAGE</h2>
          <div className="search-filter-container">
            <input
              type="text"
              className="search-bar"
              placeholder="Search tasks..."
            />
          </div>
        </div>

        <div className="tasks-list-container">
          <h3>My Tasks</h3>
          <div className="tasks-list">
            {isLoading ? (
              <p>Loading tasks...</p>
            ) : (
              tasks.map((task, index) => (
                <div
                  key={index}
                  className="task-item"
                  onClick={() => openTaskDetail(task)}
                >
                  <div className="task-header">
                    <h4>{task.title}</h4>
                    <span
                      className={`task-priority ${task.priority.toLowerCase()}`}
                    >
                      {task.priority.charAt(0).toUpperCase() +
                        task.priority.slice(1)}
                    </span>
                  </div>
                  <p>{task.description}</p>
                  <div className="task-footer">
                    <span
                      className={`task-status ${task.status
                        .toLowerCase()
                        .replace(" ", "")}`}
                    >
                      {task.status.charAt(0).toUpperCase() +
                        task.status.slice(1)}
                    </span>
                    <span className="task-due">Due: {task.deadline}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {isPopupOpen && selectedTask && (
        <div className="task-detail-popup-overlay" onClick={closeTaskDetail}>
          <div
            className="task-detail-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="popup-header">
              <h3>{selectedTask.title}</h3>
              <button className="close-button" onClick={closeTaskDetail}>
                ×
              </button>
            </div>

            <div className="popup-content">
              <div className="detail-row">
                <div className="detail-section">
                  <div className="section-header">
                    <FaExclamationTriangle className="section-icon" />
                    <h4>Task Details</h4>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Order ID:</span>
                    <span className="detail-value">{selectedTask.orderID}</span>
                  </div>
                  <div className="detail-item description">
                    <span className="detail-label">Description:</span>
                    <span className="detail-value">
                      {selectedTask.description}
                    </span>
                  </div>
                </div>

                <div className="detail-section">
                  <div className="section-header">
                    <FaCalendarAlt className="section-icon" />
                    <h4>Timeline</h4>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Created:</span>
                    <span className="detail-value">
                      {selectedTask.createdAt}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Due Date:</span>
                    <span className="detail-value">
                      {selectedTask.deadline}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-row">
                <div className="detail-section">
                  <div className="section-header">
                    <FaUser className="section-icon" />
                    <h4>Assigned By</h4>
                  </div>
                  {adminDetails ? (
                    <>
                      <div className="detail-item">
                        <span className="detail-label">Name:</span>
                        <span className="detail-value">
                          {adminDetails.name}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">
                          {adminDetails.email}
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="loading-text">Loading admin details...</p>
                  )}
                </div>

                <div className="detail-section">
                  <div className="section-header">
                    <FaClock className="section-icon" />
                    <h4>Status & Priority</h4>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <div className="status-dropdown-container">
                      <div className="custom-select-wrapper">
                        <select
                          className={`custom-select ${selectedTask.status
                            .toLowerCase()
                            .replace(" ", "")}`}
                          value={selectedTask.status}
                          onChange={handleStatusChange}
                          disabled={statusUpdating}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        {statusUpdating && (
                          <div className="spinner-container">
                            <FaSpinner className="spinner-icon" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Priority:</span>
                    <span
                      className={`task-priority ${selectedTask.priority.toLowerCase()}`}
                    >
                      {selectedTask.priority.charAt(0).toUpperCase() +
                        selectedTask.priority.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TasksPage;
