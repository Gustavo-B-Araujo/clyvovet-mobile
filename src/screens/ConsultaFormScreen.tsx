import React, { useState, useMemo } from 'react';
import {
  View, ScrollView, StyleSheet, Text,
  TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { showAlert } from '../utils/alert';
import { useCreateConsulta, useUpdateConsulta, useDeleteConsulta, useConsultasByVeterinario } from '../hooks/useConsultas';
import { useVeterinarios } from '../hooks/useVeterinarios';
import { TIPO_CONSULTA_LABELS, tipoConsultaToEnum } from '../api/consultas';
import { generateUpcomingDays, generateDaySlots, isSlotInPast } from '../constants/schedule';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import SelectOption from '../components/SelectOption';
import DateStrip from '../components/DateStrip';

const TIPO_OPTIONS = Object.values(TIPO_CONSULTA_LABELS);
const SLOTS = generateDaySlots();

function SlotGrid({ dateIso, selected, bookedTimes, onSelect }) {
  const isDisabled = (time) => bookedTimes.includes(time) || isSlotInPast(dateIso, time);

  if (SLOTS.every(isDisabled)) {
    return <Text style={styles.noSlotsText}>Nenhum horário disponível neste dia.</Text>;
  }

  return (
    <View style={styles.slotGrid}>
      {SLOTS.map((time) => {
        const disabled = isDisabled(time);
        const isSelected = time === selected;
        return (
          <TouchableOpacity
            key={time}
            disabled={disabled}
            onPress={() => onSelect(time)}
            activeOpacity={0.8}
            style={[
              styles.slotChip,
              isSelected && styles.slotChipActive,
              disabled && styles.slotChipDisabled,
            ]}
          >
            <Text style={[
              styles.slotText,
              isSelected && styles.slotTextActive,
              disabled && styles.slotTextDisabled,
            ]}>
              {time}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function ConsultaFormScreen({ navigation, route }) {
  const { petId, consulta } = route.params;
  const isEditing = !!consulta;

  const { data: veterinarios, isLoading: loadingVets } = useVeterinarios();
  const createConsulta = useCreateConsulta();
  const updateConsulta = useUpdateConsulta();
  const deleteConsulta = useDeleteConsulta();

  const [form, setForm] = useState({
    tipoConsulta: consulta ? TIPO_CONSULTA_LABELS[consulta.tipoConsulta] : TIPO_OPTIONS[0],
    veterinarioNome: consulta?.vet || '',
    data: consulta?.date || '',
    hora: consulta?.dataHora ? consulta.dataHora.slice(11, 16) : '',
    observacoes: consulta?.observacoes || '',
  });
  const [errors, setErrors] = useState({});

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const vets = veterinarios || [];
  const vetOptions = vets.map((v) => v.nome);
  const selectedVet = vets.find((v) => v.nome === form.veterinarioNome);

  const { data: consultasDoVet } = useConsultasByVeterinario(selectedVet?.id);
  const days = useMemo(() => generateUpcomingDays(14), []);

  const bookedTimes = useMemo(() => {
    if (!consultasDoVet || !form.data) return [];
    return consultasDoVet
      .filter((c) => c.date === form.data && c.id !== consulta?.id)
      .map((c) => c.dataHora.slice(11, 16));
  }, [consultasDoVet, form.data, consulta]);


  const handleSelectVet = (nome) => {
    if (nome === form.veterinarioNome) return;
    setForm((prev) => ({ ...prev, veterinarioNome: nome, data: '', hora: '' }));
    if (errors.veterinarioNome) setErrors((prev) => ({ ...prev, veterinarioNome: '' }));
  };

  const handleSelectDay = (iso) => {
    if (iso === form.data) return;
    setForm((prev) => ({ ...prev, data: iso, hora: '' }));
    if (errors.data) setErrors((prev) => ({ ...prev, data: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!vets.find((v) => v.nome === form.veterinarioNome)) newErrors.veterinarioNome = 'Selecione um veterinário';
    if (!form.data) newErrors.data = 'Selecione uma data';
    if (!form.hora) newErrors.hora = 'Selecione um horário';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildPayload = () => {
    const vet = vets.find((v) => v.nome === form.veterinarioNome);
    return {
      dataHora: `${form.data}T${form.hora}:00`,
      tipoConsulta: tipoConsultaToEnum(form.tipoConsulta),
      statusConsulta: isEditing ? consulta.statusConsulta : 'AGENDADA',
      observacoes: form.observacoes.trim() || null,
      diagnostico: consulta?.diagnostico || null,
      tratamento: consulta?.tratamento || null,
      petId,
      veterinarioId: vet.id,
    };
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      if (isEditing) {
        await updateConsulta.mutateAsync({ id: consulta.id, consulta: buildPayload() });
      } else {
        await createConsulta.mutateAsync(buildPayload());
      }
      navigation.goBack();
    } catch (error) {
      if (error?.response?.status === 409) {
        showAlert('Horário indisponível', 'Este veterinário já tem uma consulta marcada nesse horário. Escolha outro.');
      } else {
        showAlert('Erro', 'Não foi possível salvar a consulta. Verifique os dados e tente novamente.');
      }
    }
  };

  const handleDelete = () => {
    showAlert(
      'Excluir consulta',
      'Tem certeza que deseja excluir este registro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteConsulta.mutateAsync({ id: consulta.id, petId });
              navigation.goBack();
            } catch (error) {
              showAlert('Erro', 'Não foi possível excluir a consulta.');
            }
          },
        },
      ]
    );
  };

  const saving = createConsulta.isPending || updateConsulta.isPending;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Card>
            <SelectOption
              label="Tipo *"
              options={TIPO_OPTIONS}
              value={form.tipoConsulta}
              onChange={(v) => setField('tipoConsulta', v)}
            />

            {loadingVets ? (
              <ActivityIndicator color={COLORS.primary} style={{ marginVertical: SPACING.sm }} />
            ) : vetOptions.length === 0 ? (
              <Text style={styles.noVetsText}>
                Nenhum veterinário cadastrado no sistema. Cadastre um veterinário antes de registrar a consulta.
              </Text>
            ) : (
              <SelectOption
                label="Veterinário *"
                options={vetOptions}
                value={form.veterinarioNome}
                onChange={handleSelectVet}
              />
            )}
            {errors.veterinarioNome && <Text style={styles.errorText}>{errors.veterinarioNome}</Text>}

            {selectedVet && (
              <>
                <Text style={styles.sectionLabel}>Data *</Text>
                <DateStrip days={days} selected={form.data} onSelect={handleSelectDay} />
                {errors.data && <Text style={styles.errorText}>{errors.data}</Text>}

                {form.data && (
                  <>
                    <Text style={styles.sectionLabel}>Horário *</Text>
                    <SlotGrid
                      dateIso={form.data}
                      selected={form.hora}
                      bookedTimes={bookedTimes}
                      onSelect={(time) => setField('hora', time)}
                    />
                    {errors.hora && <Text style={styles.errorText}>{errors.hora}</Text>}
                  </>
                )}
              </>
            )}

            <Input
              label="Observações"
              value={form.observacoes}
              onChangeText={(v) => setField('observacoes', v)}
              placeholder="Alguma informação adicional..."
              multiline
              numberOfLines={3}
              style={{ marginTop: SPACING.sm }}
            />
          </Card>

          <View style={styles.actions}>
            <Button
              title={saving ? 'Salvando...' : isEditing ? 'Atualizar consulta' : 'Registrar consulta'}
              onPress={handleSave}
              variant="primary"
              size="full"
              loading={saving}
              icon="🩺"
            />
            {isEditing && (
              <Button
                title="Excluir consulta"
                onPress={handleDelete}
                variant="dangerOutline"
                size="full"
                loading={deleteConsulta.isPending}
                style={{ marginTop: SPACING.sm }}
                icon="🗑️"
              />
            )}
          </View>
          <View style={{ height: SPACING['2xl'] }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: SPACING.base },
  actions: { marginTop: SPACING.md },
  noVetsText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.danger,
    marginBottom: SPACING.base,
  },
  errorText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.danger,
    marginTop: -SPACING.xs,
    marginBottom: SPACING.sm,
  },
  sectionLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    marginTop: SPACING.xs,
    letterSpacing: 0.2,
  },

  // Slot grid
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.base,
  },
  slotChip: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  slotChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryPastel,
  },
  slotChipDisabled: {
    backgroundColor: COLORS.surfaceAlt,
    borderColor: COLORS.surfaceAlt,
  },
  slotText: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, fontWeight: FONT_WEIGHTS.medium },
  slotTextActive: { color: COLORS.primary, fontWeight: FONT_WEIGHTS.bold },
  slotTextDisabled: { color: COLORS.textMuted, textDecorationLine: 'line-through' },
  noSlotsText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginBottom: SPACING.base,
    fontStyle: 'italic',
  },
});
