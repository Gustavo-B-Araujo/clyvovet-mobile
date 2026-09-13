import React from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { showAlert } from '../utils/alert';
import Card from '../components/Card';
import SectionHeader from '../components/SectionHeader';

function SettingRow({ icon, label, subtitle, onPress, isLast = false }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={[styles.settingRow, isLast && styles.lastRow]}>
        <View style={styles.settingIconContainer}>
          <Text style={styles.settingIcon}>{icon}</Text>
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingLabel}>{label}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
        {onPress && <Text style={styles.settingChevron}>›</Text>}
      </View>
    </TouchableOpacity>
  );
}

export default function VetSettingsScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    showAlert(
      'Sair da conta',
      'Tem certeza que deseja encerrar a sessão?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: () => logout() },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileBanner}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarEmoji}>👨‍⚕️</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.nome || 'Veterinário(a)'}</Text>
            <Text style={styles.profileMeta}>{user?.email}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Conta" />
          <Card>
            <SettingRow
              icon="🚪"
              label="Sair"
              subtitle="Encerrar sessão"
              onPress={handleLogout}
              isLast
            />
          </Card>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerLogo}>🐾 CLYVO VET</Text>
          <Text style={styles.footerVersion}>v1.0.0 · Área do veterinário</Text>
        </View>

        <View style={{ height: SPACING['2xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  content: { padding: SPACING.base },

  profileBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.base,
    marginBottom: SPACING.lg,
    gap: SPACING.md,
    ...SHADOWS.md,
  },
  profileAvatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  profileAvatarEmoji: { fontSize: 26 },
  profileInfo: { flex: 1 },
  profileName: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.white,
  },
  profileMeta: { fontSize: FONT_SIZES.xs, color: 'rgba(255,255,255,0.7)', marginTop: 2 },

  section: { marginBottom: SPACING.lg },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    gap: SPACING.md,
  },
  lastRow: { borderBottomWidth: 0 },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.primaryPastel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingIcon: { fontSize: 18 },
  settingContent: { flex: 1 },
  settingLabel: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
  },
  settingSubtitle: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  settingChevron: {
    fontSize: 22,
    color: COLORS.textMuted,
    fontWeight: FONT_WEIGHTS.bold,
  },

  footer: { alignItems: 'center', paddingVertical: SPACING['2xl'] },
  footerLogo: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.primary,
    letterSpacing: 2,
    marginBottom: 4,
  },
  footerVersion: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    opacity: 0.6,
  },
});
