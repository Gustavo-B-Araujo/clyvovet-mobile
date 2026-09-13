// Camada de acesso a dados para o recurso /vacinas da API.
import apiClient from './client';

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function daysFromNowIso(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function computeVaccineStatus(vacina) {
  if (!vacina.dataProximaDose) return 'done';
  if (vacina.dataProximaDose < todayIso()) return 'overdue';
  if (vacina.dataProximaDose <= daysFromNowIso(30)) return 'upcoming';
  return 'done';
}

// Mapeando o VacinaResponse da API para o formato usado pelas telas do app.
export function mapVacina(vacina) {
  return {
    id: String(vacina.id),
    name: vacina.nome,
    date: vacina.dataAplicacao,
    nextDate: vacina.dataProximaDose,
    status: computeVaccineStatus(vacina),
    fabricante: vacina.fabricante || '',
    batch: vacina.lote || '',
    notes: vacina.observacoes || '',
    petId: vacina.petId,
  };
}

export async function listVacinasByPet(petId) {
  const { data } = await apiClient.get('/vacinas', {
    params: { petId, size: 100, sort: 'dataAplicacao' },
  });
  return data.content.map(mapVacina);
}

export async function createVacina(vacina) {
  const { data } = await apiClient.post('/vacinas', vacina);
  return mapVacina(data);
}

export async function updateVacina(id, vacina) {
  const { data } = await apiClient.put(`/vacinas/${id}`, vacina);
  return mapVacina(data);
}

export async function deleteVacina(id) {
  await apiClient.delete(`/vacinas/${id}`);
}
