import api from './api';

export const alertService = {
  getAlerts: async () => {
    const response = await api.get('/alerts');
    return response.data;
  },
  createAlert: async (alertData) => {
    const response = await api.post('/alerts', alertData);
    return response.data;
  },
  markAsRead: async (id) => {
    const response = await api.put(`/alerts/${id}/read`);
    return response.data;
  }
};

export default alertService;
