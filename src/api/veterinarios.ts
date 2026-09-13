// Camada de acesso a dados para o recurso /veterinarios da API.
import apiClient from './client';

export async function listVeterinarios() {
  const { data } = await apiClient.get('/veterinarios', {
    params: { size: 100, sort: 'nome' },
  });
  return data.content;
}
