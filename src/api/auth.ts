// Camada de acesso a dados (HTTP) para os endpoints /auth da API.
import apiClient from './client';

export async function login(email, senha) {
  const { data } = await apiClient.post('/auth/login', { email, senha });
  return data;
}

export async function register({ nome, email, telefone, cpf, senha, confirmarSenha }) {
  const { data } = await apiClient.post('/auth/register', { nome, email, telefone, cpf, senha, confirmarSenha });
  return data;
}
