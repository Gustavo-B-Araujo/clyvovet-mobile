import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  AUTH_TOKEN: '@clyvo:auth_token',
  AUTH_USER: '@clyvo:auth_user',
  SELECTED_PET_ID: '@clyvo:selected_pet_id',
};

export async function saveSession(token, user) {
  try {
    await AsyncStorage.multiSet([
      [KEYS.AUTH_TOKEN, token],
      [KEYS.AUTH_USER, JSON.stringify(user)],
    ]);
    return true;
  } catch (e) {
    console.error('[Storage] saveSession error:', e);
    return false;
  }
}

export async function loadSession() {
  try {
    const [[, token], [, userJson]] = await AsyncStorage.multiGet([KEYS.AUTH_TOKEN, KEYS.AUTH_USER]);
    if (!token || !userJson) return null;
    return { token, user: JSON.parse(userJson) };
  } catch (e) {
    console.error('[Storage] loadSession error:', e);
    return null;
  }
}

export async function clearSession() {
  try {
    await AsyncStorage.multiRemove([KEYS.AUTH_TOKEN, KEYS.AUTH_USER]);
    return true;
  } catch (e) {
    console.error('[Storage] clearSession error:', e);
    return false;
  }
}

export async function getAuthToken() {
  try {
    return await AsyncStorage.getItem(KEYS.AUTH_TOKEN);
  } catch (e) {
    return null;
  }
}

// Função para mostrar qual pet está em foco (quando tiver):
export async function saveSelectedPetId(petId) {
  try {
    if (petId == null) {
      await AsyncStorage.removeItem(KEYS.SELECTED_PET_ID);
    } else {
      await AsyncStorage.setItem(KEYS.SELECTED_PET_ID, String(petId));
    }
    return true;
  } catch (e) {
    console.error('[Storage] saveSelectedPetId error:', e);
    return false;
  }
}

export async function loadSelectedPetId() {
  try {
    return await AsyncStorage.getItem(KEYS.SELECTED_PET_ID);
  } catch (e) {
    return null;
  }
}