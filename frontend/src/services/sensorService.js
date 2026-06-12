import api from './api';

export const sensorService = {
  getSensorData: async () => {
    const response = await api.get('/sensors');
    return response.data;
  },
  createSensorData: async (data) => {
    const response = await api.post('/sensors', data);
    return response.data;
  }
};

export default sensorService;
