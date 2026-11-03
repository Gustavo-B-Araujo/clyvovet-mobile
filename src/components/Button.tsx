import React, { useMemo } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SPACING, SHADOWS, ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

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
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
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
          color={variant === 'primary' || variant === 'danger' ? colors.white : colors.primary}
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

const createStyles = (colors: ThemeColors) => StyleSheet.create({
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
    backgroundColor: colors.primary,
    ...SHADOWS.md,
  },
  secondary: {
    backgroundColor: colors.primaryPastel,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: colors.danger,
    ...SHADOWS.danger,
  },
  dangerOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.danger,
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

  text_primary: { color: colors.white },
  text_secondary: { color: colors.primary },
  text_outline: { color: colors.primary },
  text_ghost: { color: colors.primary },
  text_danger: { color: colors.white },
  text_dangerOutline: { color: colors.danger },

  textSize_sm: { fontSize: FONT_SIZES.sm },
  textSize_md: { fontSize: FONT_SIZES.base },
  textSize_lg: { fontSize: FONT_SIZES.md },
  textSize_full: { fontSize: FONT_SIZES.md },
});
