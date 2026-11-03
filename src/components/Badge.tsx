import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SPACING, ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const createBadgeStyles = (colors: ThemeColors, isDark: boolean) => ({
  done: { bg: colors.successLight, text: colors.success, label: 'Em dia' },
  upcoming: { bg: colors.infoLight, text: colors.info, label: 'Próxima' },
  overdue: { bg: colors.dangerLight, text: colors.danger, label: 'Atrasada' },
  active: { bg: colors.primaryPastel, text: colors.primary, label: 'Ativo' },
  inactive: { bg: colors.surfaceAlt, text: colors.textMuted, label: 'Inativo' },
  critical: { bg: colors.dangerLight, text: colors.danger, label: 'Crítico' },
  high: { bg: colors.warningLight, text: colors.warning, label: 'Alto' },
  medium: { bg: colors.infoLight, text: colors.info, label: 'Médio' },
  consulta: { bg: colors.primaryPastel, text: colors.primary, label: 'Consulta' },
  exame: { bg: colors.infoLight, text: colors.info, label: 'Exame' },
  cirurgia: { bg: colors.dangerLight, text: colors.danger, label: 'Cirurgia' },
  retorno: { bg: colors.successLight, text: colors.success, label: 'Retorno' },
  emergencia: { bg: colors.warningLight, text: isDark ? colors.warning : '#B45309', label: 'Emergência' },
});

export default function Badge({ status, label, size = 'sm' }) {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const config = createBadgeStyles(colors, isDark)[status] || { bg: colors.surfaceAlt, text: colors.textMuted, label: status };
  const displayLabel = label || config.label;

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }, size === 'md' && styles.badgeMd]}>
      <Text style={[styles.text, { color: config.text }, size === 'md' && styles.textMd]}>
        {displayLabel}
      </Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.full,
    alignSelf: 'flex-start',
  },
  badgeMd: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  text: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: 0.3,
  },
  textMd: {
    fontSize: FONT_SIZES.sm,
  },
});
