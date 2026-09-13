import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING, SHADOWS } from '../constants/theme';

export default function Card({ children, style, variant = 'default', noPadding = false }) {
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.base,
    ...SHADOWS.md,
  },
  elevated: {
    ...SHADOWS.lg,
  },
  flat: {
    shadowOpacity: 0,
    elevation: 0,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  noPadding: {
    padding: 0,
  },
});
