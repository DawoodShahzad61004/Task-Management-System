import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import User_HomePage from "./user_HomePage";
import LoginPage from "./loginpage";
import TasksPage from "./Taskspage";
import ProfilePage from "./profilepage";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext.jsx";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  const { isAuthenticated, loading } = useAuth();
  const [activePage, setActivePage] = useState("home");

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <div className="app">
        {isAuthenticated && (
          <Navbar activePage={activePage} setActivePage={setActivePage} />
        )}
        <div className="main-content">
          <Routes>
            {/* Public route */}
            <Route
              path="/login"
              element={
                isAuthenticated ? <Navigate to="/" /> : <LoginPage />
              }
            />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <User_HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <TasksPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all route: redirect to login if unknown path */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
