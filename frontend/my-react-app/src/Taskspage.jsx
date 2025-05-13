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
  const [tasks, setTasks] = useState([]);
  const [isNavbarHovered, setIsNavbarHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [adminDetails, setAdminDetails] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [isTaskOwner, setIsTaskOwner] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
      const loggedInUserId = JSON.parse(localStorage.getItem("user"));

      let urlPending = "";
      let urlInProgress = "";
      let urlCompleted = "";
      let urlCancelled = "";

      if (role === 1) {
        urlPending =
          "http://localhost:5000/api/tasks/search/status?status=Pending";
        urlInProgress =
          "http://localhost:5000/api/tasks/search/status?status=In Progress";
        urlCompleted =
          "http://localhost:5000/api/tasks/search/status?status=Completed";
        urlCancelled =
          "http://localhost:5000/api/tasks/search/status?status=Cancelled";
      } else if (role === 0) {
        urlPending =
          "http://localhost:5000/api/tasks/employee/search/partial-status";
        urlInProgress =
          "http://localhost:5000/api/tasks/employee/search/status";
      }

      const res1 = await fetch(urlPending);
      const res2 = await fetch(urlInProgress);

      // For non-admin, we only need Pending and In Progress tasks
      const [data1, data2] = await Promise.all([res1.json(), res2.json()]);

      const transformTasks = (data) =>
        Array.isArray(data)
          ? data.map((task) => ({
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

      let combinedTasks = [];
      if (role === 1) {
        const res3 = await fetch(urlCompleted);
        const res4 = await fetch(urlCancelled);
        const [data3, data4] = await Promise.all([res3.json(), res4.json()]);
        combinedTasks = [
          ...transformTasks(data1),
          ...transformTasks(data2),
          ...transformTasks(data3), // Completed tasks
          ...transformTasks(data4) // Cancelled tasks
        ];
      } else if (role === 0) {
        // Only combine Pending and In Progress for non-admin
        combinedTasks = [...transformTasks(data1), ...transformTasks(data2)];
      }
      combinedTasks.sort((a, b) => a.orderID.localeCompare(b.orderID));
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

  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Unknown";
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "UTC",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(dateString));
  };

  const openTaskDetail = async (task) => {
    setSelectedTask(task);
    const loggedInUserId = JSON.parse(localStorage.getItem("user"));
    // Make sure we're comparing the same data types
    const taskOwnerStatus = task.adminId === Number.parseInt(loggedInUserId);
    setIsTaskOwner(taskOwnerStatus);
    console.log("Task owner check:", {
      userId: loggedInUserId,
      adminId: task.adminId,
      isOwner: taskOwnerStatus
    });
    setIsPopupOpen(true);
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
      const userRole = JSON.parse(localStorage.getItem("userRole"));
      const endpoint =
        userRole === 1
          ? `http://localhost:5000/api/tasks/status`
          : `http://localhost:5000/api/tasks/employee/status`;

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: selectedTask.id,
          status: newStatus
        })
      });

      if (!response.ok) {
        throw new Error("Failed to update task status");
      }

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

  const handlePriorityChange = async (e) => {
    const newPriority = e.target.value;
    if (!selectedTask || selectedTask.priority === newPriority) return;

    try {
      const response = await fetch("http://localhost:5000/api/tasks/priority", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: selectedTask.id,
          priority: newPriority
        })
      });

      if (!response.ok) throw new Error("Failed to update priority");

      const updatedTasks = tasks.map((task) =>
        task.id === selectedTask.id ? { ...task, priority: newPriority } : task
      );

      setTasks(updatedTasks);
      setSelectedTask({ ...selectedTask, priority: newPriority });
    } catch (error) {
      console.error("Error updating priority:", error);
      alert("Failed to update task priority. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      const orderId = selectedTask.orderID.replace(/\D/g, ""); // removes all non-digits
      const response = await fetch(
        `http://localhost:5000/api/tasks/${orderId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Order deleted successfully!");
        // Optionally refresh list or redirect
      } else {
        alert(`Error: ${data.error || "Failed to delete order."}`);
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Something went wrong while deleting the order.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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

  const userRole = JSON.parse(localStorage.getItem("userRole"));

  const filteredTasks = tasks.filter((task) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      task.title.toLowerCase().includes(lowerSearch) ||
      task.description.toLowerCase().includes(lowerSearch)
    );
  });

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="tasks-list-container">
          <h3>My Tasks</h3>
          <div className="tasks-list">
            {isLoading ? (
              <p>Loading tasks...</p>
            ) : (
              filteredTasks.map((task, index) => (
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
                    <div
                      className="loading-spinner-container"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "15px"
                      }}
                    >
                      <FaSpinner
                        className="spinner-icon"
                        style={{ fontSize: "1.5rem", color: "#3498db" }}
                      />
                    </div>
                  )}
                </div>

                <div className="detail-section">
                  <div className="section-header">
                    <FaClock className="section-icon" />
                    <h4>Status & Priority</h4>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    {userRole === 0 || (userRole === 1 && isTaskOwner) ? (
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
                    ) : (
                      <span
                        className={`task-status ${selectedTask.status
                          .toLowerCase()
                          .replace(" ", "")}`}
                      >
                        {selectedTask.status.charAt(0).toUpperCase() +
                          selectedTask.status.slice(1)}
                      </span>
                    )}
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Priority:</span>
                    {userRole === 1 && isTaskOwner ? (
                      <select
                        className={`custom-select ${selectedTask.priority.toLowerCase()}`}
                        value={selectedTask.priority}
                        onChange={handlePriorityChange}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    ) : (
                      <span
                        className={`task-priority ${selectedTask.priority.toLowerCase()}`}
                      >
                        {selectedTask.priority.charAt(0).toUpperCase() +
                          selectedTask.priority.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {userRole === 1 && isTaskOwner ? (
                <div className="delete-button-wrapper">
                  <button
                    className="delete-button"
                    onClick={() => handleDelete()} // pass orderId here
                  >
                    Delete
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TasksPage;
