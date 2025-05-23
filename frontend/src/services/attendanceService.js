import API from './api';

export const getAttendanceHistory = async () => {
  const response = await API.get('/attendance/history');
  return response.data;
};

export const getAttendanceStatus = async () => {
  const response = await API.get('/attendance/status');
  return response.data;
};

export const clockIn = async () => {
  const response = await API.post('/attendance/clock-in');
  return response.data;
};

export const clockOut = async () => {
  const response = await API.post('/attendance/clock-out');
  return response.data;
}; 