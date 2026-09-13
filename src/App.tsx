import 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './context/AuthContext';
import { PetSelectionProvider } from './context/PetSelectionContext';
import AppNavigator from './navigation';
import SplashScreen from './screens/SplashScreen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <PetSelectionProvider>
            <StatusBar style="auto" />
            {!splashDone ? (
              <SplashScreen onFinish={() => setSplashDone(true)} />
            ) : (
              <AppNavigator />
            )}
          </PetSelectionProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
