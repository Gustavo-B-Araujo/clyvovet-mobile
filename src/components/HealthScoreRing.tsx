import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, FONT_WEIGHTS } from '../constants/theme';
import { getScoreLabel } from '../services/healthScore';

export default function HealthScoreRing({ score = 0, size = 120 }) {
  const { label, color } = getScoreLabel(score);
  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Background ring */}
      <View style={[
        styles.ring,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: COLORS.primaryPastel,
        }
      ]} />
      {/* Score text */}
      <View style={styles.content}>
        <Text style={[styles.score, { color, fontSize: size * 0.28 }]}>
          {score}
        </Text>
        <Text style={[styles.label, { color, fontSize: size * 0.12 }]}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ring: {
    position: 'absolute',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    fontWeight: FONT_WEIGHTS.extrabold,
    lineHeight: undefined,
  },
  label: {
    fontWeight: FONT_WEIGHTS.semibold,
    marginTop: 2,
    letterSpacing: 0.5,
  },
});
