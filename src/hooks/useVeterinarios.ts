// Hook TanStack Query para o recurso /veterinarios — usado no seletor de veterinário ao registrar uma consulta.
import { useQuery } from '@tanstack/react-query';
import { listVeterinarios } from '../api/veterinarios';

export function useVeterinarios() {
  return useQuery({
    queryKey: ['veterinarios'],
    queryFn: listVeterinarios,
    staleTime: 5 * 60 * 1000,
  });
}
