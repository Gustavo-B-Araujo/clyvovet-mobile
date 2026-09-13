import React, { useState } from 'react';
import {
  View, ScrollView, StyleSheet,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../constants/theme';
import { changePassword } from '../api/usuarios';
import { showAlert } from '../utils/alert';
import Input from '../components/Input';
import Button from '../components/Button';
import SectionHeader from '../components/SectionHeader';
import Card from '../components/Card';

function friendlyChangePasswordError(error) {
  const status = error?.response?.status;
  if (status === 400) {
    return Object.values(error?.response?.data || {})[0] || 'Dados inválidos. Verifique os campos e tente novamente.';
  }
  return 'Não foi possível alterar sua senha. Tente novamente.';
}

const INITIAL_FORM = { senhaAtual: '', novaSenha: '', confirmarNovaSenha: '' };

export default function ChangePasswordScreen({ navigation }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.senhaAtual) newErrors.senhaAtual = 'Informe sua senha atual';
    if (!form.novaSenha || form.novaSenha.length < 6) newErrors.novaSenha = 'Mínimo de 6 caracteres';
    if (form.confirmarNovaSenha !== form.novaSenha) newErrors.confirmarNovaSenha = 'As senhas não coincidem';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await changePassword(form.senhaAtual, form.novaSenha, form.confirmarNovaSenha);
      showAlert('✅ Senha alterada', 'Sua senha foi atualizada com sucesso.', [
        { text: 'Ok', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      showAlert('Erro', friendlyChangePasswordError(error));
    } finally {
      setSaving(false);
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
            <SectionHeader title="Alterar senha" subtitle="Sua senha de login será atualizada" />
            <Card>
              <Input
                label="Senha atual *"
                value={form.senhaAtual}
                onChangeText={(v) => setField('senhaAtual', v)}
                placeholder="Digite sua senha atual"
                secureTextEntry
                autoCapitalize="none"
                error={errors.senhaAtual}
              />
              <Input
                label="Nova senha *"
                value={form.novaSenha}
                onChangeText={(v) => setField('novaSenha', v)}
                placeholder="Mínimo 6 caracteres"
                secureTextEntry
                autoCapitalize="none"
                error={errors.novaSenha}
              />
              <Input
                label="Confirmar nova senha *"
                value={form.confirmarNovaSenha}
                onChangeText={(v) => setField('confirmarNovaSenha', v)}
                placeholder="Repita a nova senha"
                secureTextEntry
                autoCapitalize="none"
                error={errors.confirmarNovaSenha}
              />
            </Card>
          </View>

          <View style={styles.actions}>
            <Button
              title={saving ? 'Salvando...' : 'Alterar senha'}
              onPress={handleSave}
              variant="primary"
              size="full"
              loading={saving}
              icon="🔒"
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
