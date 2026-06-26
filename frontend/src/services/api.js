import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add JWT token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Appointment APIs
export const appointmentAPI = {
  book: (data) => api.post('/appointments/book', data),
  getAll: () => api.get('/appointments'),
  getByStatus: (status) => api.get(`/appointments/status/${status}`),
  cancel: (id) => api.delete(`/appointments/cancel/${id}`),
};

// Queue APIs
export const queueAPI = {
  getStatus: (industry) => api.get(`/queue/status?industry=${industry || ''}`),
  getCurrent: (industry) => api.get(`/queue/current?industry=${industry || ''}`),
  getWaiting: (industry) => api.get(`/queue/waiting?industry=${industry || ''}`),
  callNext: (industry) => api.put(`/queue/next?industry=${industry || ''}`),
  skip: (id, industry) => api.put(`/queue/skip/${id}?industry=${industry || ''}`),
  complete: (id) => api.put(`/queue/complete/${id}`),
  cancel: (id) => api.put(`/queue/cancel/${id}`),
};

// Admin APIs
export const adminAPI = {
  getDashboard: (industry) => api.get(`/admin/dashboard?industry=${industry || ''}`),
  getTodayAppointments: (industry) => api.get(`/admin/appointments/today?industry=${industry || ''}`),
  getDailyBookings: (industry) => api.get(`/admin/analytics/daily?industry=${industry || ''}`),
  getServicePopularity: (industry) => api.get(`/admin/analytics/services?industry=${industry || ''}`),
  getUsers: (role) => api.get(`/admin/users${role ? `?role=${role}` : ''}`),
};

// Service APIs
export const serviceAPI = {
  getAll: (industry) => api.get(`/services?industry=${industry || ''}`),
  getById: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};

export default api;
