import api from './api';

export const deviceService = {
  getDevices: async () => {
    const response = await api.get('/devices');
    return response.data;
  },
  getDeviceStatus: async () => {
    const response = await api.get('/devices/status');
    return response.data;
  },
  createDevice: async (deviceData) => {
    const response = await api.post('/devices', deviceData);
    return response.data;
  }
};

export default deviceService;
