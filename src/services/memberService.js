import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchClubs = async () => {
  const response = await axios.get(`${API_URL}/clubs`);
  return response.data;
};

export const fetchStats = async () => {
  const response = await axios.get(`${API_URL}/authority/stats`);
  return response.data;
};

export const fetchMembers = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.clubId) params.append('club_id', filters.clubId);
  if (filters.role) params.append('role', filters.role);
  if (filters.status) params.append('status', filters.status);

  const response = await axios.get(`${API_URL}/members?${params.toString()}`);
  return response.data;
};

export const createMember = async (memberData) => {
  const response = await axios.post(`${API_URL}/members`, memberData);
  return response.data;
};

export const updateMember = async (id, memberData) => {
  const response = await axios.put(`${API_URL}/members/${id}`, memberData);
  return response.data;
};

export const deleteMember = async (id) => {
  const response = await axios.delete(`${API_URL}/members/${id}`);
  return response.data;
};

export const resetPassword = async (id) => {
  const response = await axios.post(`${API_URL}/members/${id}/reset-password`);
  return response.data;
};

export const resendCredentials = async (id) => {
  const response = await axios.post(`${API_URL}/members/${id}/resend-credentials`);
  return response.data;
};
