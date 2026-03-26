import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Auto logout if 401 response returned from api
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const createRescueRequest = async (data) => {
  const response = await api.post('/rescue', data);
  return response.data;
};

export const getRescueRequests = async () => {
  const response = await api.get('/rescue');
  return response.data;
};

export const getAdminRescueRequests = async () => {
  const response = await api.get('/admin/rescue');
  return response.data;
};

export const getAdminRescueStats = async () => {
  const response = await api.get('/admin/rescue/stats');
  return response.data;
};

export const updateRescueStatus = async (id, action, payload = {}) => {
  const response = await api.put(`/admin/rescue/${id}/${action}`, payload);
  return response.data;
};

export const getAdminStations = async () => {
  const response = await api.get('/admin/stations');
  return response.data;
};

export const createAdminStation = async (data) => {
  const response = await api.post('/admin/stations', data);
  return response.data;
};

export const updateAdminStation = async (id, data) => {
  const response = await api.put(`/admin/stations/${id}`, data);
  return response.data;
};

export const deleteAdminStation = async (id) => {
  const response = await api.delete(`/admin/stations/${id}`);
  return response.data;
};

export const getPublicStations = async () => {
  const response = await api.get('/stations');
  return response.data;
};

export const getStationHistory = async (id) => {
  const response = await api.get(`/stations/${id}/history`);
  return response.data;
};

export const getStationStats = async () => {
  const response = await api.get('/stations/stats');
  return response.data;
};

// DEV / TEST API
export const simulateWaterStation = async (data) => {
  const response = await api.post('/dev/water/simulate', data);
  return response.data;
};

export const stopSimulation = async (stationId) => {
  const response = await api.post(`/dev/water/stop/${stationId}`);
  return response.data;
};

// FLOOD REPORTS API
export const createFloodReport = async (data) => {
  const response = await api.post('/flood-reports', data);
  return response.data;
};

export const getFloodReports = async () => {
  const response = await api.get('/flood-reports');
  return response.data;
};

export const getNearbyFloodReports = async (lat, lng, radius = 5) => {
  const response = await api.get(`/flood-reports/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
  return response.data;
};

export const updateFloodReportStatus = async (id, status) => {
  const response = await api.put(`/flood-reports/${id}/status`, { status });
  return response.data;
};

// ADMIN FLOOD REPORTS
export const getAdminFloodReports = async () => {
  const response = await api.get('/admin/flood-reports');
  return response.data;
};

export const getFloodAnalytics = async () => {
  const response = await api.get('/admin/flood-reports/analytics');
  return response.data;
};

export const verifyFloodReport = async (id) => {
  const response = await api.put(`/admin/flood-reports/${id}/verify`);
  return response.data;
};

export const rejectFloodReport = async (id) => {
  const response = await api.put(`/admin/flood-reports/${id}/reject`);
  return response.data;
};

export const resolveFloodReport = async (id) => {
  const response = await api.put(`/admin/flood-reports/${id}/resolve`);
  return response.data;
};

export default api;
