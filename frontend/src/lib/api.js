import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 6000,
});

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
