// Fornece a paleta de cores ativa (clara ou escura) e a preferência de aparência escolhida pelo usuário.
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { LIGHT_COLORS, DARK_COLORS } from '../constants/theme';
import { saveThemeMode, loadThemeMode } from '../storage';

export const THEME_MODES = ['system', 'light', 'dark'];

// Enquanto a migração das telas para o useTheme() não termina, o app fica fixo no tema claro.
// Para testar telas migradas, troque temporariamente por 'dark'. Com null, vale a escolha do usuário.
const FORCED_MODE = 'light';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState('system');

  useEffect(() => {
    loadThemeMode().then((saved) => {
      if (THEME_MODES.includes(saved)) setModeState(saved);
    });
  }, []);

  const setMode = useCallback((nextMode) => {
    setModeState(nextMode);
    saveThemeMode(nextMode);
  }, []);

  const value = useMemo(() => {
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
