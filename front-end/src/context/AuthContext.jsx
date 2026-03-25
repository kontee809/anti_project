import React, { createContext, useState, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);

  const isAuthenticated = !!token;

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: newToken, role: newRole } = response.data;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('role', newRole);
      localStorage.setItem('email', email);
      
      setToken(newToken);
      setRole(newRole);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please check your credentials.' 
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      await api.post('/auth/register', { name, email, password });
      
      const loginResponse = await api.post('/auth/login', { email, password });
      const { token: newToken, role: newRole } = loginResponse.data;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('role', newRole);
      localStorage.setItem('email', email);
      
      setToken(newToken);
      setRole(newRole);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed. Email might already exist.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
