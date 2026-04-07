import axios from 'axios';

const API_BASE = '/api';


const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const api = axios.create({
  baseURL: API_BASE,
});

// Add interceptor for auth headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  logout: async () => {
    const res = await api.post('/auth/logout');
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
};

export const certificateAPI = {
  issue: (data) => api.post('/certificates', data),
  getAll: (params) => api.get('/certificates', { params }),
  getById: (id) => api.get(`/certificates/${id}`),
  getStudentCertificates: () => api.get('/certificates/my-certificates'),
  verify: (certId) => api.get(`/certificates/verify/${certId}`),
  updateStatus: (id, status) => api.patch(`/certificates/${id}/status`, { status }),
  delete: (id) => api.delete(`/certificates/${id}`),
  download: async (id, certificateId) => {
    const res = await api.get(`/certificates/${id}/download`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${certificateId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
  getRanking: () => api.get('/certificates/ranking'),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getAllStudents: () => api.get('/users/students'),
  getStudentById: (id) => api.get(`/users/students/${id}`),
  createStudent: (data) => api.post('/users/students', data),
  updateStudent: (id, data) => api.put(`/users/students/${id}`, data),
  deleteStudent: (id) => api.delete(`/users/students/${id}`),
  uploadStudentsCSV: (formData) => api.post('/users/students/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export const courseAPI = {
  uploadCSV: (formData) => api.post('/courses/upload-csv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAll: () => api.get('/courses'),
  getMyCourses: () => api.get('/courses/my-courses'),
};

export const requestAPI = {
  create: (data) => api.post('/requests', data),
  getAll: () => api.get('/requests'),
  getMyRequests: () => api.get('/requests/my-requests'),
  process: (id, status) => api.patch(`/requests/${id}`, { status }),
};

export default api;
