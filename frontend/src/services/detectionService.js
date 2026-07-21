import api from './api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const UPLOADS_BASE = API_BASE.replace(/\/api\/?$/, '') + '/uploads';

export const getImageUrl = (imageName) => {
  if (!imageName || typeof imageName !== 'string') return '';
  if (imageName.startsWith('http://') || imageName.startsWith('https://') || imageName.startsWith('data:')) {
    return imageName;
  }
  // Standardize backslashes and forward slashes to reliably extract pure filename
  const cleanPath = imageName.replace(/\\/g, '/');
  const filename = cleanPath.split('/').filter(Boolean).pop();
  return `${UPLOADS_BASE}/${filename}`;
};

export const detectionService = {
  getDetections: async () => {
    const response = await api.get('/detections');
    return response.data;
  },
  getLatestDetection: async () => {
    const response = await api.get('/detections/latest');
    return response.data;
  },
  createDetection: async (detectionData) => {
    const response = await api.post('/detections', detectionData);
    return response.data;
  }
};

export default detectionService;
