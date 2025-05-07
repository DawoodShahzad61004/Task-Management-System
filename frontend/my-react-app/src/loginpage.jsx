"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"

function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState("") // Changed from username to email to match backend
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Send login request to backend
      const response = await fetch("http://localhost:5000/api/tasks/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password })
      })

      console.log("Response object:", response);
      console.log("Response.ok:", response.ok);

      const data = await response.json();
      console.log("Response JSON (data):", data);


      if (response.ok) {
        // Check if login was successful based on RoleID
        console.log("RoleID:", data.RoleID);
        console.log("Data object:", data);
        if (data !== undefined && data !== -1) {
          const loginSuccess = login(data);
          console.log("loginSuccess:", loginSuccess);
          if (loginSuccess) {
            navigate("/");
          } else {
            setError("Failed to set user session. Please try again.");
          }
        } else {
          setError("Invalid credentials. Please try again.");
        }
      } else {
        // Handle error response from server
        setError(data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h1 className="login-title">Welcome to SYNC-OPS</h1>
        <p className="login-para">Please enter your credentials to log in.</p>

        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  )
}

export default LoginPage
