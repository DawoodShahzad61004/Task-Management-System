import React, { createContext, useState, useContext } from "react";

// Create AuthContext to manage authentication state
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (user) => {
    if (user.RoleID === -1) {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(user)); // Store user info
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("user");  // Remove user info from localStorage
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
