import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem('userToken')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('userToken')}`;
  }
  return req;
});

export default API;