// Hook TanStack Query para o recurso /exames — usado no modal de detalhe do histórico Clínico para listar os exames vinculados a uma consulta.
import { useQuery } from '@tanstack/react-query';
import { listExamesByConsulta } from '../api/exames';

export function useExamesByConsulta(consultaId, options = {}) {
  return useQuery({
    queryKey: ['exames', 'consulta', consultaId],
    queryFn: () => listExamesByConsulta(consultaId),
    enabled: !!consultaId && options.enabled !== false,
  });
}
