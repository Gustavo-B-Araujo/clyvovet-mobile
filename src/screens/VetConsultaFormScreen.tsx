import React, { useState, useMemo } from 'react';
import {
  View, ScrollView, StyleSheet, Text,
  TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { showAlert } from '../utils/alert';
import { useAuth } from '../context/AuthContext';
import { useCreateConsulta, useConsultasByVeterinario } from '../hooks/useConsultas';
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

export default function VetConsultaFormScreen({ navigation }) {
  const { user } = useAuth();
  const veterinarioId = user?.veterinarioId;

  const createConsulta = useCreateConsulta();
  const { data: consultasDoVet } = useConsultasByVeterinario(veterinarioId);

  const pacientes = useMemo(() => {
    const vistos = new Map();
    (consultasDoVet || []).forEach((c) => {
      if (c.petId && !vistos.has(c.petId)) {
        vistos.set(c.petId, { petId: c.petId, petNome: c.petNome || 'Paciente sem nome' });
      }
    });
    return Array.from(vistos.values());
  }, [consultasDoVet]);
  const pacienteOptions = pacientes.map((p) => p.petNome);

  const [form, setForm] = useState({
    petNome: '',
    tipoConsulta: TIPO_OPTIONS[0],
    data: '',
    hora: '',
    observacoes: '',
  });
  const [errors, setErrors] = useState({});

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const selectedPaciente = pacientes.find((p) => p.petNome === form.petNome);
  const days = useMemo(() => generateUpcomingDays(14), []);

  const bookedTimes = useMemo(() => {
    if (!consultasDoVet || !form.data) return [];
    return consultasDoVet
      .filter((c) => c.date === form.data)
      .map((c) => c.dataHora.slice(11, 16));
  }, [consultasDoVet, form.data]);

  const handleSelectDay = (iso) => {
    if (iso === form.data) return;
    setForm((prev) => ({ ...prev, data: iso, hora: '' }));
    if (errors.data) setErrors((prev) => ({ ...prev, data: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!selectedPaciente) newErrors.petNome = 'Selecione um paciente';
    if (!form.data) newErrors.data = 'Selecione uma data';
    if (!form.hora) newErrors.hora = 'Selecione um horário';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      await createConsulta.mutateAsync({
        dataHora: `${form.data}T${form.hora}:00`,
        tipoConsulta: tipoConsultaToEnum(form.tipoConsulta),
        statusConsulta: 'AGENDADA',
        observacoes: form.observacoes.trim() || null,
        diagnostico: null,
        tratamento: null,
        petId: selectedPaciente.petId,
        veterinarioId,
      });
      navigation.goBack();
    } catch (error) {
      if (error?.response?.status === 409) {
        showAlert('Horário indisponível', 'Você já tem uma consulta marcada nesse horário. Escolha outro.');
      } else {
        showAlert('Erro', 'Não foi possível salvar a consulta. Verifique os dados e tente novamente.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Card>
            {pacienteOptions.length === 0 ? (
              <Text style={styles.noPacientesText}>
                Nenhum paciente encontrado ainda. Assim que você atender uma consulta, o pet aparecerá aqui para agendar um retorno.
              </Text>
            ) : (
              <SelectOption
                label="Paciente *"
                options={pacienteOptions}
                value={form.petNome}
                onChange={(v) => setField('petNome', v)}
              />
            )}
            {errors.petNome && <Text style={styles.errorText}>{errors.petNome}</Text>}

            <SelectOption
              label="Tipo *"
              options={TIPO_OPTIONS}
              value={form.tipoConsulta}
              onChange={(v) => setField('tipoConsulta', v)}
            />

            {selectedPaciente && (
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
              title={createConsulta.isPending ? 'Salvando...' : 'Registrar consulta'}
              onPress={handleSave}
              variant="primary"
              size="full"
              loading={createConsulta.isPending}
              icon="🩺"
            />
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
  noPacientesText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    lineHeight: 20,
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
