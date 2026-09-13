// Guarda qual pet está selecionado no momento, para tutores com mais de um pet cadastrado.
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { saveSelectedPetId, loadSelectedPetId } from '../storage';

const PetSelectionContext = createContext(null);

export function PetSelectionProvider({ children }) {
  const [selectedPetId, setSelectedPetIdState] = useState(null);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    loadSelectedPetId().then((id) => {
      setSelectedPetIdState(id);
      setRestored(true);
    });
  }, []);

  const setSelectedPetId = useCallback((petId) => {
    const id = petId != null ? String(petId) : null;
    setSelectedPetIdState(id);
    saveSelectedPetId(id);
  }, []);

  return (
    <PetSelectionContext.Provider value={{ selectedPetId, setSelectedPetId, restored }}>
      {children}
    </PetSelectionContext.Provider>
  );
}

export function usePetSelection() {
  const context = useContext(PetSelectionContext);
  if (!context) {
    throw new Error('usePetSelection deve ser usado dentro de um PetSelectionProvider');
  }
  return context;
}
