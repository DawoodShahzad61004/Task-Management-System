import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import User_HomePage from "./user_HomePage";
import TasksPage from "./Taskspage"; 
import ProfilePage from "./profilepage";
import Navbar from "./Navbar";

function App() {
  const [activePage, setActivePage] = useState("home");

  return (
    <Router>
      <div className="app">
        <Navbar activePage={activePage} setActivePage={setActivePage} />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<User_HomePage />} />  {/* Home page route */}
            <Route path="/tasks" element={<TasksPage />} />  {/* Tasks page route */}
            <Route path="/profile" element={<ProfilePage />} /> {/* Profile page route */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
