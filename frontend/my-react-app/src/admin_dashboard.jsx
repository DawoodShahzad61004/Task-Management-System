import React from 'react';

function UserDashboard() {
  return (
    <div className="dashboard">
      <nav className="navbar">
        <h2 className="navbar-title">User Dashboard</h2>
        <ul>
          <li>Home</li>
          <li>Your Tasks</li>
          <li>Settings</li>
          <li>Logout</li>
        </ul>
      </nav>
      <section className="content">
        <h3>Your Tasks</h3>
        <div className="task-card">
          <h4>Task 1</h4>
          <p>Work on frontend design</p>
          <button className="task-button">Update Status</button>
        </div>
        <div className="task-card">
          <h4>Task 2</h4>
          <p>Fix database connection issue</p>
          <button className="task-button">Update Status</button>
        </div>
        {/* More task cards can be added dynamically */}
      </section>
    </div>
  );
}

export default UserDashboard;