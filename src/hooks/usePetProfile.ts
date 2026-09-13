import { useCallback, useEffect, useMemo } from 'react';
import { useTutor } from './useTutor';
import { usePetSelection } from '../context/PetSelectionContext';
import { usePetsByTutor, useCreatePet, useUpdatePet, useDeletePet } from './usePets';
import { ESPECIE_LABELS, SEXO_LABELS, especieToEnum, sexoToEnum } from '../api/pets';

const AVATAR_BY_ESPECIE = {
  CACHORRO: '🐶',
  GATO: '🐱',
  PASSARO: '🐦',
  ROEDOR: '🐹',
  REPTIL: '🦎',
  PEIXE: '🐠',
  OUTRO: '🐾',
};

function calculateAge(birthDate) {
  if (!birthDate) return '';
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return '';
  const diffMs = Date.now() - birth.getTime();
  const years = diffMs / (1000 * 60 * 60 * 24 * 365.25);
  return years < 1 ? '0' : String(Math.floor(years));
}

function mapApiPet(apiPet) {
  return {
    id: apiPet.id,
    name: apiPet.nome,
    species: ESPECIE_LABELS[apiPet.especie] || '',
    breed: apiPet.raca || '',
    birthDate: apiPet.dataNascimento || '',
    age: calculateAge(apiPet.dataNascimento),
    sex: SEXO_LABELS[apiPet.sexo] || '',
    weight: apiPet.peso != null ? String(apiPet.peso) : '',
    castrado: !!apiPet.castrado,
    tutor: apiPet.tutorNome || '',
    tutorId: apiPet.tutorId,
    avatarEmoji: AVATAR_BY_ESPECIE[apiPet.especie] || '🐾',
  };
}

function toPetRequest(form, tutorId) {
  return {
    nome: form.name?.trim(),
    especie: especieToEnum(form.species),
    raca: form.breed || null,
    dataNascimento: form.birthDate || null,
    peso: form.weight ? parseFloat(form.weight) : null,
    sexo: sexoToEnum(form.sex),
    castrado: !!form.castrado,
    tutorId,
  };
}

export function usePetProfile() {
  const { tutorId, loading: tutorLoading } = useTutor();
  const { data: apiPets, isLoading: petsLoading } = usePetsByTutor(tutorId);
  const { selectedPetId, setSelectedPetId, restored } = usePetSelection();
  const createPetMutation = useCreatePet();
  const updatePetMutation = useUpdatePet();
  const deletePetMutation = useDeletePet();

  const pets = useMemo(() => (apiPets || []).map(mapApiPet), [apiPets]);
  const selected = pets.find((p) => String(p.id) === String(selectedPetId));
  const pet = selected || pets[0] || null;


  useEffect(() => {
    if (petsLoading || !restored) return;
    if (pets.length === 0) {
      if (selectedPetId != null) setSelectedPetId(null);
      return;
    }
    const stillExists = pets.some((p) => String(p.id) === String(selectedPetId));
    if (!stillExists) {
      setSelectedPetId(pets[0].id);
    }
  }, [petsLoading, restored, pets, selectedPetId, setSelectedPetId]);

  const createPet = useCallback(
    async (form) => {
      const created = await createPetMutation.mutateAsync(toPetRequest(form, tutorId));
      setSelectedPetId(created.id);
      return created;
    },
    [createPetMutation, tutorId, setSelectedPetId]
  );

  const updatePet = useCallback(
    (form) => updatePetMutation.mutateAsync({ id: pet.id, pet: toPetRequest(form, tutorId) }),
    [updatePetMutation, pet, tutorId]
  );

  const removePet = useCallback(
    async () => {
      await deletePetMutation.mutateAsync({ id: pet.id, tutorId });
      setSelectedPetId(null);
    },
    [deletePetMutation, pet, tutorId, setSelectedPetId]
  );

  return {
    pet,
    pets,
    selectPet: setSelectedPetId,
    loading: tutorLoading || petsLoading || !restored,
    createPet,
    updatePet,
    removePet,
    hasPet: !!pet,
  };
}
