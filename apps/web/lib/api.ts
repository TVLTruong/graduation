import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({ baseURL });

// Admin requests authenticate with the password in a header
export const adminApi = (password: string) =>
  axios.create({ baseURL, headers: { 'x-admin-password': password } });
