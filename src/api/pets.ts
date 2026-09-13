// Camada de acesso a dados para o recurso /pets da API.
import apiClient from './client';

export const ESPECIE_LABELS = {
  CACHORRO: 'Cachorro',
  GATO: 'Gato',
  PASSARO: 'Pássaro',
  ROEDOR: 'Roedor',
  REPTIL: 'Réptil',
  PEIXE: 'Peixe',
  OUTRO: 'Outro',
};

export const SEXO_LABELS = {
  MACHO: 'Macho',
  FEMEA: 'Fêmea',
};

export const ESPECIE_OPTIONS = Object.values(ESPECIE_LABELS);
export const SEXO_OPTIONS = Object.values(SEXO_LABELS);

export function especieToEnum(label) {
  return Object.keys(ESPECIE_LABELS).find((key) => ESPECIE_LABELS[key] === label) || null;
}

export function sexoToEnum(label) {
  return Object.keys(SEXO_LABELS).find((key) => SEXO_LABELS[key] === label) || null;
}

export async function listPetsByTutor(tutorId) {
  const { data } = await apiClient.get('/pets', {
    params: { tutorId, size: 50, sort: 'nome' },
  });
  return data.content;
}

export async function createPet(pet) {
  const { data } = await apiClient.post('/pets', pet);
  return data;
}

export async function updatePet(id, pet) {
  const { data } = await apiClient.put(`/pets/${id}`, pet);
  return data;
}

export async function deletePet(id) {
  await apiClient.delete(`/pets/${id}`);
}
