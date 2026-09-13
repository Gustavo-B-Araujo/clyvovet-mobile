// Camada de acesso a dados para o recurso /consultas da API.
import apiClient from './client';

export const TIPO_CONSULTA_LABELS = {
  PREVENTIVO: 'Preventivo',
  CONTINUIDADE: 'Continuidade',
  EMERGENCIA: 'Emergência',
  RETORNO: 'Retorno',
  CIRURGIA: 'Cirurgia',
  EXAME: 'Exame',
};

export const STATUS_CONSULTA_LABELS = {
  AGENDADA: 'Agendada',
  CONFIRMADA: 'Confirmada',
  EM_ANDAMENTO: 'Em andamento',
  CONCLUIDA: 'Concluída',
  CANCELADA: 'Cancelada',
};


const TIPO_TO_BUCKET = {
  PREVENTIVO: 'consulta',
  CONTINUIDADE: 'consulta',
  EMERGENCIA: 'emergencia',
  RETORNO: 'retorno',
  CIRURGIA: 'cirurgia',
  EXAME: 'exame',
};

export function tipoConsultaToEnum(label) {
  return Object.keys(TIPO_CONSULTA_LABELS).find((key) => TIPO_CONSULTA_LABELS[key] === label) || null;
}

// Mapeando o ConsultaResponse da API para o formato usado pela timeline do Histórico.
export function mapConsulta(consulta) {
  return {
    id: String(consulta.id),
    type: TIPO_TO_BUCKET[consulta.tipoConsulta] || 'consulta',
    tipoConsulta: consulta.tipoConsulta,
    title: TIPO_CONSULTA_LABELS[consulta.tipoConsulta] || 'Consulta',
    statusConsulta: consulta.statusConsulta,
    date: (consulta.dataHora || '').slice(0, 10),
    dataHora: consulta.dataHora,
    vet: consulta.veterinarioNome || '',
    veterinarioId: consulta.veterinarioId,
    petNome: consulta.petNome || '',
    description: consulta.diagnostico || consulta.observacoes || consulta.tratamento || '',
    observacoes: consulta.observacoes || '',
    diagnostico: consulta.diagnostico || '',
    tratamento: consulta.tratamento || '',
    petId: consulta.petId,
  };
}

export async function listConsultasByPet(petId) {
  const { data } = await apiClient.get('/consultas', {
    params: { petId, size: 100, sort: 'dataHora,desc' },
  });
  return data.content.map(mapConsulta);
}

export async function listConsultasByVeterinario(veterinarioId) {
  const { data } = await apiClient.get('/consultas', {
    params: { veterinarioId, size: 200, sort: 'dataHora' },
  });
  return data.content.map(mapConsulta);
}

export async function createConsulta(consulta) {
  const { data } = await apiClient.post('/consultas', consulta);
  return mapConsulta(data);
}

export async function updateConsulta(id, consulta) {
  const { data } = await apiClient.put(`/consultas/${id}`, consulta);
  return mapConsulta(data);
}

export async function deleteConsulta(id) {
  await apiClient.delete(`/consultas/${id}`);
}
