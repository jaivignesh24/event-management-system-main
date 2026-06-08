import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Pre-seed mock users in localStorage if not exists
  useEffect(() => {
    if (!localStorage.getItem('users') || 
        localStorage.getItem('users').includes('Priya Sharma') || 
        localStorage.getItem('users').includes('Miss Sathwika') || 
        localStorage.getItem('users').includes('Monisha Sathwika') ||
        localStorage.getItem('users').includes('"name":"Sathwika"') ||
        localStorage.getItem('users').includes('Ms Monisah Sathwik') ||
        localStorage.getItem('users').includes('"name":"Sathwilk"') ||
        !localStorage.getItem('users').includes('Monisha')) {
      const defaultUsers = [
        {
          name: 'Rohit Kumar',
          email: 'student@aurora.edu.in',
          password: 'password',
          role: 'student',
          college: 'Aurora Deemed to be University',
          department: 'Computer Science & Engineering',
          rollNo: 'AUR2023CSE045',
          year: '3rd Year'
        },
        {
          name: 'Monisha',
          email: 'admin@aurora.edu.in',
          password: 'password',
          role: 'admin',
          college: 'Aurora Deemed to be University',
          department: 'Academic Affairs Coordinators'
        }
      ];
      localStorage.setItem('users', JSON.stringify(defaultUsers));

      // Also migrate active session if it was Priya, Sathwika, Monisha Sathwika, Ms Monisah Sathwik, or Sathwilk
      const savedUser = localStorage.getItem('current-user');
      if (savedUser && JSON.parse(savedUser).email === 'admin@aurora.edu.in') {
        const updatedAdmin = { ...JSON.parse(savedUser), name: 'Monisha' };
        localStorage.setItem('current-user', JSON.stringify(updatedAdmin));
        setCurrentUser(updatedAdmin);
      }
    }
  }, []);

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('current-user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('current-user', JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, message: 'Invalid email or password' };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('current-user');
  };

  const registerUser = (userData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const exists = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    
    if (exists) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      ...userData,
      role: userData.role || 'student',
      college: 'Aurora Deemed to be University',
      rollNo: `AUR2026CSE${Math.floor(100 + Math.random() * 900)}`,
      year: '1st Year',
      joinedClubs: [],
      profilePicture: '',
      phone: '',
      achievements: ['First Registration'],
      activityHistory: [
        { id: Date.now(), text: 'Account created successfully', time: new Date().toLocaleString() }
      ]
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    setCurrentUser(newUser);
    localStorage.setItem('current-user', JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const loginWithOAuth = (userData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    let user = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    
    if (!user) {
      user = {
        name: userData.name,
        email: userData.email,
        password: 'password',
        role: 'student',
        college: 'Aurora Deemed to be University',
        department: 'Computer Science & Engineering',
        rollNo: `AUR2026CSE${Math.floor(100 + Math.random() * 900)}`,
        year: '3rd Year',
        avatar: userData.avatar,
        joinedClubs: [],
        profilePicture: userData.avatar || '',
        phone: '',
        achievements: ['First Registration'],
        activityHistory: [
          { id: Date.now(), text: 'Connected account via OAuth', time: new Date().toLocaleString() }
        ]
      };
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));
    }

    setCurrentUser(user);
    localStorage.setItem('current-user', JSON.stringify(user));
    return { success: true, user };
  };

  const updateProfile = (updatedFields) => {
    if (!currentUser) return { success: false };

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(u => {
      if (u.email.toLowerCase() === currentUser.email.toLowerCase()) {
        const updated = { ...u, ...updatedFields };
        // Log activity for profile update
        const currentActivities = updated.activityHistory || [];
        updated.activityHistory = [
          { id: Date.now(), text: 'Profile details updated', time: new Date().toLocaleString() },
          ...currentActivities
        ];
        return updated;
      }
      return u;
    });

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    const newCurrentUser = updatedUsers.find(u => u.email.toLowerCase() === currentUser.email.toLowerCase());
    setCurrentUser(newCurrentUser);
    localStorage.setItem('current-user', JSON.stringify(newCurrentUser));
    return { success: true, user: newCurrentUser };
  };

  const joinClub = (clubId, clubName) => {
    if (!currentUser) return { success: false };
    const currentClubs = currentUser.joinedClubs || [];
    if (currentClubs.includes(clubId)) return { success: false, message: 'Already joined!' };

    const updatedClubs = [...currentClubs, clubId];
    
    // Add achievement if they join their first club
    const achievements = currentUser.achievements || [];
    const updatedAchievements = [...achievements];
    if (!updatedAchievements.includes('Club Enthusiast')) {
      updatedAchievements.push('Club Enthusiast');
    }

    const currentActivities = currentUser.activityHistory || [];
    const updatedActivities = [
      { id: Date.now(), text: `Joined club: ${clubName}`, time: new Date().toLocaleString() },
      ...currentActivities
    ];

    return updateProfile({ 
      joinedClubs: updatedClubs,
      achievements: updatedAchievements,
      activityHistory: updatedActivities
    });
  };

  const leaveClub = (clubId, clubName) => {
    if (!currentUser) return { success: false };
    const currentClubs = currentUser.joinedClubs || [];
    const updatedClubs = currentClubs.filter(id => id !== clubId);

    const currentActivities = currentUser.activityHistory || [];
    const updatedActivities = [
      { id: Date.now(), text: `Left club: ${clubName}`, time: new Date().toLocaleString() },
      ...currentActivities
    ];

    return updateProfile({ 
      joinedClubs: updatedClubs,
      activityHistory: updatedActivities
    });
  };

  const submitFeedback = (eventId, eventTitle, rating, feedbackText) => {
    if (!currentUser) return { success: false };
    
    const achievements = currentUser.achievements || [];
    const updatedAchievements = [...achievements];
    if (!updatedAchievements.includes('Feedback Contributor')) {
      updatedAchievements.push('Feedback Contributor');
    }

    const currentActivities = currentUser.activityHistory || [];
    const updatedActivities = [
      { id: Date.now(), text: `Submitted feedback for: ${eventTitle} (Rating: ${rating}/5)`, time: new Date().toLocaleString() },
      ...currentActivities
    ];

    return updateProfile({
      achievements: updatedAchievements,
      activityHistory: updatedActivities
    });
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
