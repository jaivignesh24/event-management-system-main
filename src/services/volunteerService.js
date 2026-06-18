import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// --- Volunteer Tasks ---
export const fetchTasks = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.volunteerName) params.append('volunteer_name', filters.volunteerName);

  const response = await axios.get(`${API_URL}/volunteers/tasks?${params.toString()}`);
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await axios.post(`${API_URL}/volunteers/tasks`, taskData);
  return response.data;
};

export const updateTaskStatus = async (id, status) => {
  const response = await axios.put(`${API_URL}/volunteers/tasks/${id}`, { status });
  return response.data;
};

// --- Attendance ---
export const fetchAttendance = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.volunteerName) params.append('volunteer_name', filters.volunteerName);

  const response = await axios.get(`${API_URL}/volunteers/attendance?${params.toString()}`);
  return response.data;
};

export const checkInAttendance = async (attendanceData) => {
  const response = await axios.post(`${API_URL}/volunteers/attendance`, attendanceData);
  return response.data;
};

export const checkOutAttendance = async (checkoutData) => {
  const response = await axios.put(`${API_URL}/volunteers/attendance/checkout`, checkoutData);
  return response.data;
};

// --- Performance Ratings ---
export const fetchRatings = async () => {
  const response = await axios.get(`${API_URL}/volunteers/ratings`);
  return response.data;
};

export const saveRating = async (ratingData) => {
  const response = await axios.post(`${API_URL}/volunteers/ratings`, ratingData);
  return response.data;
};

// --- Coordinator Helpdesk Messages ---
export const fetchMessages = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.clubId) params.append('club_id', filters.clubId);

  const response = await axios.get(`${API_URL}/volunteers/messages?${params.toString()}`);
  return response.data;
};

export const sendMessage = async (messageData) => {
  const response = await axios.post(`${API_URL}/volunteers/messages`, messageData);
  return response.data;
};

export const replyMessage = async (id, replyText) => {
  const response = await axios.put(`${API_URL}/volunteers/messages/${id}/reply`, { reply: replyText });
  return response.data;
};
