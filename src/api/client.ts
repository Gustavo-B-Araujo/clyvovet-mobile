import axios from 'axios';
import { API_URL } from '../config/env';
import { getAuthToken } from '../storage';

// Cliente HTTP único para toda a integração com a API do ClyvoVet (Java/Spring).
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Anexa o JWT emitido por /auth/login ou /auth/register, exigido pelas rotas de negócio (/tutores, /pets etc.).

apiClient.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
