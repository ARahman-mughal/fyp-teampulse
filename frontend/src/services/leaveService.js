import axios from 'axios';

const API_URL = 'http://localhost:5000/api/leaves';

// Get auth token from localStorage
const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token;
};

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Get all leaves
export const getLeaves = async () => {
  const response = await api.get('/');
  return response.data;
};

// Get leave by ID
export const getLeaveById = async (id) => {
  const response = await api.get(`/${id}`);
  return response.data;
};

// Create new leave request
export const createLeave = async (leaveData) => {
  const response = await api.post('/', leaveData);
  return response.data;
};

// Update leave request
export const updateLeave = async (id, leaveData) => {
  const response = await api.put(`/${id}`, leaveData);
  return response.data;
};

// Delete leave request
export const deleteLeave = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
}; 