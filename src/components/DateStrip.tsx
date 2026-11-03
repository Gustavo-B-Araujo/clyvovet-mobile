import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { FONT_SIZES, FONT_WEIGHTS, SPACING, BORDER_RADIUS, ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export default function DateStrip({ days, selected, onSelect }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stripScroll}>
      <View style={styles.stripRow}>
        {days.map((d) => {
          const isSelected = d.iso === selected;
          return (
            <TouchableOpacity
              key={d.iso}
              onPress={() => onSelect(d.iso)}
              activeOpacity={0.8}
              style={[styles.dayChip, isSelected && styles.dayChipActive]}
            >
              <Text style={[styles.dayWeekday, isSelected && styles.dayTextActive]}>{d.weekday}</Text>
              <Text style={[styles.dayNum, isSelected && styles.dayTextActive]}>{d.day}</Text>
              <Text style={[styles.dayMonth, isSelected && styles.dayTextActive]}>{d.month}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  stripScroll: { marginBottom: SPACING.base },
  stripRow: { flexDirection: 'row', gap: SPACING.sm, paddingRight: SPACING.base },
  dayChip: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    minWidth: 56,
  },
  dayChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  dayWeekday: { fontSize: FONT_SIZES.xs, color: colors.textMuted, fontWeight: FONT_WEIGHTS.medium },
  dayNum: { fontSize: FONT_SIZES.lg, color: colors.textPrimary, fontWeight: FONT_WEIGHTS.extrabold },
  dayMonth: { fontSize: FONT_SIZES.xs, color: colors.textMuted, fontWeight: FONT_WEIGHTS.medium },
  dayTextActive: { color: colors.white },
});
