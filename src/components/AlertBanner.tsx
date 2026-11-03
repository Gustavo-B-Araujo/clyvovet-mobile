import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SPACING, ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

// Em tema escuro o fundo é um tom escuro, então o texto usa a cor de texto principal.
const createAlertConfig = (colors: ThemeColors, isDark: boolean) => ({
  warning: {
    bg: colors.warningLight,
    border: colors.warning,
    textColor: isDark ? colors.textPrimary : '#92400E',
    icon: '⚠️',
  },
  danger: {
    bg: colors.dangerLight,
    border: colors.danger,
    textColor: isDark ? colors.textPrimary : '#991B1B',
    icon: '🚨',
  },
  info: {
    bg: colors.infoLight,
    border: colors.info,
    textColor: isDark ? colors.textPrimary : '#1E3A5F',
    icon: 'ℹ️',
  },
  success: {
    bg: colors.successLight,
    border: colors.success,
    textColor: isDark ? colors.textPrimary : '#064E3B',
    icon: '✅',
  },
});

export default function AlertBanner({ type = 'info', title, description, action, onAction, style }) {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const alertConfig = createAlertConfig(colors, isDark);
  const config = alertConfig[type] || alertConfig.info;

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: config.bg,
        borderLeftColor: config.border,
      },
      style,
    ]}>
      <View style={styles.row}>
        <Text style={styles.icon}>{config.icon}</Text>
        <View style={styles.content}>
          <Text style={[styles.title, { color: config.textColor }]}>{title}</Text>
          {description && (
            <Text style={[styles.description, { color: config.textColor }]}>{description}</Text>
          )}
          {action && onAction && (
            <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
              <Text style={[styles.action, { color: config.border }]}>{action} →</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.md,
    borderLeftWidth: 4,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  icon: {
    fontSize: FONT_SIZES.md,
    marginTop: 1,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: 2,
  },
  description: {
    fontSize: FONT_SIZES.xs,
    lineHeight: 18,
    opacity: 0.85,
    marginBottom: SPACING.xs,
  },
  action: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    marginTop: SPACING.xs,
  },
});
