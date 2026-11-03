import React, { useMemo } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BORDER_RADIUS, SPACING, SHADOWS, ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export default function Card({ children, style, variant = 'default', noPadding = false }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={[
      styles.card,
      variant === 'elevated' && styles.elevated,
      variant === 'flat' && styles.flat,
      variant === 'primary' && styles.primary,
      noPadding && styles.noPadding,
      style,
    ]}>
      {children}
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.base,
    ...SHADOWS.md,
  },
  elevated: {
    ...SHADOWS.lg,
  },
  flat: {
    ...Platform.select({
      web: { boxShadow: 'none' },
      default: { shadowOpacity: 0, elevation: 0 },
    }),
    borderWidth: 1,
    borderColor: colors.border,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  noPadding: {
    padding: 0,
  },
});
