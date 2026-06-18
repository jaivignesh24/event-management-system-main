import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const EventContext = createContext();
const API_URL = 'http://localhost:5000/api';

export const EventProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState({});

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/events`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events from Express backend:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (currentUser?.email) {
      axios.get(`${API_URL}/registrations/${currentUser.email}`)
        .then(response => {
          if (response.data.success) {
            setRegistrations(prev => ({
              ...prev,
              [currentUser.email]: response.data.eventIds
            }));
          }
        })
        .catch(error => {
          console.error('Error fetching user registrations from Express:', error);
        });
    }
  }, [currentUser]);

  const addEvent = async (eventData) => {
    try {
      const response = await axios.post(`${API_URL}/events`, eventData);
      if (response.data.success) {
        await fetchEvents();
        return { success: true, event: response.data.event };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Add event error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Server connection failed.' 
      };
    }
  };

  const editEvent = async (eventId, updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/events/${eventId}`, updatedData);
      if (response.data.success) {
        await fetchEvents();
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Edit event error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Server connection failed.' 
      };
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      const response = await axios.delete(`${API_URL}/events/${eventId}`);
      if (response.data.success) {
        await fetchEvents();
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Delete event error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Server connection failed.' 
      };
    }
  };

  const registerForEvent = async (userEmail, eventId) => {
    if (!userEmail) return { success: false, message: 'Please login to register for events.' };
    try {
      const response = await axios.post(`${API_URL}/events/${eventId}/register`, { email: userEmail });
      if (response.data.success) {
        await fetchEvents();
        const userRegs = registrations[userEmail] || [];
        setRegistrations(prev => ({
          ...prev,
          [userEmail]: [...userRegs, eventId]
        }));
        return { success: true, message: response.data.message || 'Registration Successful!' };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Register event error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Server connection failed.' 
      };
    }
  };

  const unregisterFromEvent = async (userEmail, eventId) => {
    if (!userEmail) return { success: false, message: 'Missing email address.' };
    try {
      const response = await axios.post(`${API_URL}/events/${eventId}/unregister`, { email: userEmail });
      if (response.data.success) {
        await fetchEvents();
        const userRegs = registrations[userEmail] || [];
        setRegistrations(prev => ({
          ...prev,
          [userEmail]: userRegs.filter(id => id !== eventId)
        }));
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Unregister event error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Server connection failed.' 
      };
    }
  };

  const getUserRegisteredEvents = (userEmail) => {
    if (!userEmail) return [];
    const eventIds = registrations[userEmail] || [];
    return events.filter(e => eventIds.includes(e.id));
  };

  return (
    <EventContext.Provider value={{
      events,
      registrations,
      addEvent,
      editEvent,
      deleteEvent,
      registerForEvent,
      unregisterFromEvent,
      getUserRegisteredEvents
    }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};
