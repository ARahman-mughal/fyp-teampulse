import axios from 'axios';
import store from '../store';
import { setCredentials, logout as logoutAction } from '../store/slices/authSlice';

const API_URL = 'http://localhost:5000/api/auth';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Login user
export const login = async (credentials) => {
  const response = await api.post('/login', credentials);
  if (response.data.token) {
    const { token, user } = response.data;
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify({ token, user }));
    // Update Redux store
    store.dispatch(setCredentials({ user, token }));
  }
  return response.data;
};

// Register user
export const register = async (userData) => {
  const response = await api.post('/register', userData);
  return response.data;
};

// Logout user
export const logout = () => {
  localStorage.removeItem('user');
  store.dispatch(logoutAction());
};

// Get current user
export const getCurrentUser = () => {
  const userData = localStorage.getItem('user');
  if (userData) {
    const parsedData = JSON.parse(userData);
    // Sync with Redux store
    store.dispatch(setCredentials({
      user: parsedData.user,
      token: parsedData.token
    }));
    return parsedData.user;
  }
  return null;
};

// Update user in localStorage when Redux store changes
export const syncUserToStorage = (userData) => {
  const currentData = localStorage.getItem('user');
  if (currentData) {
    const parsedData = JSON.parse(currentData);
    localStorage.setItem('user', JSON.stringify({
      ...parsedData,
      user: { ...parsedData.user, ...userData }
    }));
  }
}; 