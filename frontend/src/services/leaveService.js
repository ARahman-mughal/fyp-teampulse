import API from "./api";

export const applyLeave = async (leaveWithEmployee) => {
  const response = await API.post('/leaves', leaveWithEmployee);
  return response.data
}

export const getLeaves = async () => {
  const response = await API.get('/leaves');
  return response.data
}

export const getLeavesById = async (id) => {
  const response = await API.get(`/leaves/${id}`);
  return response.data;
};

export const updateLeave = async (id, leaveData) => {
  const response = await API.put(`/leaves/${id}`, leaveData);
  return response.data;
};