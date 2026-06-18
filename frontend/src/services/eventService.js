import api from './api';

export const eventService = {
  getEvents: async () => {
    const response = await api.get('/events');
    return response.data;
  },
  createEvent: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await api.put(`/events/${id}/status`, { status });
    return response.data;
  }
};

export default eventService;
