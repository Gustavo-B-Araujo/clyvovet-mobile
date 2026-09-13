import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Switch, Modal, Pressable, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { usePetProfile } from '../hooks/usePetProfile';
import { showAlert } from '../utils/alert';
import {
  useMedicamentosByPet, useCreateMedicamento, useUpdateMedicamento, useDeleteMedicamento,
} from '../hooks/useMedicamentos';
import { formatDate } from '../services/healthScore';
import { addDays, generateDayRange, todayIsoDate } from '../constants/schedule';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import SelectOption from '../components/SelectOption';
import SectionHeader from '../components/SectionHeader';
import EmptyState from '../components/EmptyState';
import Badge from '../components/Badge';
import DateStrip from '../components/DateStrip';

const FREQUENCIES = ['Diário', 'Semanal', 'Mensal', 'Trimestral', 'Anual'];

function emptyForm() {
  return {
    nome: '', dosagem: '', frequencia: 'Mensal',
    dataInicio: todayIsoDate(), dataFim: '', observacoes: '',
  };
}

function MedicamentoCard({ medicamento, onToggle, onDelete }) {
  return (
    <Card style={[styles.reminderCard, !medicamento.active && styles.inactiveCard]}>
      <View style={styles.reminderRow}>
        <View style={[styles.reminderIcon, { backgroundColor: medicamento.active ? COLORS.primaryPastel : COLORS.surfaceAlt }]}>
          <Text style={styles.reminderIconText}>💊</Text>
        </View>
        <View style={styles.reminderInfo}>
          <Text style={[styles.reminderTitle, !medicamento.active && styles.inactiveText]}>
            {medicamento.title}
          </Text>
          {medicamento.dosagem ? (
            <Text style={styles.reminderDesc} numberOfLines={1}>{medicamento.dosagem}</Text>
          ) : null}
          <View style={styles.reminderMeta}>
            {medicamento.frequencia ? (
              <Badge status={medicamento.active ? 'active' : 'inactive'} label={medicamento.frequencia} />
            ) : null}
            {medicamento.nextDate ? (
              <Text style={styles.reminderDate}>📅 {formatDate(medicamento.nextDate)}</Text>
            ) : null}
          </View>
        </View>
        <View style={styles.reminderActions}>
          <Switch
            value={medicamento.active}
            onValueChange={() => onToggle(medicamento)}
            trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
            thumbColor={medicamento.active ? COLORS.primary : COLORS.textMuted}
          />
          <TouchableOpacity onPress={() => onDelete(medicamento)} activeOpacity={0.7}>
            <Text style={styles.deleteIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
}

export default function RemindersScreen({ navigation }) {
  const { pet, hasPet } = usePetProfile();
  const { data: medicamentos, isLoading } = useMedicamentosByPet(pet?.id);
  const createMedicamento = useCreateMedicamento();
  const updateMedicamento = useUpdateMedicamento();
  const deleteMedicamento = useDeleteMedicamento();

  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const setField = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const continuo = !form.dataFim;


  const startDays = useMemo(() => generateDayRange(addDays(todayIsoDate(), -14), 60), []);
  const endDays = useMemo(
    () => generateDayRange(form.dataInicio || todayIsoDate(), 90),
    [form.dataInicio]
  );

  const handleSelectStart = (iso) => {
    setForm(prev => ({
      ...prev,
      dataInicio: iso,
      dataFim: prev.dataFim && prev.dataFim < iso ? iso : prev.dataFim,
    }));
    if (errors.dataInicio) setErrors(prev => ({ ...prev, dataInicio: '' }));
  };

  const handleToggleContinuo = (isContinuo) => {
    setField('dataFim', isContinuo ? '' : (form.dataInicio || todayIsoDate()));
  };

  const validate = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = 'Nome obrigatório';
    if (!form.dataInicio) e.dataInicio = 'Data de início obrigatória';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = async () => {
    if (!validate()) return;
    await createMedicamento.mutateAsync({
      nome: form.nome.trim(),
      dosagem: form.dosagem.trim() || null,
      frequencia: form.frequencia || null,
      dataInicio: form.dataInicio,
      dataFim: form.dataFim || null,
      observacoes: form.observacoes.trim() || null,
      statusMedicamento: 'ATIVO',
      petId: pet.id,
    });
    setModalVisible(false);
    setForm(emptyForm());
    setErrors({});
  };

  const handleToggle = (medicamento) => {
    updateMedicamento.mutate({
      id: medicamento.id,
      medicamento: {
        nome: medicamento.title,
        dosagem: medicamento.dosagem || null,
        frequencia: medicamento.frequencia || null,
        dataInicio: medicamento.dataInicio,
        dataFim: medicamento.dataFim || null,
        observacoes: medicamento.observacoes || null,
        statusMedicamento: medicamento.active ? 'SUSPENSO' : 'ATIVO',
        petId: pet.id,
      },
    });
  };

  const handleDelete = (medicamento) => {
    showAlert(
      'Remover medicamento',
      'Deseja remover este registro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => deleteMedicamento.mutate({ id: medicamento.id, petId: pet.id }),
        },
      ]
    );
  };

  if (!hasPet) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <EmptyState
          icon="🐾"
          title="Nenhum pet cadastrado"
          description="Cadastre o perfil do seu pet para começar a registrar medicamentos."
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

  const reminders = medicamentos || [];
  const activeReminders = reminders.filter(r => r.active);
  const inactiveReminders = reminders.filter(r => !r.active);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.summaryBar}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNum}>{activeReminders.length}</Text>
          <Text style={styles.summaryLabel}>Ativos</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNum}>{reminders.length}</Text>
          <Text style={styles.summaryLabel}>Total</Text>
        </View>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.addBtnText}>+ Novo</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {reminders.length === 0 ? (
          <EmptyState
            icon="💊"
            title="Nenhum medicamento"
            description="Registre medicamentos e tratamentos em uso pelo seu pet."
            action="Registrar medicamento"
            onAction={() => setModalVisible(true)}
          />
        ) : (
          <>
            {activeReminders.length > 0 && (
              <View style={styles.section}>
                <SectionHeader title="Ativos" subtitle={`${activeReminders.length} medicamentos`} />
                {activeReminders.map(r => (
                  <MedicamentoCard
                    key={r.id}
                    medicamento={r}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                  />
                ))}
              </View>
            )}
            {inactiveReminders.length > 0 && (
              <View style={styles.section}>
                <SectionHeader title="Suspensos" subtitle={`${inactiveReminders.length} medicamentos`} />
                {inactiveReminders.map(r => (
                  <MedicamentoCard
                    key={r.id}
                    medicamento={r}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                  />
                ))}
              </View>
            )}
          </>
        )}
        <View style={{ height: SPACING['2xl'] }} />
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Novo Medicamento</Text>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Input
                label="Nome *"
                value={form.nome}
                onChangeText={v => setField('nome', v)}
                placeholder="Ex: Antiparasitário"
                error={errors.nome}
              />
              <Input
                label="Dosagem"
                value={form.dosagem}
                onChangeText={v => setField('dosagem', v)}
                placeholder="Ex: 1 comprimido"
              />
              <SelectOption
                label="Frequência"
                options={FREQUENCIES}
                value={form.frequencia}
                onChange={v => setField('frequencia', v)}
              />
              <Text style={styles.fieldLabel}>Data de início *</Text>
              <DateStrip days={startDays} selected={form.dataInicio} onSelect={handleSelectStart} />
              {errors.dataInicio ? <Text style={styles.errorText}>{errors.dataInicio}</Text> : null}

              <View style={styles.continuoRow}>
                <Text style={styles.continuoLabel}>Tratamento contínuo (sem data de término)</Text>
                <Switch
                  value={continuo}
                  onValueChange={handleToggleContinuo}
                  trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
                  thumbColor={continuo ? COLORS.primary : COLORS.textMuted}
                />
              </View>

              {!continuo && (
                <>
                  <Text style={styles.fieldLabel}>Data de término</Text>
                  <DateStrip days={endDays} selected={form.dataFim} onSelect={(iso) => setField('dataFim', iso)} />
                </>
              )}

              <Input
                label="Observações"
                value={form.observacoes}
                onChangeText={v => setField('observacoes', v)}
                placeholder="Detalhes do tratamento..."
                multiline
                numberOfLines={2}
              />
            </ScrollView>

            <View style={styles.modalActions}>
              <Button
                title="Cancelar"
                onPress={() => { setModalVisible(false); setForm(emptyForm()); setErrors({}); }}
                variant="outline"
                size="md"
                style={{ flex: 1 }}
              />
              <View style={{ width: SPACING.sm }} />
              <Button
                title="Salvar"
                onPress={handleAdd}
                variant="primary"
                size="md"
                loading={createMedicamento.isPending}
                style={{ flex: 1 }}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { alignItems: 'center', justifyContent: 'center' },

  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.md,
  },
  summaryItem: { alignItems: 'center' },
  summaryNum: { fontSize: FONT_SIZES.xl, fontWeight: FONT_WEIGHTS.extrabold, color: COLORS.primary },
  summaryLabel: { fontSize: FONT_SIZES.xs, color: COLORS.textMuted, fontWeight: FONT_WEIGHTS.medium },
  summaryDivider: { width: 1, height: 32, backgroundColor: COLORS.border },
  addBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    ...SHADOWS.sm,
  },
  addBtnText: { color: COLORS.white, fontWeight: FONT_WEIGHTS.bold, fontSize: FONT_SIZES.sm },

  scroll: { flex: 1 },
  content: { padding: SPACING.base },
  section: { marginBottom: SPACING.lg },

  reminderCard: { marginBottom: SPACING.sm },
  inactiveCard: { opacity: 0.65 },
  reminderRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  reminderIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderIconText: { fontSize: 22 },
  reminderInfo: { flex: 1 },
  reminderTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  inactiveText: { color: COLORS.textMuted },
  reminderDesc: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  reminderMeta: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flexWrap: 'wrap' },
  reminderDate: { fontSize: FONT_SIZES.xs, color: COLORS.textMuted },
  reminderActions: { alignItems: 'center', gap: SPACING.sm },
  deleteIcon: { fontSize: 18 },

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
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center', marginBottom: SPACING.lg,
  },
  fieldLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    letterSpacing: 0.2,
  },
  errorText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.danger,
    marginTop: -SPACING.xs,
    marginBottom: SPACING.sm,
  },
  continuoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.base,
    gap: SPACING.sm,
  },
  continuoLabel: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHTS.medium,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  modalActions: { flexDirection: 'row', marginTop: SPACING.lg },
});
