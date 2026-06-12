import api from './api';

export const systemService = {
  getHealth: async () => {
    const response = await api.get('/system/health');
    return response.data;
  }
};

export default systemService;
