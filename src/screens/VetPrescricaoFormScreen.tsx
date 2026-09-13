import React, { useState } from 'react';
import {
  View, ScrollView, StyleSheet, Text,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING } from '../constants/theme';
import { showAlert } from '../utils/alert';
import { useCreateMedicamento } from '../hooks/useMedicamentos';
import { addDays, todayIsoDate } from '../constants/schedule';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import SelectOption from '../components/SelectOption';

const FREQUENCIES = ['Diário', 'Semanal', 'Mensal', 'Trimestral', 'Anual'];

export default function VetPrescricaoFormScreen({ navigation, route }) {
  const { consulta } = route.params;
  const createMedicamento = useCreateMedicamento();

  const [form, setForm] = useState({
    nome: '',
    dosagem: '',
    frequencia: FREQUENCIES[2],
    duracaoDias: '',
    observacoes: '',
  });
  const [errors, setErrors] = useState({});

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.nome.trim()) newErrors.nome = 'Informe o nome do medicamento';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    const dataInicio = consulta.date || todayIsoDate();
    const dias = parseInt(form.duracaoDias, 10);
    try {
      await createMedicamento.mutateAsync({
        nome: form.nome.trim(),
        dosagem: form.dosagem.trim() || null,
        frequencia: form.frequencia || null,
        dataInicio,
        dataFim: dias > 0 ? addDays(dataInicio, dias) : null,
        observacoes: form.observacoes.trim() || null,
        statusMedicamento: 'ATIVO',
        petId: consulta.petId,
        consultaId: consulta.id,
      });
      navigation.goBack();
    } catch (error) {
      showAlert('Erro', 'Não foi possível registrar a receita. Verifique os dados e tente novamente.');
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
          <View style={styles.header}>
            <Text style={styles.petName}>{consulta.petNome || 'Pet não identificado'}</Text>
            <Text style={styles.subtitle}>{consulta.title} · {consulta.date}</Text>
          </View>

          <Card>
            <Input
              label="Medicamento *"
              value={form.nome}
              onChangeText={(v) => setField('nome', v)}
              placeholder="Ex: Amoxicilina"
              error={errors.nome}
            />

            <Input
              label="Dosagem"
              value={form.dosagem}
              onChangeText={(v) => setField('dosagem', v)}
              placeholder="Ex: 250mg a cada 12h"
            />

            <SelectOption
              label="Frequência"
              options={FREQUENCIES}
              value={form.frequencia}
              onChange={(v) => setField('frequencia', v)}
            />

            <Input
              label="Duração (dias)"
              value={form.duracaoDias}
              onChangeText={(v) => setField('duracaoDias', v.replace(/[^0-9]/g, ''))}
              placeholder="Deixe em branco para uso contínuo"
              keyboardType="numeric"
              style={{ marginTop: SPACING.sm }}
            />

            <Input
              label="Observações"
              value={form.observacoes}
              onChangeText={(v) => setField('observacoes', v)}
              placeholder="Alguma instrução adicional..."
              multiline
              numberOfLines={3}
              style={{ marginTop: SPACING.sm }}
            />
          </Card>

          <Button
            title={createMedicamento.isPending ? 'Salvando...' : 'Registrar receita'}
            onPress={handleSave}
            variant="primary"
            size="full"
            loading={createMedicamento.isPending}
            icon="💊"
            style={styles.saveButton}
          />
          <View style={{ height: SPACING['2xl'] }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: SPACING.base },

  header: { marginBottom: SPACING.lg },
  petName: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  subtitle: { fontSize: FONT_SIZES.sm, color: COLORS.textMuted },

  saveButton: { marginTop: SPACING.md },
});
