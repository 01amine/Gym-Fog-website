import axios from 'axios';

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 1000000,
});

// Add Authorization header from localStorage
client.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(`HTTP ${error.response.status}:`, error.response.data);
      // Clear token on 401 (unauthorized)
      if (error.response.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
      }
    } else if (error.request) {
      console.error('No response from server:', error.message);
    } else {
      console.error('Axios config error:', error.message);
    }

    return Promise.reject({
      message: error?.response?.data?.message || 'Unexpected error occurred',
      status: error?.response?.status || null,
      data: error?.response?.data || null,
    });
  }
);

export default client;
