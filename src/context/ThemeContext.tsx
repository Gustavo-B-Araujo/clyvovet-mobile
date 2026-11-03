// Fornece a paleta de cores ativa (clara ou escura) e a preferência de aparência escolhida pelo usuário.
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import { LIGHT_COLORS, DARK_COLORS, ThemeColors } from '../constants/theme';
import { saveThemeMode, loadThemeMode } from '../storage';

export type ThemeMode = 'system' | 'light' | 'dark';

export const THEME_MODES: ThemeMode[] = ['system', 'light', 'dark'];

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

  // Faz os componentes nativos (diálogos, teclado, seletor de datas) seguirem a escolha do usuário.
  useEffect(() => {
    Appearance.setColorScheme(mode === 'system' ? 'unspecified' : mode);
  }, [mode]);

  const setMode = useCallback((nextMode: ThemeMode) => {
    setModeState(nextMode);
    saveThemeMode(nextMode);
  }, []);

  const value = useMemo<ThemeContextValue>(() => {
    const scheme = mode === 'system' ? systemScheme : mode;
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
