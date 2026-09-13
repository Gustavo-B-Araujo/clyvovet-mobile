import React from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { usePetProfile } from '../hooks/usePetProfile';
import { showAlert } from '../utils/alert';
import { useMedicamentosByPet } from '../hooks/useMedicamentos';
import { useVacinasByPet } from '../hooks/useVacinas';
import { generateAlerts } from '../services/healthScore';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import SectionHeader from '../components/SectionHeader';
import AlertBanner from '../components/AlertBanner';

function InfoRow({ label, value, style }) {
  if (!value) return null;
  return (
    <View style={[styles.infoRow, style]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function PetSwitcher({ pets, selectedId, onSelect, onAddNew }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.switcherScroll}
      contentContainerStyle={styles.switcherRow}
    >
      {pets.map((p) => {
        const isSelected = p.id === selectedId;
        return (
          <TouchableOpacity
            key={p.id}
            onPress={() => onSelect(p.id)}
            activeOpacity={0.8}
            style={[styles.switcherChip, isSelected && styles.switcherChipActive]}
          >
            <Text style={styles.switcherEmoji}>{p.avatarEmoji || '🐾'}</Text>
            <Text style={[styles.switcherName, isSelected && styles.switcherNameActive]} numberOfLines={1}>
              {p.name}
            </Text>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity
        onPress={onAddNew}
        activeOpacity={0.8}
        style={[styles.switcherChip, styles.switcherAddChip]}
      >
        <Text style={styles.switcherAddIcon}>➕</Text>
        <Text style={styles.switcherAddText}>Novo pet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default function PetProfileScreen({ navigation }) {
  const { pet, pets, selectPet, hasPet, loading, removePet } = usePetProfile();
  const { data: medicamentos } = useMedicamentosByPet(pet?.id);
  const { data: vaccines, isLoading: vaccinesLoading } = useVacinasByPet(pet?.id);
  const reminders = medicamentos || [];

  const handleDelete = () => {
    showAlert(
      '🗑️ Remover pet',
      `Tem certeza que deseja remover o perfil de ${pet?.name || 'este pet'}? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await removePet();
            } catch (error) {
              showAlert('Erro', 'Não foi possível remover o pet.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, styles.loadingContainer]} edges={['bottom']}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!hasPet) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <EmptyState
          icon="🐾"
          title="Nenhum pet cadastrado"
          description="Cadastre o perfil do seu pet para começar a acompanhar a jornada de saúde."
          action="Cadastrar pet"
          onAction={() => navigation.navigate('PetForm')}
        />
      </SafeAreaView>
    );
  }

  const petVaccines = vaccines || [];
  const alerts = generateAlerts(pet, petVaccines);
  const doneVaccines = petVaccines.filter(v => v.status === 'done').length;
  const overdueCount = petVaccines.filter(v => v.status === 'overdue').length;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <PetSwitcher
          pets={pets}
          selectedId={pet.id}
          onSelect={selectPet}
          onAddNew={() => navigation.navigate('PetForm', { create: true })}
        />

        <View style={styles.hero}>
          <View style={styles.heroGlow} />
          <View style={styles.heroBg} />
          <View style={styles.heroInner}>
            <View style={styles.heroLeft}>
              <View style={styles.bigAvatar}>
                <Text style={styles.bigAvatarEmoji}>{pet.avatarEmoji || '🐾'}</Text>
              </View>
              <Text style={styles.heroName}>{pet.name}</Text>
              <Text style={styles.heroBreed}>{pet.breed || pet.species}</Text>
              <View style={styles.heroBadges}>
                {pet.sex && <Badge status="active" label={pet.sex} />}
                {pet.age && <Badge status="active" label={`${pet.age} anos`} />}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{pet.weight || '—'}</Text>
            <Text style={styles.statLabel}>kg</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{doneVaccines}/{petVaccines.length}</Text>
            <Text style={styles.statLabel}>Vacinas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNum, overdueCount > 0 && { color: COLORS.danger }]}>
              {overdueCount}
            </Text>
            <Text style={styles.statLabel}>Atrasos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{reminders.filter(r => r.active).length}</Text>
            <Text style={styles.statLabel}>Medicamentos</Text>
          </View>
        </View>

        {alerts.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Alertas Ativos" />
            {alerts.slice(0, 2).map(alert => (
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
          <SectionHeader title="Identificação" />
          <Card>
            <InfoRow label="Nome" value={pet.name} />
            <InfoRow label="Espécie" value={pet.species} />
            <InfoRow label="Raça" value={pet.breed} />
            <InfoRow label="Idade" value={pet.age ? `${pet.age} anos` : null} />
            <InfoRow label="Sexo" value={pet.sex} />
            <InfoRow label="Peso" value={pet.weight ? `${pet.weight} kg` : null} />
            <InfoRow label="Castrado(a)" value={pet.castrado ? 'Sim' : 'Não'} />
            <InfoRow label="Tutor" value={pet.tutor} style={styles.lastInfoRow} />
          </Card>
        </View>

        <View style={styles.actionsRow}>
          <Button
            title="Editar perfil"
            onPress={() => navigation.navigate('PetForm')}
            variant="primary"
            size="md"
            icon="✏️"
            style={{ flex: 1 }}
          />
          <View style={{ width: SPACING.sm }} />
          <Button
            title="Histórico"
            onPress={() => navigation.navigate('History')}
            variant="secondary"
            size="md"
            icon="📋"
            style={{ flex: 1 }}
          />
        </View>
        <Button
          title="Remover pet"
          onPress={handleDelete}
          variant="dangerOutline"
          size="full"
          icon="🗑️"
          style={{ marginBottom: SPACING.md }}
        />

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

  switcherScroll: { marginBottom: SPACING.md },
  switcherRow: { flexDirection: 'row', gap: SPACING.sm, paddingRight: SPACING.base },
  switcherChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    maxWidth: 160,
  },
  switcherChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryPastel,
  },
  switcherEmoji: { fontSize: 16 },
  switcherName: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textSecondary,
  },
  switcherNameActive: { color: COLORS.primary, fontWeight: FONT_WEIGHTS.bold },
  switcherAddChip: {
    borderStyle: 'dashed',
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  switcherAddIcon: { fontSize: 14 },
  switcherAddText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
  },

  hero: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.lg,
  },
  heroGlow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: COLORS.primaryLight,
    opacity: 0.25,
    top: -70,
    right: -50,
  },
  heroBg: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.accent,
    opacity: 0.12,
    bottom: -30,
    left: 20,
  },
  heroInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroLeft: { flex: 1 },
  bigAvatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  bigAvatarEmoji: { fontSize: 32 },
  heroName: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.white,
  },
  heroBreed: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: SPACING.sm,
  },
  heroBadges: { flexDirection: 'row', gap: SPACING.xs },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.base,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    fontWeight: FONT_WEIGHTS.medium,
    marginTop: 2,
  },
  statDivider: { width: 1, backgroundColor: COLORS.border },

  section: { marginBottom: SPACING.lg },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  lastInfoRow: { borderBottomWidth: 0, paddingBottom: 0 },
  infoLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    fontWeight: FONT_WEIGHTS.medium,
  },
  infoValue: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHTS.semibold,
    maxWidth: '55%',
    textAlign: 'right',
  },


  actionsRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
});
