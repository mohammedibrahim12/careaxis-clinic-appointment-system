import axios from 'axios';

const STORAGE_KEY = 'clinic-auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return config;
    }

    const parsedValue = JSON.parse(rawValue);
    if (parsedValue.token) {
      config.headers.Authorization = `Bearer ${parsedValue.token}`;
    }
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return config;
});

export default api;
