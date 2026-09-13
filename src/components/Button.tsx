import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SPACING, SHADOWS } from '../constants/theme';

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon = null,
  style,
  textStyle,
}) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'danger' ? COLORS.white : COLORS.primary}
          size="small"
        />
      ) : (
        <View style={styles.content}>
          {icon && <Text style={styles.icon}>{icon}</Text>}
          <Text style={[
            styles.text,
            styles[`text_${variant}`],
            styles[`textSize_${size}`],
            textStyle,
          ]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  icon: {
    fontSize: FONT_SIZES.md,
  },

  // Variants
  primary: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.md,
  },
  secondary: {
    backgroundColor: COLORS.primaryPastel,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: COLORS.danger,
    ...SHADOWS.danger,
  },
  dangerOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.danger,
  },

  size_sm: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  size_md: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  size_lg: {
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING['2xl'],
  },
  size_full: {
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.xl,
    width: '100%',
  },

  disabled: {
    opacity: 0.5,
  },

  text: {
    fontWeight: FONT_WEIGHTS.semibold,
    letterSpacing: 0.2,
  },

  text_primary: { color: COLORS.white },
  text_secondary: { color: COLORS.primary },
  text_outline: { color: COLORS.primary },
  text_ghost: { color: COLORS.primary },
  text_danger: { color: COLORS.white },
  text_dangerOutline: { color: COLORS.danger },

  textSize_sm: { fontSize: FONT_SIZES.sm },
  textSize_md: { fontSize: FONT_SIZES.base },
  textSize_lg: { fontSize: FONT_SIZES.md },
  textSize_full: { fontSize: FONT_SIZES.md },
});
