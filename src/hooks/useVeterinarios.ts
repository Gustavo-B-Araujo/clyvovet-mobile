// Hook TanStack Query para o recurso /veterinarios — usado no seletor de veterinário ao registrar uma consulta.
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { listVeterinarios, getVeterinarioById, updateVeterinario } from '../api/veterinarios';

export function useVeterinarios() {
  return useQuery({
    queryKey: ['veterinarios'],
    queryFn: listVeterinarios,
    staleTime: 5 * 60 * 1000,
  });
}

export function useVeterinario() {
  const { user } = useAuth();
  const veterinarioId = user?.veterinarioId || null;

  const query = useQuery({
    queryKey: ['veterinario', veterinarioId],
    queryFn: () => getVeterinarioById(veterinarioId),
    enabled: !!veterinarioId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    veterinario: query.data || null,
    veterinarioId,
    loading: !!veterinarioId && query.isLoading,
  };
}

export function useUpdateVeterinario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, veterinario }) => updateVeterinario(id, veterinario),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['veterinario', variables.id] });
    },
  });
}
