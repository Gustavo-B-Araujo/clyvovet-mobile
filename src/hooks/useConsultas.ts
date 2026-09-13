// Hooks TanStack Query para o recurso /consultas — isolam a UI dos detalhes de cache, invalidação e chamadas HTTP.
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listConsultasByPet, listConsultasByVeterinario, createConsulta, updateConsulta, deleteConsulta,
} from '../api/consultas';

export function useConsultasByPet(petId) {
  return useQuery({
    queryKey: ['consultas', petId],
    queryFn: () => listConsultasByPet(petId),
    enabled: !!petId,
  });
}

export function useConsultasByVeterinario(veterinarioId) {
  return useQuery({
    queryKey: ['consultas', 'veterinario', veterinarioId],
    queryFn: () => listConsultasByVeterinario(veterinarioId),
    enabled: !!veterinarioId,
  });
}

export function useCreateConsulta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createConsulta,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['consultas', variables.petId] });
      queryClient.invalidateQueries({ queryKey: ['consultas', 'veterinario', variables.veterinarioId] });
    },
  });
}

export function useUpdateConsulta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, consulta }) => updateConsulta(id, consulta),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['consultas', variables.consulta.petId] });
      queryClient.invalidateQueries({ queryKey: ['consultas', 'veterinario', variables.consulta.veterinarioId] });
    },
  });
}

export function useDeleteConsulta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => deleteConsulta(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['consultas', variables.petId] });
    },
  });
}
