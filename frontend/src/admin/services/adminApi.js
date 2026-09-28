import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const adminApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const adminAuth = {
  login: (credentials) => adminApi.post('/auth/admin-login', credentials),
  getMe: () => adminApi.get('/auth/admin-me'),
  logout: () => adminApi.post('/auth/admin-logout'),
  changePassword: (data) => adminApi.put('/auth/admin-change-password', data),
};

// Dashboard endpoints
export const dashboardApi = {
  getStats: () => adminApi.get('/dashboard/stats'),
  getRecentActivity: () => adminApi.get('/dashboard/recent-activity'),
  getChartData: () => adminApi.get('/dashboard/chart-data'),
  getTopDonors: () => adminApi.get('/dashboard/top-donors'),
  getPopularBlogs: () => adminApi.get('/dashboard/popular-blogs'),
  getUpcomingEvents: () => adminApi.get('/dashboard/upcoming-events'),
};

// Blog endpoints
export const blogApi = {
  getAll: (params) => adminApi.get('/blogs', { params }),
  getById: (id) => adminApi.get(`/blogs/${id}`),
  create: (data) => adminApi.post('/blogs', data),
  update: (id, data) => adminApi.put(`/blogs/${id}`, data),
  delete: (id) => adminApi.delete(`/blogs/${id}`),
  publish: (id) => adminApi.patch(`/blogs/${id}/publish`),
  archive: (id) => adminApi.patch(`/blogs/${id}/archive`),
};

// Program endpoints
export const programApi = {
  getAll: () => adminApi.get('/programs'),
  getById: (id) => adminApi.get(`/programs/${id}`),
  create: (data) => adminApi.post('/programs', data),
  update: (id, data) => adminApi.put(`/programs/${id}`, data),
  delete: (id) => adminApi.delete(`/programs/${id}`),
};

// Gallery endpoints
export const galleryApi = {
  getAll: () => adminApi.get('/gallery'),
  getById: (id) => adminApi.get(`/gallery/${id}`),
  create: (data) => adminApi.post('/gallery', data),
  update: (id, data) => adminApi.put(`/gallery/${id}`, data),
  delete: (id) => adminApi.delete(`/gallery/${id}`),
  upload: (formData) => adminApi.post('/upload/single', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// Event endpoints
export const eventApi = {
  getAll: () => adminApi.get('/events'),
  getById: (id) => adminApi.get(`/events/${id}`),
  create: (data) => adminApi.post('/events', data),
  update: (id, data) => adminApi.put(`/events/${id}`, data),
  delete: (id) => adminApi.delete(`/events/${id}`),
};

// Contact endpoints
export const contactApi = {
  getAll: () => adminApi.get('/contact'),
  getById: (id) => adminApi.get(`/contact/${id}`),
  markAsRead: (id) => adminApi.patch(`/contact/${id}/read`),
  reply: (id, data) => adminApi.post(`/contact/${id}/reply`, data),
  delete: (id) => adminApi.delete(`/contact/${id}`),
};

// Donation endpoints
export const donationApi = {
  getAll: () => adminApi.get('/donations'),
  getById: (id) => adminApi.get(`/donations/${id}`),
  updateStatus: (id, status) => adminApi.patch(`/donations/${id}/status`, { status }),
  delete: (id) => adminApi.delete(`/donations/${id}`),
  getStats: () => adminApi.get('/donations/stats'),
};

// Testimonial endpoints
export const testimonialApi = {
  getAll: () => adminApi.get('/testimonials/all'),
  create: (data) => adminApi.post('/testimonials', data),
  update: (id, data) => adminApi.put(`/testimonials/${id}`, data),
  delete: (id) => adminApi.delete(`/testimonials/${id}`),
  approve: (id) => adminApi.patch(`/testimonials/${id}/approve`),
  feature: (id, isFeatured) => adminApi.patch(`/testimonials/${id}/feature`, { isFeatured }),
};

export default adminApi;