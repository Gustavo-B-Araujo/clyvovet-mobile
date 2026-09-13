// Camada de acesso a dados para o recurso /medicamentos da API.
import apiClient from './client';

// Mapeando o MedicamentoResponse da API para o formato usado pela tela.
export function mapMedicamento(medicamento) {
  return {
    id: String(medicamento.id),
    title: medicamento.nome,
    dosagem: medicamento.dosagem || '',
    frequencia: medicamento.frequencia || '',
    dataInicio: medicamento.dataInicio || '',
    dataFim: medicamento.dataFim || '',
    nextDate: medicamento.dataFim || medicamento.dataInicio || '',
    observacoes: medicamento.observacoes || '',
    statusMedicamento: medicamento.statusMedicamento,
    active: medicamento.statusMedicamento === 'ATIVO',
    petId: medicamento.petId,
    consultaId: medicamento.consultaId,
  };
}

export async function listMedicamentosByPet(petId) {
  const { data } = await apiClient.get('/medicamentos', {
    params: { petId, size: 100, sort: 'dataInicio,desc' },
  });
  return data.content.map(mapMedicamento);
}

export async function createMedicamento(medicamento) {
  const { data } = await apiClient.post('/medicamentos', medicamento);
  return mapMedicamento(data);
}

export async function updateMedicamento(id, medicamento) {
  const { data } = await apiClient.put(`/medicamentos/${id}`, medicamento);
  return mapMedicamento(data);
}

export async function deleteMedicamento(id) {
  await apiClient.delete(`/medicamentos/${id}`);
}
