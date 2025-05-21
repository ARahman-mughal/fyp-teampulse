import API from "./api";

export const getProjects = async () => {
  const response = await API.get('/projects');
  return response.data;
};

export const getProjectById = async (id) => {
  const response = await API.get(`/projects/${id}`);
  return response.data;
};

export const createProject = async (employeeData) => {
  const response = await API.post('/projects', employeeData);
  return response.data;
};

export const updateProject = async (id, employeeData) => {
  const response = await API.put(`/projects/${id}`, employeeData);
  return response.data;
};

export const deleteProject = async (id) => {
  const response = await API.delete(`/projects/${id}`);
  return response.data;
};

export const getProjectStats = async () => {
  const response = await API.get('/projects/stats');
  return response.data;
};