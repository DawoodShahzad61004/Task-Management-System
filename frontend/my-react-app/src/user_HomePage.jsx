import React, { useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext.jsx";

function User_HomePage() {
  //console.log("User_HomePage component rendered");
  const { isAdmin, isEmployee } = useAuth();
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState([]);


  const fetchTasks = async () => {
    try {
      setIsLoading(true);
  
      const user = JSON.parse(localStorage.getItem("user"));
      //console.log("User from localStorage:", user);

      const checkUserRole = async (user) => {
        try {
          const response = await fetch(`http://localhost:5000/api/tasks/checkUser/${user}`);
      
          if (!response.ok) {
            throw new Error('Failed to fetch user role');
          }
      
          const data = await response.json();
          return data.roleId; // Access the roleId from the object
        } catch (error) {
          console.error('Error checking user role:', error);
          return -1;
        }
      };
      
      const role = await checkUserRole(user); 
      //console.log("User Role ID:", role);   
      localStorage.setItem("userRole", JSON.stringify(role)); // Store user role (admin or employee) in localStorage

      try {
        // 1. Define URLs
        let urlPending = "";
        let urlInProgress = "";
      
        if (role === 1) {
          urlPending = "http://localhost:5000/api/tasks/search/status?status=Pending";
          urlInProgress = "http://localhost:5000/api/tasks/search/status?status=In Progress";
        } else if (role === 0) {
          urlPending = "http://localhost:5000/api/tasks/employee/search/partial-status";
          urlInProgress = "http://localhost:5000/api/tasks/employee/search/status";
        } else {
          console.error("Invalid or unknown role:", role);
          return;
        }
      
        // 2. Fetch both
        const [res1, res2] = await Promise.all([
          fetch(urlPending, { method: "GET", headers: { "Content-Type": "application/json" } }),
          fetch(urlInProgress, { method: "GET", headers: { "Content-Type": "application/json" } }),
        ]);
      
        const [data1, data2] = await Promise.all([res1.json(), res2.json()]);
      
        // 3. Transform both
        const transformedTasks1 = Array.isArray(data1)
          ? data1.map((task, i) => ({
              title: task.title ? `Task ${task.title}` : `Task ${i + 1}`,
              orderID: task.order_id ? `Order ID ${task.order_id}` : `Order ID ${i + 1}`,
              status: task.status || "unknown",
              priority: task.priority || "low",
              description: task.description || "No description"
            }))
          : [];
      
        const transformedTasks2 = Array.isArray(data2)
          ? data2.map((task, i) => ({
              title: task.title ? `Task ${task.title}` : `Task ${i + 1}`,
              orderID: task.order_id ? `Order ID ${task.order_id}` : `Order ID ${i + 1}`,
              status: task.status || "unknown",
              priority: task.priority || "low"
            }))
          : [];
      
        // 4. Combine and set once
        setTasks([...transformedTasks1, ...transformedTasks2]);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    }
    catch (error) {
      console.error("Error fetching tasks:", error);
      setIsLoading(false);
    }      
  };
  

  useEffect(() => {
    fetchTasks();
  }, []);

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
              <div className="category-label">{task.orderID}</div>
              <h4>{task.title}</h4>
              <div><p>{task.description}</p></div>
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
