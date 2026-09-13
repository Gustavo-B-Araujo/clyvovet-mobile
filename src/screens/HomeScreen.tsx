import React from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { usePetProfile } from '../hooks/usePetProfile';
import { useMedicamentosByPet } from '../hooks/useMedicamentos';
import { useVacinasByPet } from '../hooks/useVacinas';
import { useAuth } from '../context/AuthContext';
import { calculateHealthScore, generateAlerts } from '../services/healthScore';
import { HEALTH_TIPS } from '../constants/appContent';
import Card from '../components/Card';
import AlertBanner from '../components/AlertBanner';
import SectionHeader from '../components/SectionHeader';
import HealthScoreRing from '../components/HealthScoreRing';
import Badge from '../components/Badge';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const { pet, hasPet, loading } = usePetProfile();
  const { data: medicamentos } = useMedicamentosByPet(pet?.id);
  const { data: vaccines } = useVacinasByPet(pet?.id);

  const firstName = user?.nome?.trim().split(' ')[0] || '';
  const reminders = medicamentos || [];
  const petVaccines = vaccines || [];
  const score = calculateHealthScore(pet, petVaccines, reminders);
  const alerts = generateAlerts(pet, petVaccines);
  const overdueVaccines = petVaccines.filter(v => v.status === 'overdue');
  const upcomingVaccines = petVaccines.filter(v => v.status === 'upcoming');
  const tip = HEALTH_TIPS[new Date().getDay() % HEALTH_TIPS.length];

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, styles.loadingContainer]} edges={['top']}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  const quickActions = [
    { icon: '💉', label: 'Vacinas', route: 'Vaccines', color: COLORS.primaryPastel },
    { icon: '📋', label: 'Histórico', route: 'History', color: COLORS.accentPastel },
    { icon: '💊', label: 'Medicamentos', route: 'Medications', color: COLORS.successLight },
    { icon: '🚨', label: 'Emergência', route: 'Emergency', color: COLORS.dangerLight },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá{firstName ? `, ${firstName}` : ', tutor(a)'} 👋</Text>
          <Text style={styles.clinicName}>CLYVO VET</Text>
        </View>

        {hasPet ? (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('PetProfile')}
          >
            <View style={styles.heroCard}>
              <View style={styles.heroGradient} />
              <View style={styles.heroContent}>
                <View style={styles.heroLeft}>
                  <View style={styles.petAvatar}>
                    <Text style={styles.petAvatarEmoji}>{pet.avatarEmoji || '🐾'}</Text>
                  </View>
                  <View>
                    <Text style={styles.petName}>{pet.name}</Text>
                    <Text style={styles.petBreed}>{pet.breed || pet.species}</Text>
                    <Text style={styles.petMeta}>
                      {pet.age ? `${pet.age} anos` : ''}{pet.age && pet.sex ? ' · ' : ''}{pet.sex || ''}
                      {pet.weight ? ` · ${pet.weight} kg` : ''}
                    </Text>
                  </View>
                </View>
                <HealthScoreRing score={score} size={88} />
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.noPetCard}
            onPress={() => navigation.navigate('PetForm')}
            activeOpacity={0.85}
          >
            <Text style={styles.noPetEmoji}>🐾</Text>
            <Text style={styles.noPetTitle}>Cadastre seu pet</Text>
            <Text style={styles.noPetSub}>Toque para começar a jornada de saúde</Text>
          </TouchableOpacity>
        )}

        {alerts.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Alertas" subtitle={`${alerts.length} itens requerem atenção`} />
            {alerts.map(alert => (
              <AlertBanner
                key={alert.id}
                type={alert.type}
                title={alert.title}
                description={alert.description}
                action={alert.action}
                onAction={() => navigation.navigate(alert.route)}
              />
            ))}
          </View>
        )}

        <View style={styles.section}>
          <SectionHeader title="Acesso Rápido" />
          <View style={styles.quickGrid}>
            {quickActions.map((item) => (
              <TouchableOpacity
                key={item.route}
                style={[styles.quickItem, { backgroundColor: item.color }]}
                onPress={() => navigation.navigate(item.route)}
                activeOpacity={0.8}
              >
                <Text style={styles.quickIcon}>{item.icon}</Text>
                <Text style={styles.quickLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {hasPet && (
          <View style={styles.section}>
            <SectionHeader
              title="Status Vacinal"
              action="Ver todas"
              onAction={() => navigation.navigate('Vaccines')}
            />
            <Card>
              <View style={styles.vaccineStatus}>
                <View style={styles.vaccineStatusItem}>
                  <Text style={styles.vaccineStatusNum}>{petVaccines.filter(v => v.status === 'done').length}</Text>
                  <Text style={styles.vaccineStatusLabel}>Em dia</Text>
                  <Badge status="done" />
                </View>
                <View style={styles.vaccineStatusDivider} />
                <View style={styles.vaccineStatusItem}>
                  <Text style={[styles.vaccineStatusNum, { color: COLORS.danger }]}>{overdueVaccines.length}</Text>
                  <Text style={styles.vaccineStatusLabel}>Atrasadas</Text>
                  <Badge status="overdue" />
                </View>
                <View style={styles.vaccineStatusDivider} />
                <View style={styles.vaccineStatusItem}>
                  <Text style={[styles.vaccineStatusNum, { color: COLORS.info }]}>{upcomingVaccines.length}</Text>
                  <Text style={styles.vaccineStatusLabel}>Próximas</Text>
                  <Badge status="upcoming" />
                </View>
              </View>
            </Card>
          </View>
        )}

        <View style={styles.section}>
          <SectionHeader title="Dica do Dia" />
          <Card style={styles.tipCard}>
            <Text style={styles.tipIcon}>{tip.icon}</Text>
            <Text style={styles.tipTitle}>{tip.title}</Text>
            <Text style={styles.tipDescription}>{tip.description}</Text>
            <View style={styles.tipCategory}>
              <Badge status="active" label={tip.category} />
            </View>
          </Card>
        </View>

        {hasPet && (
          <TouchableOpacity
            style={styles.historyBanner}
            onPress={() => navigation.navigate('History')}
            activeOpacity={0.85}
          >
            <View>
              <Text style={styles.historyBannerTitle}>📋 Histórico Clínico</Text>
              <Text style={styles.historyBannerSub}>Veja toda a jornada de saúde do {pet?.name || 'seu pet'}</Text>
            </View>
            <Text style={styles.historyArrow}>→</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: SPACING['3xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1 },
  content: { padding: SPACING.base },

  header: {
    marginBottom: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  greeting: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textMuted,
    fontWeight: FONT_WEIGHTS.medium,
  },
  clinicName: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },

  heroCard: {
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
    ...SHADOWS.lg,
  },
  heroGradient: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.primaryLight,
    opacity: 0.3,
    top: -60,
    right: -40,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  petAvatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  petAvatarEmoji: { fontSize: 28 },
  petName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.white,
  },
  petBreed: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: FONT_WEIGHTS.medium,
  },
  petMeta: {
    fontSize: FONT_SIZES.xs,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 2,
  },

  noPetCard: {
    borderRadius: BORDER_RADIUS['2xl'],
    borderWidth: 2,
    borderColor: COLORS.primaryPastel,
    borderStyle: 'dashed',
    padding: SPACING['2xl'],
    marginBottom: SPACING.lg,
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  noPetEmoji: { fontSize: 40, marginBottom: SPACING.sm },
  noPetTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
    marginBottom: 4,
  },
  noPetSub: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
  },

  section: { marginBottom: SPACING.lg },

  quickGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  quickItem: {
    flex: 1,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  quickIcon: { fontSize: 24, marginBottom: 6 },
  quickLabel: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },

  vaccineStatus: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  vaccineStatusItem: { alignItems: 'center', gap: SPACING.xs },
  vaccineStatusNum: {
    fontSize: FONT_SIZES['3xl'],
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.success,
  },
  vaccineStatusLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    fontWeight: FONT_WEIGHTS.medium,
  },
  vaccineStatusDivider: {
    width: 1,
    height: 50,
    backgroundColor: COLORS.border,
  },

  tipCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  tipIcon: { fontSize: 28, marginBottom: SPACING.sm },
  tipTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  tipDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  tipCategory: { flexDirection: 'row' },

  historyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primaryPastel,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.base,
    marginBottom: SPACING.sm,
  },
  historyBannerTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primaryDark,
    marginBottom: 2,
  },
  historyBannerSub: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
  },
  historyArrow: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.bold,
  },
});
