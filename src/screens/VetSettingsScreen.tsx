import React, { useMemo } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FONT_SIZES, FONT_WEIGHTS, SPACING, BORDER_RADIUS, SHADOWS, ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { showAlert } from '../utils/alert';
import { APP_INFO } from '../config/appInfo';
import Card from '../components/Card';
import SectionHeader from '../components/SectionHeader';
import ThemeModeSelector from '../components/ThemeModeSelector';

function SettingRow({ icon, label, subtitle, onPress, isLast = false }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
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

export default function VetSettingsScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
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
              icon="✏️"
              label="Editar dados"
              subtitle="Nome e telefone"
              onPress={() => navigation.navigate('VetEditAccount')}
            />
            <SettingRow
              icon="🔑"
              label="Alterar senha"
              subtitle="Trocar sua senha de login"
              onPress={() => navigation.navigate('ChangePassword')}
            />
            <SettingRow
              icon="🚪"
              label="Sair"
              subtitle="Encerrar sessão"
              onPress={handleLogout}
              isLast
            />
          </Card>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Aparência" />
          <Card>
            <ThemeModeSelector />
          </Card>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Aplicativo" />
          <Card>
            <SettingRow
              icon="ℹ️"
              label="Sobre o App"
              subtitle={`Versão ${APP_INFO.version} · ${APP_INFO.commitHashShort}`}
              onPress={() => navigation.navigate('About')}
            />
            <SettingRow
              icon="🔒"
              label="Privacidade"
              subtitle="Login protegido por autenticação JWT da API ClyvoVet"
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

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { padding: SPACING.base },

  profileBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
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
    color: colors.white,
  },
  profileMeta: { fontSize: FONT_SIZES.xs, color: 'rgba(255,255,255,0.7)', marginTop: 2 },

  section: { marginBottom: SPACING.lg },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    gap: SPACING.md,
  },
  lastRow: { borderBottomWidth: 0 },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primaryPastel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingIcon: { fontSize: 18 },
  settingContent: { flex: 1 },
  settingLabel: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.semibold,
    color: colors.textPrimary,
  },
  settingSubtitle: {
    fontSize: FONT_SIZES.xs,
    color: colors.textMuted,
    marginTop: 1,
  },
  settingChevron: {
    fontSize: 22,
    color: colors.textMuted,
    fontWeight: FONT_WEIGHTS.bold,
  },

  footer: { alignItems: 'center', paddingVertical: SPACING['2xl'] },
  footerLogo: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: colors.primary,
    letterSpacing: 2,
    marginBottom: 4,
  },
  footerVersion: {
    fontSize: FONT_SIZES.xs,
    color: colors.textMuted,
    opacity: 0.6,
  },
});
