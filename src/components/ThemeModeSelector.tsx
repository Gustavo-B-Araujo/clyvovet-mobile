import React from 'react';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import SelectOption from './SelectOption';

const MODE_LABELS: Record<ThemeMode, string> = {
  system: 'Sistema',
  light: 'Claro',
  dark: 'Escuro',
};

const LABEL_OPTIONS = Object.values(MODE_LABELS);

function labelToMode(label: string) {
  return (Object.keys(MODE_LABELS) as ThemeMode[]).find((mode) => MODE_LABELS[mode] === label);
}

export default function ThemeModeSelector() {
  const { mode, setMode } = useTheme();

  const handleChange = (label: string) => {
    const nextMode = labelToMode(label);
    if (nextMode) setMode(nextMode);
  };

  return (
    <SelectOption
      label="Aparência"
      options={LABEL_OPTIONS}
      value={MODE_LABELS[mode]}
      onChange={handleChange}
      style={{ marginBottom: 0 }}
    />
  );
}
