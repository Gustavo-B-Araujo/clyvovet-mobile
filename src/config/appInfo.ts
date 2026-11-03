import Constants from 'expo-constants';

const commitHash = Constants.expoConfig?.extra?.commitHash || 'desconhecido';

export const APP_INFO = {
  name: 'CLYVO VET',
  version: Constants.expoConfig?.version || '1.0.0',
  commitHash,
  commitHashShort: commitHash.slice(0, 7),
};
