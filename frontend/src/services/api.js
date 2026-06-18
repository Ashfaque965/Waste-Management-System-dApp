// frontend/src/services/api.js
import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Collectors API
export const collectorsAPI = {
  register: (data) => api.post('/collectors/register', data),
  getProfile: (walletAddress) => api.get(`/collectors/${walletAddress}`),
  getAll: (params) => api.get('/collectors', { params }),
  update: (walletAddress, data) => api.put(`/collectors/${walletAddress}`, data),
  getStats: (walletAddress) => api.get(`/collectors/${walletAddress}/stats`),
};

// Collections API
export const collectionsAPI = {
  record: (data) => api.post('/collections/record', data),
  getAll: (params) => api.get('/collections', { params }),
  getById: (collectionId) => api.get(`/collections/${collectionId}`),
  verify: (collectionId, data) => api.put(`/collections/${collectionId}/verify`, data),
  getStats: () => api.get('/collections/stats/summary'),
};

// Recycling API
export const recyclingAPI = {
  submit: (data) => api.post('/recycling/submit', data),
  getAll: (params) => api.get('/recycling', { params }),
  verify: (recordId, data) => api.put(`/recycling/${recordId}/verify`, data),
  getStats: () => api.get('/recycling/stats/summary'),
};

export default api;
