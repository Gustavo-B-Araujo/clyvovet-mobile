// Camada de acesso a dados para o recurso /exames da API.
import apiClient from './client';

export function mapExame(exame) {
  return {
    id: String(exame.id),
    tipo: exame.tipo,
    date: exame.dataRealizacao,
    resultado: exame.resultado || '',
    urlArquivo: exame.urlArquivo || '',
    observacoes: exame.observacoes || '',
    petId: exame.petId,
    consultaId: exame.consultaId,
  };
}

export async function listExamesByConsulta(consultaId) {
  const { data } = await apiClient.get('/exames', {
    params: { consultaId, size: 50, sort: 'dataRealizacao,desc' },
  });
  return data.content.map(mapExame);
}
