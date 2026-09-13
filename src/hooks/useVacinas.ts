// Hooks TanStack Query para o recurso /vacinas — isolam a UI dos detalhes de cache, invalidação e chamadas HTTP.
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listVacinasByPet, createVacina, updateVacina, deleteVacina } from '../api/vacinas';

export function useVacinasByPet(petId) {
  return useQuery({
    queryKey: ['vacinas', petId],
    queryFn: () => listVacinasByPet(petId),
    enabled: !!petId,
  });
}

export function useCreateVacina() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createVacina,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vacinas', variables.petId] });
    },
  });
}

export function useUpdateVacina() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, vacina }) => updateVacina(id, vacina),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vacinas', variables.vacina.petId] });
    },
  });
}

export function useDeleteVacina() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => deleteVacina(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vacinas', variables.petId] });
    },
  });
}
