import axios from 'axios';

const API_URL = 'http://localhost:5000/api/payrolls';

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

// Get all payrolls
export const getPayrolls = async () => {
  const response = await api.get('/');
  return response.data;
};

// Get payroll by ID
export const getPayrollById = async (id) => {
  const response = await api.get(`/${id}`);
  return response.data;
};

// Create new payroll
export const createPayroll = async (payrollData) => {
  const response = await api.post('/', payrollData);
  return response.data;
};

// Update payroll
export const updatePayroll = async (id, payrollData) => {
  const response = await api.put(`/${id}`, payrollData);
  return response.data;
};

// Delete payroll
export const deletePayroll = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
}; 