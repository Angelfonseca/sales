
import axios from 'axios';

const token = localStorage.getItem('token');

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
});

apiClient.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${token}`;
  return config;
}, error => Promise.reject(error));

const fetch = async () => {
  try {
    const response = await apiClient.get('/sells');
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export {fetch};