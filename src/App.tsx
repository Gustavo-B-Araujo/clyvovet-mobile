import 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './context/AuthContext';
import { PetSelectionProvider } from './context/PetSelectionContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import AppNavigator from './navigation';
import SplashScreen from './screens/SplashScreen';
import { configureNotifications } from './services/notifications';

configureNotifications();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

function ThemedStatusBar() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? 'light' : 'dark'} />;
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <PetSelectionProvider>
              <ThemedStatusBar />
              {!splashDone ? (
                <SplashScreen onFinish={() => setSplashDone(true)} />
              ) : (
                <AppNavigator />
              )}
            </PetSelectionProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
