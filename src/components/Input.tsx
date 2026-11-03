import React, { useMemo, useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SPACING, ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helper,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  secureTextEntry = false,
  autoCapitalize = 'sentences',
  editable = true,
  prefix = null,
  suffix = null,
  style,
  inputStyle,
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      <View style={[
        styles.inputWrapper,
        focused && styles.focused,
        error && styles.errorBorder,
        !editable && styles.disabled,
        multiline && styles.multilineWrapper,
      ]}>
        {prefix && <Text style={styles.prefix}>{prefix}</Text>}
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          editable={editable}
        />
        {suffix && <Text style={styles.suffix}>{suffix}</Text>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {helper && !error && <Text style={styles.helperText}>{helper}</Text>}
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    marginBottom: SPACING.base,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    color: colors.textPrimary,
    marginBottom: SPACING.xs,
    letterSpacing: 0.2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: SPACING.md,
    minHeight: 50,
  },
  multilineWrapper: {
    alignItems: 'flex-start',
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    minHeight: 100,
  },
  focused: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  errorBorder: {
    borderColor: colors.danger,
  },
  disabled: {
    opacity: 0.6,
    backgroundColor: colors.surfaceAlt,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.base,
    color: colors.textPrimary,
    fontWeight: FONT_WEIGHTS.regular,
  },
  multilineInput: {
    textAlignVertical: 'top',
  },
  prefix: {
    fontSize: FONT_SIZES.base,
    color: colors.textMuted,
    marginRight: SPACING.xs,
  },
  suffix: {
    fontSize: FONT_SIZES.sm,
    color: colors.textMuted,
    marginLeft: SPACING.xs,
  },
  errorText: {
    fontSize: FONT_SIZES.xs,
    color: colors.danger,
    marginTop: SPACING.xs,
  },
  helperText: {
    fontSize: FONT_SIZES.xs,
    color: colors.textMuted,
    marginTop: SPACING.xs,
  },
});
