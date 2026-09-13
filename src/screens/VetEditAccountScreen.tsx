import React, { useState, useEffect } from 'react';
import {
  View, ScrollView, StyleSheet,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../constants/theme';
import { useVeterinario, useUpdateVeterinario } from '../hooks/useVeterinarios';
import { showAlert } from '../utils/alert';
import Input from '../components/Input';
import Button from '../components/Button';
import SectionHeader from '../components/SectionHeader';
import Card from '../components/Card';

const INITIAL_FORM = { nome: '', telefone: '' };

export default function VetEditAccountScreen({ navigation }) {
  const { veterinario, veterinarioId } = useVeterinario();
  const updateVeterinario = useUpdateVeterinario();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (veterinario) {
      setForm({ nome: veterinario.nome || '', telefone: veterinario.telefone || '' });
    }
  }, [veterinario]);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!form.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      await updateVeterinario.mutateAsync({
        id: veterinarioId,
        veterinario: { ...veterinario, nome: form.nome.trim(), telefone: form.telefone.trim() },
      });
      showAlert('✅ Dados atualizados', 'Suas informações foram salvas com sucesso.', [
        { text: 'Ok', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      showAlert('Erro', 'Não foi possível atualizar seus dados. Tente novamente.');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.section}>
            <SectionHeader title="Meus dados" />
            <Card>
              <Input
                label="Nome *"
                value={form.nome}
                onChangeText={(v) => setField('nome', v)}
                placeholder="Seu nome completo"
                error={errors.nome}
              />
              <Input
                label="Telefone *"
                value={form.telefone}
                onChangeText={(v) => setField('telefone', v)}
                placeholder="(11) 99999-9999"
                keyboardType="phone-pad"
                error={errors.telefone}
              />
              <Input
                label="E-mail"
                value={veterinario?.email || ''}
                editable={false}
                helper="O e-mail não pode ser alterado."
              />
            </Card>
          </View>

          <View style={styles.actions}>
            <Button
              title={updateVeterinario.isPending ? 'Salvando...' : 'Salvar alterações'}
              onPress={handleSave}
              variant="primary"
              size="full"
              loading={updateVeterinario.isPending}
              icon="💾"
            />
          </View>
          <View style={{ height: SPACING['2xl'] }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  content: { padding: SPACING.base },

  section: { marginBottom: SPACING.md },

  actions: { gap: SPACING.xs },
});
