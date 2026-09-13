// Camada de acesso a dados para o recurso /veterinarios da API.
import apiClient from './client';

export async function listVeterinarios() {
  const { data } = await apiClient.get('/veterinarios', {
    params: { size: 100, sort: 'nome' },
  });
  return data.content;
}

export async function getVeterinarioById(id) {
  const { data } = await apiClient.get(`/veterinarios/${id}`);
  return data;
}

export async function updateVeterinario(id, veterinario) {
  const { data } = await apiClient.put(`/veterinarios/${id}`, veterinario);
  return data;
}
