import React, { useState } from "react";
import { FaFilter } from "react-icons/fa";
import Navbar from "./Navbar";

function User_HomePage() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const tasks = [
    {
      title: "Task 1",
      category: "Category 1",
      status: "inProgress",
      priority: "high",
      users: ["user1", "user2"]
    },
    {
      title: "Task 2",
      category: "Category 2",
      status: "pending",
      priority: "medium",
      users: ["user3"]
    },
    {
      title: "Task 3",
      category: "Category 3",
      status: "completed",
      priority: "low",
      users: ["user4", "user5"]
    },
    {
      title: "Task 4",
      category: "Category 4",
      status: "canceled",
      priority: "high",
      users: ["user6"]
    }
  ];

  const [activePage, setActivePage] = useState("home");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    pending: false,
    inProgress: false
  });

  const toggleFilter = () => setShowFilter(!showFilter);

  const handleFilterChange = (filter) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filter]: !prevFilters[filter],
    }));
  };

  return (
    <div className="dashboard">
       <Navbar
        activePage={activePage} 
        setActivePage={setActivePage} 
        toggleFilter={toggleFilter} 
        showFilter={showFilter} 
        selectedFilters={selectedFilters} 
        handleFilterChange={handleFilterChange} 
      />
      <section className="content">
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
                className={`filter-icon ${selectedFilters.pending || selectedFilters.inProgress ? "selected" : ""}`}
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
            <img src="DefaultImage.png" alt="Dummy" />
          </div>
        </div>
        <h1 className="dashboard_title">
          Welcome back, <span>FBI!</span>
        </h1>
        <div className="task-grid">
          {tasks.map((task, index) => (
            <div key={index} className={`task-card ${task.status}`}>
              <div className="category-label">{task.category}</div>
              <h4>{task.title}</h4>
              <p>Description goes here...</p>
              <div className="tags">
              <div className="task-status">
                <span className={task.status}>{task.status}</span>
              </div>
              <div className="task-priority">
                <span className={task.priority}>{task.priority}</span>
              </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default User_HomePage;
