// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { role: 'admin' or 'student' }
  const navigate = useNavigate();

  const login = (userData) => {
    setUser(userData);
    if (userData.role === 'admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/student-dashboard');
    }
  };

  const logout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
