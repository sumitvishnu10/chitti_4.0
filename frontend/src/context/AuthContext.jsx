import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('chitti_token');
      const savedUser = localStorage.getItem('chitti_user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
          
          // Verify with backend in the background
          const profileRes = await authService.getProfile();
          if (profileRes && profileRes.success) {
            const freshUser = profileRes.data || profileRes.user;
            setUser(freshUser);
            localStorage.setItem('chitti_user', JSON.stringify(freshUser));
          }
        } catch (error) {
          console.error("Session verification failed:", error);
          // Token is invalid or expired
          authService.logout();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      if (data && data.token) {
        const loggedUser = data.user || data.data || { email };
        setUser(loggedUser);
        setIsAuthenticated(true);
        setLoading(false);
        return { success: true };
      }
      setLoading(false);
      return { success: false, message: data.message || 'Login failed' };
    } catch (error) {
      setLoading(false);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Invalid credentials or server error' 
      };
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await authService.register(name, email, password);
      setLoading(false);
      if (data && data.success) {
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Registration failed' };
    } catch (error) {
      setLoading(false);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
