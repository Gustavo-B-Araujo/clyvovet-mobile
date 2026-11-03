import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONT_SIZES, FONT_WEIGHTS, SPACING, ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import Button from './Button';

export default function EmptyState({ icon = '🐾', title, description, action, onAction }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {action && onAction && (
        <Button
          title={action}
          onPress={onAction}
          variant="primary"
          size="md"
          style={styles.button}
        />
      )}
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING['4xl'],
    paddingHorizontal: SPACING['2xl'],
  },
  icon: {
    fontSize: 56,
    marginBottom: SPACING.base,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: FONT_SIZES.base,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  button: {
    marginTop: SPACING.md,
  },
});
