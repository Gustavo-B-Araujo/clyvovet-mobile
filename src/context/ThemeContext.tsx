// Fornece a paleta de cores ativa (clara ou escura) e a preferência de aparência escolhida pelo usuário.
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { LIGHT_COLORS, DARK_COLORS, ThemeColors } from '../constants/theme';
import { saveThemeMode, loadThemeMode } from '../storage';

export type ThemeMode = 'system' | 'light' | 'dark';

export const THEME_MODES: ThemeMode[] = ['system', 'light', 'dark'];

// Enquanto a migração das telas para o useTheme() não termina, o app fica fixo no tema claro.
// Para testar telas migradas, troque temporariamente por 'dark'. Com null, vale a escolha do usuário.
const FORCED_MODE: ThemeMode | null = 'light' as ThemeMode | null;

type ThemeContextValue = {
  colors: ThemeColors;
  isDark: boolean;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    loadThemeMode().then((saved) => {
      if (saved && THEME_MODES.includes(saved as ThemeMode)) setModeState(saved as ThemeMode);
    });
  }, []);

  const setMode = useCallback((nextMode: ThemeMode) => {
    setModeState(nextMode);
    saveThemeMode(nextMode);
  }, []);

  const value = useMemo<ThemeContextValue>(() => {
    const effectiveMode = FORCED_MODE || mode;
    const scheme = effectiveMode === 'system' ? systemScheme : effectiveMode;
    const isDark = scheme === 'dark';
    return {
      colors: isDark ? DARK_COLORS : LIGHT_COLORS,
      isDark,
      mode,
      setMode,
    };
  }, [mode, systemScheme, setMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
}
