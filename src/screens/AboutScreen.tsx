import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { APP_INFO } from '../config/appInfo';
import Card from '../components/Card';

function InfoRow({ label, value, selectable = false, isLast = false }) {
  return (
    <View style={[styles.infoRow, isLast && styles.lastRow]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} selectable={selectable}>{value}</Text>
    </View>
  );
}

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoEmoji}>🐾</Text>
          </View>
          <Text style={styles.name}>{APP_INFO.name}</Text>
          <Text style={styles.version}>Versão {APP_INFO.version}</Text>
        </View>

        <Card>
          <InfoRow label="Versão" value={APP_INFO.version} />
          <InfoRow label="Commit (curto)" value={APP_INFO.commitHashShort} selectable />
          <InfoRow label="Hash do commit" value={APP_INFO.commitHash} selectable isLast />
        </Card>

        <Text style={styles.description}>
          CLYVO é uma plataforma de saúde animal contínua e inteligente, desenvolvida para transformar
          a jornada do pet em uma experiência preventiva, integrada e humanizada.
        </Text>
        <Text style={styles.footer}>© 2026 CLYVO VET</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.base, paddingBottom: SPACING['2xl'] },
  header: { alignItems: 'center', marginVertical: SPACING.xl },
  logo: {
    width: 88,
    height: 88,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  logoEmoji: { fontSize: 44 },
  name: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.textPrimary,
  },
  version: { fontSize: FONT_SIZES.base, color: COLORS.textSecondary, marginTop: SPACING.xs },
  infoRow: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  lastRow: { borderBottomWidth: 0 },
  infoLabel: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  infoValue: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
  },
  description: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: SPACING.xl,
  },
  footer: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.base,
  },
});
