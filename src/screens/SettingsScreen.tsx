import React from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { usePetProfile } from '../hooks/usePetProfile';
import { useAuth } from '../context/AuthContext';
import { useTutor } from '../hooks/useTutor';
import { showAlert } from '../utils/alert';
import Card from '../components/Card';
import SectionHeader from '../components/SectionHeader';

function SettingRow({ icon, label, subtitle, onPress, rightElement, isLast = false }) {
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
        {rightElement || (onPress && <Text style={styles.settingChevron}>›</Text>)}
      </View>
    </TouchableOpacity>
  );
}

export default function SettingsScreen({ navigation }) {
  const { pet, hasPet } = usePetProfile();
  const { user, logout } = useAuth();
  const { tutor } = useTutor();

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

  const handleAbout = () => {
    showAlert(
      '🐾 CLYVO VET',
      'Versão 1.0.0\n\nCLYVO é uma plataforma de saúde animal contínua e inteligente, desenvolvida para transformar a jornada do pet em uma experiência preventiva, integrada e humanizada.\n\n© 2025 CLYVO VET',
      [{ text: 'Fechar' }]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Banner */}
        <TouchableOpacity
          style={styles.profileBanner}
          onPress={() => navigation.navigate('PetProfile')}
          activeOpacity={0.85}
        >
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarEmoji}>{pet?.avatarEmoji || '🐾'}</Text>
          </View>
          <View style={styles.profileInfo}>
            {hasPet ? (
              <>
                <Text style={styles.profileName}>{pet.name}</Text>
                <Text style={styles.profileMeta}>
                  {[pet.species, pet.breed].filter(Boolean).join(' · ')}
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.profileName}>Nenhum pet cadastrado</Text>
                <Text style={styles.profileMeta}>Toque para cadastrar</Text>
              </>
            )}
          </View>
          <Text style={styles.profileChevron}>›</Text>
        </TouchableOpacity>

        {/* Pet */}
        <View style={styles.section}>
          <SectionHeader title="Meu Pet" />
          <Card>
            <SettingRow
              icon="🐾"
              label="Perfil do pet"
              subtitle={hasPet ? pet.name : 'Nenhum pet cadastrado'}
              onPress={() => navigation.navigate('PetProfile')}
            />
            <SettingRow
              icon="✏️"
              label="Editar cadastro"
              subtitle="Atualizar informações do pet"
              onPress={() => navigation.navigate('PetForm')}
            />
            <SettingRow
              icon="💉"
              label="Carteira de vacinação"
              onPress={() => navigation.navigate('Vaccines')}
            />
            <SettingRow
              icon="📋"
              label="Histórico clínico"
              onPress={() => navigation.navigate('History')}
              isLast
            />
          </Card>
        </View>

        {/* Conta */}
        <View style={styles.section}>
          <SectionHeader title="Conta" />
          <Card>
            <SettingRow
              icon="👤"
              label={tutor?.nome || 'Tutor(a)'}
              subtitle={user?.email}
            />
            <SettingRow
              icon="✏️"
              label="Editar dados"
              subtitle="Nome e telefone"
              onPress={() => navigation.navigate('EditAccount')}
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

        {/* Clínica */}
        <View style={styles.section}>
          <SectionHeader title="Clínica" />
          <Card>
            <SettingRow icon="🏥" label="CLYVO VET" subtitle="Sua clínica parceira" />
            <SettingRow icon="📞" label="(11) 4002-8922" subtitle="Atendimento 24h" />
            <SettingRow icon="📍" label="Rua da Saúde Animal, 100" subtitle="São Paulo, SP" isLast />
          </Card>
        </View>

        {/* App */}
        <View style={styles.section}>
          <SectionHeader title="Aplicativo" />
          <Card>
            <SettingRow
              icon="ℹ️"
              label="Sobre o CLYVO"
              subtitle="Versão 1.0.0"
              onPress={handleAbout}
            />
            <SettingRow
              icon="🔒"
              label="Privacidade"
              subtitle="Login protegido por autenticação JWT da API ClyvoVet"
              isLast
            />
          </Card>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerLogo}>🐾 CLYVO VET</Text>
          <Text style={styles.footerTagline}>Saúde animal contínua e inteligente</Text>
          <Text style={styles.footerVersion}>v1.0.0 · Conectado à API ClyvoVet</Text>
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
  profileChevron: { fontSize: 22, color: 'rgba(255,255,255,0.6)', fontWeight: FONT_WEIGHTS.bold },

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
  footerTagline: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  footerVersion: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    opacity: 0.6,
  },
});
