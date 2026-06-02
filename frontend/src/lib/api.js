import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user');
      localStorage.removeItem('grama-profile');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export async function தரவை_பெறு(முகவரி) {
  const response = await client.get(முகவரி);
  return response.data;
}

export async function தரவை_அனுப்பு(முகவரி, payload) {
  const response = await client.post(முகவரி, payload);
  return response.data;
}

export async function தரவை_புதுப்பி(முகவரி, payload) {
  const response = await client.patch(முகவரி, payload);
  return response.data;
}

export async function குறை_ஆய்வு_செய்(text) {
  const response = await client.post('/analysis/preview', { text }, { timeout: 30000 });
  return response.data;
}
