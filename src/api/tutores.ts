// Camada de acesso a dados para o recurso /tutores da API.
import apiClient from './client';

export async function getTutorById(id) {
  const { data } = await apiClient.get(`/tutores/${id}`);
  return data;
}

export async function updateTutor(id, tutor) {
  const { data } = await apiClient.put(`/tutores/${id}`, tutor);
  return data;
}
