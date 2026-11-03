// Mantém os lembretes locais de medicamento sincronizados com os dados da API e trata o toque na notificação.
import { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { usePetProfile } from './usePetProfile';
import { useMedicamentosByPet } from './useMedicamentos';
import { usePetSelection } from '../context/PetSelectionContext';
import { syncMedicationReminders } from '../services/notifications';

// Reagenda sempre que a lista de medicamentos muda (criação, suspensão, exclusão ou receita do veterinário).
export function useMedicationReminderSync() {
  const { pet } = usePetProfile();
  const { data: medicamentos } = useMedicamentosByPet(pet?.id);

  useEffect(() => {
    if (!pet || !medicamentos) return;
    syncMedicationReminders(pet, medicamentos).catch((e) => {
      console.error('[Notifications] sync error:', e);
    });
  }, [pet, medicamentos]);
}

// Ao tocar na notificação (app aberto, em segundo plano ou fechado), abre a tela de medicamentos do pet.
export function useMedicationNotificationNavigation() {
  const navigation = useNavigation();
  const { setSelectedPetId } = usePetSelection();
  const response = Notifications.useLastNotificationResponse();
  const handledId = useRef(null);

  useEffect(() => {
    if (!response) return;
    const id = response.notification.request.identifier;
    if (handledId.current === id) return;
    const data = response.notification.request.content.data;
    if (data?.type !== 'medicamento') return;

    handledId.current = id;
    if (data.petId != null) setSelectedPetId(data.petId);
    navigation.navigate('Medications');
  }, [response, navigation, setSelectedPetId]);
}
