"use client";

import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useLocation } from "react-router-dom";

function ProfilePage({ setActivePage }) {
  const location = useLocation();
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user")); // Integer ID
  const userRole = JSON.parse(localStorage.getItem("userRole")); // 0 or 1
  const [hoveredStat, setHoveredStat] = useState(null);
  const [isNavbarHovered, setIsNavbarHovered] = useState(false);
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    acceptedTasks: 42,
    cancelledTasks: 16,
    lateTasks: 33,
    roles: "Team Lead",
  });
  const [cancelledPercentage, setCancelledPercentage] = useState(0);
  const [lateSubmittedPercentage, setLateSubmittedPercentage] = useState(0);
  const userTRole = localStorage.getItem("userRole");

  const fetchUserDetails = async () => {
    try {
      if (!user || userRole === null) {
        throw new Error("User ID or Role not found in localStorage");
      }

      const response = await fetch(
        "http://localhost:5000/api/tasks/userDetails",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            userId: user,
            userRole: userRole,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      const data = await response.json();
      //console.log("Fetched User Details:", data);
      setUserDetails(data);

      let value = data.ordersAccepted;
      if (userRole === 1)
        value = userDetails.ordersAssigned;
      else if (userRole === 0)
        value = userDetails.ordersAccepted;

      setUserData({
        name: `${userDetails.fName} ${userDetails.lName}` || "John Doe",
        email: `${userDetails.email}` || "john.doe@example.com",
        acceptedTasks: value || 42,
        cancelledTasks: userDetails.ordersCancelled || 16,
        lateTasks: userDetails.ordersSubmittedLate || 33,
        roles: userDetails.PersonnelRank || "Team Lead",
      });

      // Calculate percentages for circular progress bars
      setCancelledPercentage(
        (userData.cancelledTasks /
          (userData.acceptedTasks + userData.cancelledTasks)) *
          100
      );
      setLateSubmittedPercentage(
        (userData.lateTasks / userData.acceptedTasks) * 100
      );

      // State for hover effects on progress bars
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError(err.message);
    }
  };
  useEffect(() => {
    fetchUserDetails();
  });

  // Set active page to profile when this component mounts
  useEffect(() => {
    // Find the navbar element to detect hover
    const navbar = document.querySelector(".navbar");

    if (navbar) {
      // Check if navbar is already in hover state (has expanded width)
      const isHovered = window.getComputedStyle(navbar).width === "250px";
      setIsNavbarHovered(isHovered);

      // Add event listeners to detect navbar hover
      const handleMouseEnter = () => setIsNavbarHovered(true);
      const handleMouseLeave = () => setIsNavbarHovered(false);

      navbar.addEventListener("mouseenter", handleMouseEnter);
      navbar.addEventListener("mouseleave", handleMouseLeave);

      // Cleanup event listeners
      return () => {
        navbar.removeEventListener("mouseenter", handleMouseEnter);
        navbar.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, []);

  if (userRole === 0) {
    return (
      <div
        className={`content profile-content ${
          isNavbarHovered ? "navbar-expanded" : ""
        }`}
      >
        <div className="profile-header">
          <h2>My Profile</h2>
        </div>

        <div className="profile-info">
          <h3>{userData.name}</h3>
          <p>{userData.email}</p>
          <div className="profile-badges">
            {Array.isArray(userData.roles) ? (
              userData.roles.map((role, index) => (
                <span key={index} className="badge">
                  {role}
                </span>
              ))
            ) : (
              <span className="badge">{userData.roles}</span>
            )}
          </div>
        </div>

        <div className="task-stats-container">
          <h3 className="stats-title">Task Statistics</h3>
          <div className="task-stats">
            <div
              className={`stat ${
                hoveredStat === "assigned" ? "stat-hovered" : ""
              }`}
              onMouseEnter={() => setHoveredStat("assigned")}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <h4>Accepted Tasks</h4>
              <div className="progress-wrapper">
                <CircularProgressbar
                  value={userData.acceptedTasks}
                  maxValue={100}
                  text={`${userData.acceptedTasks}`}
                  strokeWidth={10}
                  styles={buildStyles({
                    textSize: "28px",
                    pathColor: "#3498db",
                    textColor: "#2c3e50",
                    trailColor: "#d6eaf8",
                    pathTransition:
                      hoveredStat === "assigned"
                        ? "stroke-dashoffset 0.5s ease 0s"
                        : "none",
                  })}
                />
              </div>
              <p className="stat-description">Total tasks accepted by you</p>
            </div>

            <div
              className={`stat ${
                hoveredStat === "completed" ? "stat-hovered" : ""
              }`}
              onMouseEnter={() => setHoveredStat("completed")}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <h4>Cancelled Tasks</h4>
              <div className="progress-wrapper">
                <CircularProgressbar
                  value={cancelledPercentage}
                  maxValue={100}
                  text={`${cancelledPercentage.toFixed(0)}%`}
                  strokeWidth={10}
                  styles={buildStyles({
                    textSize: "28px",
                    pathColor: "#2ecc71",
                    textColor: "#2c3e50",
                    trailColor: "#d5f5e3",
                    pathTransition:
                      hoveredStat === "completed"
                        ? "stroke-dashoffset 0.5s ease 0s"
                        : "none",
                  })}
                />
              </div>
              <p className="stat-description">
                {userData.cancelledTasks} tasks cancelled
              </p>
            </div>

            <div
              className={`stat ${
                hoveredStat === "pending" ? "stat-hovered" : ""
              }`}
              onMouseEnter={() => setHoveredStat("pending")}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <h4>Late-Submitted Tasks</h4>
              <div className="progress-wrapper">
                <CircularProgressbar
                  value={lateSubmittedPercentage}
                  maxValue={100}
                  text={`${lateSubmittedPercentage.toFixed(0)}%`}
                  strokeWidth={10}
                  styles={buildStyles({
                    textSize: "28px",
                    pathColor: "#f39c12",
                    textColor: "#2c3e50",
                    trailColor: "#fdebd0",
                    pathTransition:
                      hoveredStat === "pending"
                        ? "stroke-dashoffset 0.5s ease 0s"
                        : "none",
                  })}
                />
              </div>
              <p className="stat-description">
                {userData.lateTasks} task(s) have been submitted late
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (userRole === 1) {
    return (
      <div
        className={`content profile-content ${
          isNavbarHovered ? "navbar-expanded" : ""
        }`}
      >
        <div className="profile-header">
          <h2>My Profile</h2>
        </div>

        <div className="profile-info">
          <h3>{userData.name}</h3>
          <p>{userData.email}</p>
          <div className="profile-badges">
            {Array.isArray(userData.roles) ? (
              userData.roles.map((role, index) => (
                <span key={index} className="badge">
                  {role}
                </span>
              ))
            ) : (
              <span className="badge">{userData.roles}</span>
            )}
          </div>
        </div>

        <div className="task-stats-container">
          <h3 className="stats-title">Task Statistics</h3>
          <div className="task-stats">
            <div
              className={`stat ${
                hoveredStat === "assigned" ? "stat-hovered" : ""
              }`}
              onMouseEnter={() => setHoveredStat("assigned")}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <h4>Assigned Tasks</h4>
              <div className="progress-wrapper">
                <CircularProgressbar
                  value={userData.acceptedTasks}
                  maxValue={100}
                  text={`${userData.acceptedTasks}`}
                  strokeWidth={10}
                  styles={buildStyles({
                    textSize: "28px",
                    pathColor: "#3498db",
                    textColor: "#2c3e50",
                    trailColor: "#d6eaf8",
                    pathTransition:
                      hoveredStat === "assigned"
                        ? "stroke-dashoffset 0.5s ease 0s"
                        : "none",
                  })}
                />
              </div>
              <p className="stat-description">Total tasks assigned by you</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfilePage;
