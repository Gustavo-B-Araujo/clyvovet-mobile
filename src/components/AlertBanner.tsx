import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SPACING } from '../constants/theme';

const ALERT_CONFIG = {
  warning: {
    bg: COLORS.warningLight,
    border: COLORS.warning,
    textColor: '#92400E',
    icon: '⚠️',
  },
  danger: {
    bg: COLORS.dangerLight,
    border: COLORS.danger,
    textColor: '#991B1B',
    icon: '🚨',
  },
  info: {
    bg: COLORS.infoLight,
    border: COLORS.info,
    textColor: '#1E3A5F',
    icon: 'ℹ️',
  },
  success: {
    bg: COLORS.successLight,
    border: COLORS.success,
    textColor: '#064E3B',
    icon: '✅',
  },
};

export default function AlertBanner({ type = 'info', title, description, action, onAction, style }) {
  const config = ALERT_CONFIG[type] || ALERT_CONFIG.info;

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

const styles = StyleSheet.create({
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
