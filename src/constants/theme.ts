import { Platform } from 'react-native';

export const LIGHT_COLORS = {
  // Primárias
  primary: '#6C3FC5',
  primaryLight: '#8B5CF6',
  primaryDark: '#4C1D95',
  primaryPastel: '#EDE9FE',

  // Secundárias
  secondary: '#A78BFA',
  secondaryLight: '#C4B5FD',
  secondaryPastel: '#F5F3FF',

  // Accent
  accent: '#F472B6',
  accentLight: '#FBCFE8',
  accentPastel: '#FDF2F8',

  // Neutros
  white: '#FFFFFF',
  background: '#F8F7FF',
  surface: '#FFFFFF',
  surfaceAlt: '#F3F4F6',

  // Textos
  textPrimary: '#1E1B4B',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textOnPrimary: '#FFFFFF',

  // Status
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // Bordas e divisores
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  divider: '#F3F4F6',

  // Sombras
  shadowColor: '#6C3FC5',
  shadowNeutral: '#000000',
};

export type ThemeColors = typeof LIGHT_COLORS;

// Mesmas chaves da paleta clara. Variantes "Light"/"Pastel" viram tons escuros, usados como fundo de destaque.
// `white` continua branco puro (texto sobre cor forte); fundos de superfície usam `surface`.
export const DARK_COLORS: ThemeColors = {
  // Primárias
  primary: '#8B5CF6',
  primaryLight: '#A78BFA',
  primaryDark: '#6C3FC5',
  primaryPastel: '#2E2350',

  // Secundárias
  secondary: '#A78BFA',
  secondaryLight: '#7C5CC4',
  secondaryPastel: '#241E3A',

  // Accent
  accent: '#F472B6',
  accentLight: '#5B2745',
  accentPastel: '#2E1A28',

  // Neutros
  white: '#FFFFFF',
  background: '#121018',
  surface: '#1C1A26',
  surfaceAlt: '#262433',

  // Textos
  textPrimary: '#F3F2FF',
  textSecondary: '#A8A5BD',
  textMuted: '#7C7992',
  textOnPrimary: '#FFFFFF',

  // Status
  success: '#34D399',
  successLight: '#0F3D2E',
  warning: '#FBBF24',
  warningLight: '#3F2F0B',
  danger: '#F87171',
  dangerLight: '#451A1A',
  info: '#60A5FA',
  infoLight: '#172B4D',

  // Bordas e divisores
  border: '#34314A',
  borderLight: '#262433',
  divider: '#262433',

  // Sombras
  shadowColor: '#000000',
  shadowNeutral: '#000000',
};

// Paleta clara usada pelas telas que ainda não foram migradas para o useTheme().
export const COLORS = LIGHT_COLORS;

export const FONT_SIZES = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 40,
};

export const FONT_WEIGHTS = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

const hexToRgba = (hex: string, alpha: number) => {
  const value = hex.replace('#', '');
  const r = parseInt(value.substring(0, 2), 16);
  const g = parseInt(value.substring(2, 4), 16);
  const b = parseInt(value.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const createShadow = (
  color: string,
  offset: { width: number; height: number },
  opacity: number,
  radius: number,
  elevation: number
) =>
  Platform.select({
    web: {
      boxShadow: `${offset.width}px ${offset.height}px ${radius}px ${hexToRgba(color, opacity)}`,
    },
    default: {
      shadowColor: color,
      shadowOffset: offset,
      shadowOpacity: opacity,
      shadowRadius: radius,
      elevation,
    },
  });

export const SHADOWS = {
  sm: createShadow('#6C3FC5', { width: 0, height: 2 }, 0.08, 6, 2),
  md: createShadow('#6C3FC5', { width: 0, height: 4 }, 0.12, 12, 4),
  lg: createShadow('#6C3FC5', { width: 0, height: 8 }, 0.16, 20, 8),
  danger: createShadow('#EF4444', { width: 0, height: 4 }, 0.2, 12, 4),
};
