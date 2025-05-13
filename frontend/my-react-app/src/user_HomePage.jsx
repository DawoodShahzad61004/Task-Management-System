"use client";

import { useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa";

function User_HomePage() {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    pending: false,
    inProgress: false,
  });
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [tasks, setTasks] = useState([]); // State to store tasks
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [lastName, setLastName] = useState("");

  const toggleFilter = () => setShowFilter(!showFilter);

  const handleFilterChange = (filter) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filter]: !prevFilters[filter],
    }));
  };

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

      const fetchUrls = [];

      if (
        selectedFilters.pending ||
        (!selectedFilters.pending && !selectedFilters.inProgress)
      ) {
        fetchUrls.push(fetch(urlPending));
      }

      if (
        selectedFilters.inProgress ||
        (!selectedFilters.pending && !selectedFilters.inProgress)
      ) {
        fetchUrls.push(fetch(urlInProgress));
      }

      const responses = await Promise.all(fetchUrls);
      const dataArray = await Promise.all(responses.map((res) => res.json()));

      // Combine and transform data
      let combinedTasks = [];
      dataArray.forEach((data, index) => {
        const transformed = Array.isArray(data)
          ? data.map((task, i) => ({
              title: task.title || `Task ${i + 1}`,
              orderID: `Order ID ${task.order_id || i + 1}`,
              status: task.status || "unknown",
              priority: task.priority || "low",
              description: task.description || "No description",
            }))
          : [];
        combinedTasks = combinedTasks.concat(transformed);
      });

      combinedTasks.sort((a, b) => a.orderID.localeCompare(b.orderID));
      setTasks(combinedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserLastName = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userRole = JSON.parse(localStorage.getItem("userRole"));

      if (!user || userRole === null) throw new Error("Missing user info");

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

      if (!response.ok) throw new Error("Failed to fetch user details");

      const data = await response.json();
      setLastName(data.lName || "User");
    } catch (err) {
      console.error("Error fetching last name:", err);
      setLastName("User"); // fallback
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUserLastName(); // Fetch the last name when the page loads
  }, []);

  useEffect(() => {
    fetchTasks(); // Re-fetch when filters change
    fetchUserLastName();
  }, [selectedFilters]);

  // Monitor navbar hover state
  useEffect(() => {
    const navbar = document.querySelector(".navbar");
    if (navbar) {
      const isHovered = window.getComputedStyle(navbar).width === "250px";
      setIsNavbarOpen(isHovered);

      const handleMouseEnter = () => setIsNavbarOpen(true);
      const handleMouseLeave = () => setIsNavbarOpen(false);

      navbar.addEventListener("mouseenter", handleMouseEnter);
      navbar.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        navbar.removeEventListener("mouseenter", handleMouseEnter);
        navbar.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, []);

  return (
    <div className="dashboard">
      <section className={`content ${isNavbarOpen ? "navbar-expanded" : ""}`}>
        <div className="header">
          <h2 className="header-title">HOME PAGE</h2>
          <div className="search-filter-container">
            <input
              type="text"
              className="search-bar"
              placeholder="Search tasks..."
            />
            <div className="filter-container">
              <FaFilter
                className={`filter-icon ${
                  selectedFilters.pending || selectedFilters.inProgress
                    ? "selected"
                    : ""
                }`}
                onClick={toggleFilter}
              />
              {showFilter && (
                <div className="filter-dropdown">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedFilters.pending}
                      onChange={() => handleFilterChange("pending")}
                    />
                    Pending
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedFilters.inProgress}
                      onChange={() => handleFilterChange("inProgress")}
                    />
                    In Progress
                  </label>
                </div>
              )}
            </div>
          </div>
          <div className="profile-image">
            <img src="/DefaultImage.png?height=40&width=40" alt="Profile" />
          </div>
        </div>
        <h1 className="dashboard_title">
          Welcome back, <span>{lastName}!</span>
        </h1>
        <div className="task-grid">
          {isLoading ? (
            <p>Loading tasks...</p>
          ) : (
            tasks.map((task, index) => (
              <div
                key={index}
                className={`task-card ${task.status.toLowerCase()}`}
              >
                <div className="category-label">{task.orderID}</div>{" "}
                {/* Corrected Order ID display */}
                <h4>{task.title}</h4>
                <p>{task.description}</p> {/* Added description to be shown */}
                <div className="tags">
                  {/* Apply correct status class */}
                  <div
                    className={`task-status ${task.status
                      .replace(" ", "")
                      .toLowerCase()}`}
                  >
                    <span>{task.status}</span> {/* Status tag */}
                  </div>
                  {/* Apply correct priority class */}
                  <div
                    className={`task-priority ${task.priority.toLowerCase()}`}
                  >
                    <span>{task.priority}</span> {/* Priority tag */}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default User_HomePage;
