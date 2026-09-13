import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, BORDER_RADIUS } from '../constants/theme';

export default function DateStrip({ days, selected, onSelect }) {
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

const styles = StyleSheet.create({
  stripScroll: { marginBottom: SPACING.base },
  stripRow: { flexDirection: 'row', gap: SPACING.sm, paddingRight: SPACING.base },
  dayChip: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    minWidth: 56,
  },
  dayChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  dayWeekday: { fontSize: FONT_SIZES.xs, color: COLORS.textMuted, fontWeight: FONT_WEIGHTS.medium },
  dayNum: { fontSize: FONT_SIZES.lg, color: COLORS.textPrimary, fontWeight: FONT_WEIGHTS.extrabold },
  dayMonth: { fontSize: FONT_SIZES.xs, color: COLORS.textMuted, fontWeight: FONT_WEIGHTS.medium },
  dayTextActive: { color: COLORS.white },
});
