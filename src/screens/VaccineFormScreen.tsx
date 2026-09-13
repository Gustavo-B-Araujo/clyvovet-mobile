import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Switch,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING } from '../constants/theme';
import { useCreateVacina, useUpdateVacina, useDeleteVacina } from '../hooks/useVacinas';
import { showAlert } from '../utils/alert';
import { addDays, generateDayRange, todayIsoDate } from '../constants/schedule';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import DateStrip from '../components/DateStrip';

export default function VaccineFormScreen({ navigation, route }) {
  const { petId, vaccine } = route.params;
  const isEditing = !!vaccine;

  const createVacina = useCreateVacina();
  const updateVacina = useUpdateVacina();
  const deleteVacina = useDeleteVacina();

  const [form, setForm] = useState({
    nome: vaccine?.name || '',
    dataAplicacao: vaccine?.date || todayIsoDate(),
    dataProximaDose: vaccine?.nextDate || '',
    fabricante: vaccine?.fabricante || '',
    lote: vaccine?.batch || '',
    observacoes: vaccine?.notes || '',
  });
  const [errors, setErrors] = useState({});

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const semReforco = !form.dataProximaDose;

  const aplicacaoDays = useMemo(() => generateDayRange(addDays(todayIsoDate(), -14), 60), []);
  const reforcoDays = useMemo(
    () => generateDayRange(form.dataAplicacao || todayIsoDate(), 180),
    [form.dataAplicacao]
  );

  const handleSelectAplicacao = (iso) => {
    setForm((prev) => ({
      ...prev,
      dataAplicacao: iso,
      dataProximaDose: prev.dataProximaDose && prev.dataProximaDose < iso ? iso : prev.dataProximaDose,
    }));
    if (errors.dataAplicacao) setErrors((prev) => ({ ...prev, dataAplicacao: '' }));
  };

  const handleToggleSemReforco = (isSemReforco) => {
    setField('dataProximaDose', isSemReforco ? '' : (form.dataAplicacao || todayIsoDate()));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!form.dataAplicacao) newErrors.dataAplicacao = 'Data de aplicação é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildPayload = () => ({
    nome: form.nome.trim(),
    dataAplicacao: form.dataAplicacao,
    dataProximaDose: form.dataProximaDose || null,
    fabricante: form.fabricante.trim() || null,
    lote: form.lote.trim() || null,
    observacoes: form.observacoes.trim() || null,
    petId,
  });

  const handleSave = async () => {
    if (!validate()) return;
    try {
      if (isEditing) {
        await updateVacina.mutateAsync({ id: vaccine.id, vacina: buildPayload() });
      } else {
        await createVacina.mutateAsync(buildPayload());
      }
      navigation.goBack();
    } catch (error) {
      showAlert('Erro', 'Não foi possível salvar a vacina. Verifique os dados e tente novamente.');
    }
  };

  const handleDelete = () => {
    showAlert(
      'Excluir vacina',
      'Tem certeza que deseja excluir este registro de vacina?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteVacina.mutateAsync({ id: vaccine.id, petId });
              navigation.goBack();
            } catch (error) {
              showAlert('Erro', 'Não foi possível excluir a vacina.');
            }
          },
        },
      ]
    );
  };

  const saving = createVacina.isPending || updateVacina.isPending;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Card>
            <Input
              label="Nome da vacina *"
              value={form.nome}
              onChangeText={(v) => setField('nome', v)}
              placeholder="Ex: V10, Antirrábica..."
              error={errors.nome}
            />
            <Text style={styles.fieldLabel}>Data de aplicação *</Text>
            <DateStrip days={aplicacaoDays} selected={form.dataAplicacao} onSelect={handleSelectAplicacao} />
            {errors.dataAplicacao ? <Text style={styles.errorText}>{errors.dataAplicacao}</Text> : null}

            <View style={styles.semReforcoRow}>
              <Text style={styles.semReforcoLabel}>Sem reforço previsto</Text>
              <Switch
                value={semReforco}
                onValueChange={handleToggleSemReforco}
                trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
                thumbColor={semReforco ? COLORS.primary : COLORS.textMuted}
              />
            </View>

            {!semReforco && (
              <>
                <Text style={styles.fieldLabel}>Próxima dose</Text>
                <DateStrip days={reforcoDays} selected={form.dataProximaDose} onSelect={(iso) => setField('dataProximaDose', iso)} />
              </>
            )}

            <Input
              label="Fabricante"
              value={form.fabricante}
              onChangeText={(v) => setField('fabricante', v)}
              placeholder="Ex: Zoetis, MSD..."
            />
            <Input
              label="Lote"
              value={form.lote}
              onChangeText={(v) => setField('lote', v)}
              placeholder="Número do lote"
            />
            <Input
              label="Observações"
              value={form.observacoes}
              onChangeText={(v) => setField('observacoes', v)}
              placeholder="Alguma informação adicional..."
              multiline
              numberOfLines={3}
            />
          </Card>

          <View style={styles.actions}>
            <Button
              title={saving ? 'Salvando...' : isEditing ? 'Atualizar vacina' : 'Registrar vacina'}
              onPress={handleSave}
              variant="primary"
              size="full"
              loading={saving}
              icon="💉"
            />
            {isEditing && (
              <Button
                title="Excluir vacina"
                onPress={handleDelete}
                variant="dangerOutline"
                size="full"
                loading={deleteVacina.isPending}
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
  semReforcoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.base,
    gap: SPACING.sm,
  },
  semReforcoLabel: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHTS.medium,
  },
});
