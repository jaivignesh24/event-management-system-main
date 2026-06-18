import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('current-user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (response.data.success) {
        const user = response.data.user;
        setCurrentUser(user);
        localStorage.setItem('current-user', JSON.stringify(user));
        return { success: true, user };
      } else {
        return { success: false, message: response.data.message || 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Server connection failed. Is the backend running?' 
      };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('current-user');
  };

  const registerUser = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        department: userData.department,
        role: userData.role || 'student'
      });
      if (response.data.success) {
        const user = response.data.user;
        setCurrentUser(user);
        localStorage.setItem('current-user', JSON.stringify(user));
        return { success: true, user };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Server connection failed.' 
      };
    }
  };

  const loginWithOAuth = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/oauth`, {
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar || ''
      });
      if (response.data.success) {
        const user = response.data.user;
        setCurrentUser(user);
        localStorage.setItem('current-user', JSON.stringify(user));
        return { success: true, user };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('OAuth login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Server connection failed.' 
      };
    }
  };

  const updateProfile = async (updatedFields) => {
    if (!currentUser) return { success: false, message: 'No current user' };
    try {
      const response = await axios.post(`${API_URL}/auth/profile`, {
        email: currentUser.email,
        ...updatedFields
      });
      if (response.data.success) {
        const user = response.data.user;
        setCurrentUser(user);
        localStorage.setItem('current-user', JSON.stringify(user));
        return { success: true, user };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Server connection failed.' 
      };
    }
  };

  const joinClub = async (clubId, clubName) => {
    if (!currentUser) return { success: false, message: 'No current user' };
    try {
      const response = await axios.post(`${API_URL}/clubs/join`, {
        email: currentUser.email,
        clubId,
        clubName
      });
      if (response.data.success) {
        const user = response.data.user;
        setCurrentUser(user);
        localStorage.setItem('current-user', JSON.stringify(user));
        return { success: true, user };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Join club error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Server connection failed.' 
      };
    }
  };

  const leaveClub = async (clubId, clubName) => {
    if (!currentUser) return { success: false, message: 'No current user' };
    try {
      const response = await axios.post(`${API_URL}/clubs/leave`, {
        email: currentUser.email,
        clubId,
        clubName
      });
      if (response.data.success) {
        const user = response.data.user;
        setCurrentUser(user);
        localStorage.setItem('current-user', JSON.stringify(user));
        return { success: true, user };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Leave club error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Server connection failed.' 
      };
    }
  };

  const submitFeedback = async (eventId, eventTitle, rating, feedbackText) => {
    if (!currentUser) return { success: false, message: 'No current user' };
    try {
      const response = await axios.post(`${API_URL}/feedback`, {
        email: currentUser.email,
        eventId,
        eventTitle,
        rating,
        feedbackText
      });
      if (response.data.success) {
        const user = response.data.user;
        setCurrentUser(user);
        localStorage.setItem('current-user', JSON.stringify(user));
        return { success: true, user };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Feedback submit error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Server connection failed.' 
      };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      login, 
      logout, 
      registerUser, 
      loginWithOAuth,
      updateProfile,
      joinClub,
      leaveClub,
      submitFeedback
    }}>
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
