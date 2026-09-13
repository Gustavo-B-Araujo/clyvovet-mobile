import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Modal, Pressable, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { usePetProfile } from '../hooks/usePetProfile';
import { useVacinasByPet } from '../hooks/useVacinas';
import { formatDate } from '../services/healthScore';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import SectionHeader from '../components/SectionHeader';

const FILTERS = ['Todas', 'Em dia', 'Atrasadas', 'Próximas'];
const STATUS_MAP = { 'Em dia': 'done', 'Atrasadas': 'overdue', 'Próximas': 'upcoming' };

function VaccineCard({ vaccine, onPress }) {
  const icons = { done: '✅', overdue: '⚠️', upcoming: '📅' };

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <Card style={styles.vaccineCard}>
        <View style={styles.vaccineRow}>
          <View style={[styles.vaccineIcon, {
            backgroundColor: vaccine.status === 'done' ? COLORS.successLight :
              vaccine.status === 'overdue' ? COLORS.dangerLight : COLORS.infoLight
          }]}>
            <Text style={styles.vaccineIconText}>{icons[vaccine.status]}</Text>
          </View>
          <View style={styles.vaccineInfo}>
            <Text style={styles.vaccineName}>{vaccine.name}</Text>
            <View style={styles.vaccineDates}>
              {vaccine.date && (
                <Text style={styles.vaccineDate}>
                  Aplicada: {formatDate(vaccine.date)}
                </Text>
              )}
              <Text style={[styles.vaccineDate,
                vaccine.status === 'overdue' && { color: COLORS.danger, fontWeight: FONT_WEIGHTS.bold }
              ]}>
                {vaccine.status === 'done' ? 'Próxima: ' :
                  vaccine.status === 'overdue' ? 'Venceu: ' : 'Prevista: '}
                {formatDate(vaccine.nextDate)}
              </Text>
            </View>
          </View>
          <View style={styles.vaccineBadge}>
            <Badge status={vaccine.status} />
            <Text style={styles.vaccineChevron}>›</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

function VaccineModal({ vaccine, visible, onClose, onEdit }) {
  if (!vaccine) return null;
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{vaccine.name}</Text>
            <Badge status={vaccine.status} size="md" />
          </View>
          <View style={styles.modalBody}>
            {vaccine.date && (
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>📅 Data de aplicação</Text>
                <Text style={styles.modalValue}>{formatDate(vaccine.date)}</Text>
              </View>
            )}
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>🔁 Próxima dose</Text>
              <Text style={[styles.modalValue,
                vaccine.status === 'overdue' && { color: COLORS.danger }
              ]}>
                {formatDate(vaccine.nextDate)}
              </Text>
            </View>
            {vaccine.fabricante && (
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>🏭 Fabricante</Text>
                <Text style={styles.modalValue}>{vaccine.fabricante}</Text>
              </View>
            )}
            {vaccine.batch && (
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>🏷️ Lote</Text>
                <Text style={styles.modalValue}>{vaccine.batch}</Text>
              </View>
            )}
            {vaccine.notes && (
              <View style={styles.modalNotes}>
                <Text style={styles.modalLabel}>📝 Observações</Text>
                <Text style={styles.modalNotesText}>{vaccine.notes}</Text>
              </View>
            )}
            {vaccine.status === 'overdue' && (
              <View style={styles.modalAlert}>
                <Text style={styles.modalAlertText}>
                  ⚠️ Esta vacina está em atraso. Agende com seu veterinário o quanto antes.
                </Text>
              </View>
            )}
          </View>
          <Button title="Editar vacina" onPress={onEdit} variant="outline" size="full" icon="✏️" style={{ marginTop: SPACING.lg }} />
          <TouchableOpacity style={styles.modalClose} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.modalCloseText}>Fechar</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function VaccinesScreen({ navigation }) {
  const { pet, hasPet } = usePetProfile();
  const { data: vaccines, isLoading } = useVacinasByPet(pet?.id);
  const [filter, setFilter] = useState('Todas');
  const [selected, setSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  if (!hasPet) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <EmptyState
          icon="🐾"
          title="Nenhum pet cadastrado"
          description="Cadastre o perfil do seu pet para começar a registrar vacinas."
          action="Cadastrar pet"
          onAction={() => navigation.navigate('PetForm')}
        />
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safe, styles.loadingContainer]} edges={['bottom']}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  const allVaccines = vaccines || [];
  const filtered = filter === 'Todas'
    ? allVaccines
    : allVaccines.filter(v => v.status === STATUS_MAP[filter]);

  const counts = {
    done: allVaccines.filter(v => v.status === 'done').length,
    overdue: allVaccines.filter(v => v.status === 'overdue').length,
    upcoming: allVaccines.filter(v => v.status === 'upcoming').length,
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {/* Summary bar */}
      <View style={styles.summaryBar}>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNum, { color: COLORS.success }]}>{counts.done}</Text>
          <Text style={styles.summaryLabel}>Em dia</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNum, { color: COLORS.danger }]}>{counts.overdue}</Text>
          <Text style={styles.summaryLabel}>Atrasadas</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNum, { color: COLORS.info }]}>{counts.upcoming}</Text>
          <Text style={styles.summaryLabel}>Próximas</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        <View style={styles.filterRow}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={[styles.filterChip, filter === f && styles.filterActive]}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterText, filter === f && styles.filterActiveText]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Button
          title="Registrar nova vacina"
          onPress={() => navigation.navigate('VaccineForm', { petId: pet.id })}
          variant="primary"
          size="full"
          icon="➕"
          style={{ marginBottom: SPACING.base }}
        />

        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🎉</Text>
            <Text style={styles.emptyText}>Nenhuma vacina nesta categoria</Text>
          </View>
        ) : (
          filtered.map(vaccine => (
            <VaccineCard
              key={vaccine.id}
              vaccine={vaccine}
              onPress={() => { setSelected(vaccine); setModalVisible(true); }}
            />
          ))
        )}

        <Card style={styles.infoCard} variant="flat">
          <Text style={styles.infoTitle}>💡 Sobre o Calendário Vacinal</Text>
          <Text style={styles.infoText}>
            O calendário vacinal deve ser seguido conforme orientação do seu veterinário.
            As datas indicadas são estimativas baseadas no histórico do pet.
          </Text>
        </Card>
        <View style={{ height: SPACING['2xl'] }} />
      </ScrollView>

      <VaccineModal
        vaccine={selected}
        visible={modalVisible}
        onClose={() => { setModalVisible(false); setSelected(null); }}
        onEdit={() => {
          setModalVisible(false);
          navigation.navigate('VaccineForm', { petId: pet.id, vaccine: selected });
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { alignItems: 'center', justifyContent: 'center' },

  summaryBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: SPACING.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.sm,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryNum: { fontSize: FONT_SIZES['2xl'], fontWeight: FONT_WEIGHTS.extrabold },
  summaryLabel: { fontSize: FONT_SIZES.xs, color: COLORS.textMuted, fontWeight: FONT_WEIGHTS.medium },
  summaryDivider: { width: 1, backgroundColor: COLORS.border },

  filterScroll: {
    maxHeight: 56,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  filterActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    fontWeight: FONT_WEIGHTS.medium,
  },
  filterActiveText: { color: COLORS.white, fontWeight: FONT_WEIGHTS.bold },

  scroll: { flex: 1 },
  content: { padding: SPACING.base },

  vaccineCard: { marginBottom: SPACING.sm },
  vaccineRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  vaccineIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vaccineIconText: { fontSize: 20 },
  vaccineInfo: { flex: 1 },
  vaccineName: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  vaccineDates: { gap: 2 },
  vaccineDate: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
  vaccineBadge: { alignItems: 'flex-end', gap: 4 },
  vaccineChevron: {
    fontSize: 20,
    color: COLORS.textMuted,
  },

  empty: { alignItems: 'center', paddingVertical: SPACING['4xl'] },
  emptyIcon: { fontSize: 40, marginBottom: SPACING.sm },
  emptyText: { fontSize: FONT_SIZES.base, color: COLORS.textMuted },

  infoCard: { marginTop: SPACING.sm },
  infoTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  infoText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    lineHeight: 18,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS['2xl'],
    borderTopRightRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.lg,
    paddingBottom: SPACING['3xl'],
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    flex: 1,
  },
  modalBody: { gap: SPACING.sm },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  modalLabel: { fontSize: FONT_SIZES.sm, color: COLORS.textMuted },
  modalValue: { fontSize: FONT_SIZES.sm, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.textPrimary },
  modalNotes: { paddingTop: SPACING.sm },
  modalNotesText: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 4, lineHeight: 20 },
  modalAlert: {
    backgroundColor: COLORS.dangerLight,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.sm,
  },
  modalAlertText: { fontSize: FONT_SIZES.sm, color: COLORS.danger, fontWeight: FONT_WEIGHTS.medium },
  modalClose: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.base,
    alignItems: 'center',
  },
  modalCloseText: { color: COLORS.white, fontWeight: FONT_WEIGHTS.bold, fontSize: FONT_SIZES.base },
});
