import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data && response.data.token) {
      localStorage.setItem('chitti_token', response.data.token);
      // Backend might send user info in response.data.user or response.data.data
      const user = response.data.user || response.data.data || { email };
      localStorage.setItem('chitti_user', JSON.stringify(user));
    }
    return response.data;
  },
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('chitti_token');
    localStorage.removeItem('chitti_user');
  }
};

export default authService;
