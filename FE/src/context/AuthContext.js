import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../apis/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  // Set up token refresh interval
  useEffect(() => {
    if (!currentUser) return;
    
    const refreshTokenInterval = setInterval(async () => {
      const result = await authService.refreshToken();
      if (!result.success) {
        // If refresh fails, log the user out
        logout();
      }
    }, 14 * 60 * 1000); // Refresh token every 14 minutes (before 15min expiry)
    
    return () => clearInterval(refreshTokenInterval);
  }, [currentUser]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.login(email, password);
      if (result.success) {
        setCurrentUser({
          email: result.data.email,
          name: result.data.name,
          isAdmin: result.data.isAdmin || false
        });
        return { success: true };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (err) {
      setError('An unexpected error occurred');
      return { success: false, message: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.signup(name, email, password);
      if (result.success) {
        setCurrentUser({
          email: result.data.email,
          name: result.data.name
        });
        return { success: true };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (err) {
      setError('An unexpected error occurred');
      return { success: false, message: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    await authService.logout();
    setCurrentUser(null);
    setLoading(false);
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!currentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
