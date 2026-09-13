import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SPACING } from '../constants/theme';

const BADGE_STYLES = {
  done: { bg: COLORS.successLight, text: COLORS.success, label: 'Em dia' },
  upcoming: { bg: COLORS.infoLight, text: COLORS.info, label: 'Próxima' },
  overdue: { bg: COLORS.dangerLight, text: COLORS.danger, label: 'Atrasada' },
  active: { bg: COLORS.primaryPastel, text: COLORS.primary, label: 'Ativo' },
  inactive: { bg: COLORS.surfaceAlt, text: COLORS.textMuted, label: 'Inativo' },
  critical: { bg: COLORS.dangerLight, text: COLORS.danger, label: 'Crítico' },
  high: { bg: COLORS.warningLight, text: COLORS.warning, label: 'Alto' },
  medium: { bg: COLORS.infoLight, text: COLORS.info, label: 'Médio' },
  consulta: { bg: COLORS.primaryPastel, text: COLORS.primary, label: 'Consulta' },
  exame: { bg: COLORS.infoLight, text: COLORS.info, label: 'Exame' },
  cirurgia: { bg: COLORS.dangerLight, text: COLORS.danger, label: 'Cirurgia' },
  retorno: { bg: COLORS.successLight, text: COLORS.success, label: 'Retorno' },
  emergencia: { bg: COLORS.warningLight, text: '#B45309', label: 'Emergência' },
};

export default function Badge({ status, label, size = 'sm' }) {
  const config = BADGE_STYLES[status] || { bg: COLORS.surfaceAlt, text: COLORS.textMuted, label: status };
  const displayLabel = label || config.label;

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }, size === 'md' && styles.badgeMd]}>
      <Text style={[styles.text, { color: config.text }, size === 'md' && styles.textMd]}>
        {displayLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
