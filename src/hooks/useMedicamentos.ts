// Hooks TanStack Query para o recurso /medicamentos — isolam a UI dos detalhes de cache, invalidação e chamadas HTTP.
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listMedicamentosByPet, createMedicamento, updateMedicamento, deleteMedicamento } from '../api/medicamentos';

export function useMedicamentosByPet(petId) {
  return useQuery({
    queryKey: ['medicamentos', petId],
    queryFn: () => listMedicamentosByPet(petId),
    enabled: !!petId,
  });
}

export function useCreateMedicamento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMedicamento,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['medicamentos', variables.petId] });
    },
  });
}

export function useUpdateMedicamento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, medicamento }) => updateMedicamento(id, medicamento),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['medicamentos', variables.medicamento.petId] });
    },
  });
}

export function useDeleteMedicamento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => deleteMedicamento(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['medicamentos', variables.petId] });
    },
  });
}
