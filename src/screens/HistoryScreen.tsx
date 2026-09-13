import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Modal, Pressable, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { usePetProfile } from '../hooks/usePetProfile';
import { useConsultasByPet } from '../hooks/useConsultas';
import { useExamesByConsulta } from '../hooks/useExames';
import { STATUS_CONSULTA_LABELS } from '../api/consultas';
import { formatDate } from '../services/healthScore';
import Badge from '../components/Badge';
import Card from '../components/Card';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';

const TYPE_CONFIG = {
  consulta: { icon: '🩺', color: COLORS.primary, bg: COLORS.primaryPastel },
  exame: { icon: '🔬', color: COLORS.info, bg: COLORS.infoLight },
  cirurgia: { icon: '⚕️', color: COLORS.danger, bg: COLORS.dangerLight },
  retorno: { icon: '🔄', color: COLORS.success, bg: COLORS.successLight },
  emergencia: { icon: '🚨', color: '#B45309', bg: COLORS.warningLight },
};

function HistoryModal({ event, visible, onClose, onEdit }) {
  const { data: exames, isLoading: loadingExames } = useExamesByConsulta(event?.id, { enabled: visible });

  if (!event) return null;
  const cfg = TYPE_CONFIG[event.type] || TYPE_CONFIG.consulta;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.modalHandle} />

            <View style={[styles.modalIconHeader, { backgroundColor: cfg.bg }]}>
              <Text style={styles.modalIcon}>{cfg.icon}</Text>
            </View>

            <Text style={styles.modalTitle}>{event.title}</Text>
            <View style={styles.modalMeta}>
              <Badge status={event.type} />
              <Badge status="active" label={STATUS_CONSULTA_LABELS[event.statusConsulta] || event.statusConsulta} />
              <Text style={styles.modalDate}>{formatDate(event.date)}</Text>
            </View>

            {event.vet && (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>👨‍⚕️ Veterinário</Text>
                <Text style={styles.modalSectionText}>{event.vet}</Text>
              </View>
            )}

            {event.diagnostico ? (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>📋 Diagnóstico</Text>
                <Text style={styles.modalSectionText}>{event.diagnostico}</Text>
              </View>
            ) : null}

            {event.tratamento ? (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>💊 Tratamento</Text>
                <Text style={styles.modalSectionText}>{event.tratamento}</Text>
              </View>
            ) : null}

            {event.observacoes ? (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>📝 Observações</Text>
                <Text style={styles.modalSectionText}>{event.observacoes}</Text>
              </View>
            ) : null}

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>🔬 Exames vinculados</Text>
              {loadingExames ? (
                <ActivityIndicator color={COLORS.primary} style={{ marginTop: SPACING.xs }} />
              ) : exames && exames.length > 0 ? (
                exames.map((e) => (
                  <View key={e.id} style={styles.listItem}>
                    <Text style={styles.listDot}>•</Text>
                    <Text style={styles.listText}>
                      {e.tipo}{e.resultado ? ` — ${e.resultado}` : ''}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.modalSectionText}>Nenhum exame vinculado a esta consulta.</Text>
              )}
            </View>

            <Button title="Editar consulta" onPress={onEdit} variant="outline" size="full" icon="✏️" style={{ marginTop: SPACING.sm }} />
            <TouchableOpacity style={styles.modalClose} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.modalCloseText}>Fechar</Text>
            </TouchableOpacity>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function HistoryScreen({ navigation }) {
  const { pet, hasPet } = usePetProfile();
  const { data: consultas, isLoading } = useConsultasByPet(pet?.id);
  const [selected, setSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  if (!hasPet) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <EmptyState
          icon="🐾"
          title="Nenhum pet cadastrado"
          description="Cadastre o perfil do seu pet para começar a registrar o histórico clínico."
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

  const allEvents = consultas || [];

  const sorted = [...allEvents].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const grouped = sorted.reduce((acc, event) => {
    const year = event.date.split('-')[0];
    if (!acc[year]) acc[year] = [];
    acc[year].push(event);
    return acc;
  }, {});

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {allEvents.length > 0 && (
        <View style={styles.statsBar}>
          {Object.entries({
            consulta: '🩺', exame: '🔬', cirurgia: '⚕️',
            retorno: '🔄', emergencia: '🚨'
          }).map(([type, icon]) => {
            const count = allEvents.filter(h => h.type === type).length;
            if (!count) return null;
            return (
              <View key={type} style={styles.statItem}>
                <Text style={styles.statIcon}>{icon}</Text>
                <Text style={styles.statNum}>{count}</Text>
                <Text style={styles.statLabel}>{type}</Text>
              </View>
            );
          })}
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Button
          title="Registrar nova consulta"
          onPress={() => navigation.navigate('ConsultaForm', { petId: pet.id })}
          variant="primary"
          size="full"
          icon="➕"
          style={{ marginBottom: SPACING.base }}
        />

        {allEvents.length === 0 ? (
          <EmptyState
            icon="📋"
            title="Nenhum registro clínico"
            description="Registre consultas, exames e cirurgias para acompanhar a jornada de saúde do seu pet."
            action="Registrar consulta"
            onAction={() => navigation.navigate('ConsultaForm', { petId: pet.id })}
          />
        ) : (
          Object.keys(grouped).sort((a, b) => b - a).map(year => (
            <View key={year} style={styles.yearGroup}>
              <View style={styles.yearHeader}>
                <View style={styles.yearLine} />
                <Text style={styles.yearText}>{year}</Text>
                <View style={styles.yearLine} />
              </View>

              {grouped[year].map((event, idx) => {
                const cfg = TYPE_CONFIG[event.type] || TYPE_CONFIG.consulta;
                const isLast = idx === grouped[year].length - 1;
                return (
                  <TouchableOpacity
                    key={event.id}
                    activeOpacity={0.85}
                    onPress={() => { setSelected(event); setModalVisible(true); }}
                  >
                    <View style={styles.timelineItem}>
                      <View style={styles.timelineLeft}>
                        <View style={[styles.timelineDot, { backgroundColor: cfg.color }]}>
                          <Text style={styles.timelineDotIcon}>{cfg.icon}</Text>
                        </View>
                        {!isLast && <View style={[styles.timelineLine, { backgroundColor: cfg.color }]} />}
                      </View>

                      <Card style={styles.eventCard}>
                        <View style={styles.eventRow}>
                          <View style={styles.eventInfo}>
                            <Text style={styles.eventTitle}>{event.title}</Text>
                            <Text style={styles.eventDate}>{formatDate(event.date)}</Text>
                            {event.vet && <Text style={styles.eventVet}>{event.vet}</Text>}
                          </View>
                          <View style={styles.eventRight}>
                            <Badge status={event.type} />
                            <Text style={styles.eventChevron}>›</Text>
                          </View>
                        </View>
                        {event.description ? (
                          <Text style={styles.eventDesc} numberOfLines={2}>{event.description}</Text>
                        ) : null}
                      </Card>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))
        )}
        <View style={{ height: SPACING['2xl'] }} />
      </ScrollView>

      <HistoryModal
        event={selected}
        visible={modalVisible}
        onClose={() => { setModalVisible(false); setSelected(null); }}
        onEdit={() => {
          setModalVisible(false);
          navigation.navigate('ConsultaForm', { petId: pet.id, consulta: selected });
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { alignItems: 'center', justifyContent: 'center' },

  statsBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.md,
    flexWrap: 'wrap',
  },
  statItem: { alignItems: 'center', gap: 2 },
  statIcon: { fontSize: 18 },
  statNum: { fontSize: FONT_SIZES.base, fontWeight: FONT_WEIGHTS.extrabold, color: COLORS.primary },
  statLabel: { fontSize: FONT_SIZES.xs, color: COLORS.textMuted, textTransform: 'capitalize' },

  scroll: { flex: 1 },
  content: { padding: SPACING.base },

  yearGroup: { marginBottom: SPACING.md },
  yearHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  yearLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  yearText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textMuted,
    paddingHorizontal: SPACING.xs,
    letterSpacing: 1,
  },

  timelineItem: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 40,
  },
  timelineDot: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  timelineDotIcon: { fontSize: 18 },
  timelineLine: {
    width: 2,
    flex: 1,
    opacity: 0.2,
    marginTop: 4,
    marginBottom: -4,
  },

  eventCard: { flex: 1 },
  eventRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  eventInfo: { flex: 1 },
  eventTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
  },
  eventDate: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  eventVet: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    marginTop: 1,
  },
  eventRight: { alignItems: 'flex-end', gap: 4 },
  eventChevron: { fontSize: 20, color: COLORS.textMuted },
  eventDesc: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },

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
    maxHeight: '85%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  modalIconHeader: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  modalIcon: { fontSize: 28 },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  modalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
    flexWrap: 'wrap',
  },
  modalDate: { fontSize: FONT_SIZES.sm, color: COLORS.textMuted },
  modalSection: {
    marginBottom: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  modalSectionTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  modalSectionText: { fontSize: FONT_SIZES.sm, color: COLORS.textPrimary, lineHeight: 22 },
  listItem: { flexDirection: 'row', gap: SPACING.xs, marginTop: 4 },
  listDot: { color: COLORS.primary, fontWeight: FONT_WEIGHTS.bold },
  listText: { fontSize: FONT_SIZES.sm, color: COLORS.textPrimary, flex: 1 },
  modalClose: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.base,
    alignItems: 'center',
  },
  modalCloseText: { color: COLORS.white, fontWeight: FONT_WEIGHTS.bold, fontSize: FONT_SIZES.base },
});
