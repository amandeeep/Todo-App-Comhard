import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.post('/auth/refresh'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  changePassword: (data) => api.post('/auth/change-password', data),
  getMe: () => api.get('/auth/me'),
};

export const taskService = {
  create: (data) => api.post('/tasks', data),
  getAll: (params) => api.get('/tasks', { params }),
  getById: (id) => api.get(`/tasks/${id}`),
  update: (id, data) => api.patch(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  updateStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),
  complete: (id) => api.patch(`/tasks/${id}/complete`),
  bulkUpdate: (data) => api.post('/tasks/bulk-update', data),
  getByStatus: (params) => api.get('/tasks/by-status', { params }),
};

export const sectionService = {
  getAll: () => api.get('/sections'),
  create: (data) => api.post('/sections', data),
  update: (id, data) => api.patch(`/sections/${id}`, data),
  delete: (id) => api.delete(`/sections/${id}`),
};

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getSlaStats: () => api.get('/dashboard/sla'),
};
