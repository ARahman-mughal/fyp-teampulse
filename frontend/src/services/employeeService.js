import API from './api';

export const getEmployees = async () => {
  const response = await API.get('/employees');
  return response.data;
};

export const getEmployeeById = async (id) => {
  const response = await API.get(`/employees/${id}`);
  return response.data;
};

export const createEmployee = async (employeeData) => {
  const response = await API.post('/employees', employeeData);
  return response.data;
};

export const updateEmployee = async (id, employeeData) => {
  const response = await API.put(`/employees/${id}`, employeeData);
  return response.data;
};

export const deleteEmployee = async (id) => {
  const response = await API.delete(`/employees/${id}`);
  return response.data;
};

export const getEmployeeStats = async () => {
  try {
    const response = await API.get('/employees/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching employee stats:', error);
    throw error;
  }
};

export const getProfile = async () => {
  const response = await API.get('/employees/profile');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await API.put('/employees/profile', profileData);
  return response.data;
};

export const getDashboardData = async () => {
  const response = await API.get('/employees/dashboard');
  return response.data;
};