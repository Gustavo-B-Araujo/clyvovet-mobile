import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getTutorById, updateTutor } from '../api/tutores';


export function useTutor() {
  const { user } = useAuth();
  const tutorId = user?.tutorId || null;

  const query = useQuery({
    queryKey: ['tutor', tutorId],
    queryFn: () => getTutorById(tutorId),
    enabled: !!tutorId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    tutor: query.data || null,
    tutorId,
    loading: !!tutorId && query.isLoading,
  };
}

export function useUpdateTutor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, tutor }) => updateTutor(id, tutor),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tutor', variables.id] });
    },
  });
}
