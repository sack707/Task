import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token if present
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Extract error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred';
    if (error.response?.data?.message) {
      if (Array.isArray(error.response.data.message)) {
        message = error.response.data.message.join(', ');
      } else {
        message = error.response.data.message;
      }
    } else if (error.message) {
      message = error.message;
    }

    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Token expired or invalid
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/signup')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(new Error(message));
  }
);
