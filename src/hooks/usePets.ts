// Hooks TanStack Query para o recurso /pets — isolam a UI dos detalhes de cache, invalidação e chamadas HTTP.
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listPetsByTutor, createPet, updatePet, deletePet } from '../api/pets';

export function usePetsByTutor(tutorId) {
  return useQuery({
    queryKey: ['pets', tutorId],
    queryFn: () => listPetsByTutor(tutorId),
    enabled: !!tutorId,
  });
}

export function useCreatePet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPet,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pets', variables.tutorId] });
    },
  });
}

export function useUpdatePet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, pet }) => updatePet(id, pet),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pets', variables.pet.tutorId] });
    },
  });
}

export function useDeletePet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => deletePet(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pets', variables.tutorId] });
    },
  });
}
