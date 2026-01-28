import axios from 'axios';

const API = axios.create({
  baseURL: '/api', // Vite proxy will forward to http://localhost:5000/api
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to headers
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
};

// Job API
export const jobAPI = {
  getAllJobs: (params) => API.get('/jobs', { params }),
  getJobById: (id) => API.get(`/jobs/${id}`),
  createJob: (data) => API.post('/jobs', data),
  updateJob: (id, data) => API.put(`/jobs/${id}`, data),
  deleteJob: (id) => API.delete(`/jobs/${id}`),
  getMyJobs: () => API.get('/jobs/my/jobs'),
};

// Application API
export const applicationAPI = {
  applyForJob: (data) => API.post('/applications', data),
  getMyApplications: () => API.get('/applications/my'),
  getJobApplications: (jobId) => API.get(`/applications/job/${jobId}`),
  updateApplicationStatus: (id, data) => API.put(`/applications/${id}/status`, data),
  withdrawApplication: (id) => API.delete(`/applications/${id}`),
};

export default API;
