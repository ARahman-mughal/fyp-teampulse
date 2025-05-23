import axios from 'axios';

const API_URL = 'http://localhost:5000/api/projects';

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

// Get all projects
export const getProjects = async () => {
  const response = await api.get('/');
  return response.data;
};

// Get project by ID
export const getProjectById = async (id) => {
  const response = await api.get(`/${id}`);
  return response.data;
};

// Create new project
export const createProject = async (projectData) => {
  const response = await api.post('/', projectData);
  return response.data;
};

// Update project
export const updateProject = async (id, projectData) => {
  const response = await api.put(`/${id}`, projectData);
  return response.data;
};

// Delete project
export const deleteProject = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
}; 