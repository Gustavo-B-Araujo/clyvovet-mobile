import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { showAlert } from '../utils/alert';
import Input from '../components/Input';
import Button from '../components/Button';

function friendlyAuthError(error) {
  const status = error?.response?.status;
  if (status === 400) {
    return Object.values(error?.response?.data || {})[0] || 'Dados inválidos. Verifique os campos e tente novamente.';
  }
  return 'Não foi possível criar sua conta. Verifique os dados e tente novamente.';
}

const INITIAL_FORM = { nome: '', email: '', telefone: '', cpf: '', password: '', confirmPassword: '' };

export default function SignupScreen({ navigation }) {
  const { signup } = useAuth();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.nome.trim()) newErrors.nome = 'Informe seu nome';
    if (!form.email.trim()) newErrors.email = 'Informe seu e-mail';
    if (!form.telefone.trim()) newErrors.telefone = 'Informe seu telefone';
    if (!form.cpf.trim() || form.cpf.trim().length < 11) newErrors.cpf = 'CPF inválido';
    if (!form.password || form.password.length < 6) newErrors.password = 'Mínimo de 6 caracteres';
    if (form.confirmPassword !== form.password) newErrors.confirmPassword = 'As senhas não coincidem';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await signup({
        email: form.email.trim(),
        password: form.password,
        nome: form.nome.trim(),
        telefone: form.telefone.trim(),
        cpf: form.cpf.trim(),
      });
    } catch (error) {
      showAlert('Erro ao criar conta', friendlyAuthError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>Cadastre-se como tutor(a) para acompanhar a saúde do seu pet.</Text>

          <Input
            label="Nome completo"
            value={form.nome}
            onChangeText={(v) => setField('nome', v)}
            placeholder="Seu nome completo"
            error={errors.nome}
          />
          <Input
            label="E-mail"
            value={form.email}
            onChangeText={(v) => setField('email', v)}
            placeholder="seuemail@exemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />
          <Input
            label="Telefone"
            value={form.telefone}
            onChangeText={(v) => setField('telefone', v)}
            placeholder="(11) 99999-9999"
            keyboardType="phone-pad"
            error={errors.telefone}
          />
          <Input
            label="CPF"
            value={form.cpf}
            onChangeText={(v) => setField('cpf', v)}
            placeholder="Somente números"
            keyboardType="number-pad"
            error={errors.cpf}
          />
          <Input
            label="Senha"
            value={form.password}
            onChangeText={(v) => setField('password', v)}
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            autoCapitalize="none"
            error={errors.password}
          />
          <Input
            label="Confirmar senha"
            value={form.confirmPassword}
            onChangeText={(v) => setField('confirmPassword', v)}
            placeholder="Repita a senha"
            secureTextEntry
            autoCapitalize="none"
            error={errors.confirmPassword}
          />

          <Button
            title={loading ? 'Criando conta...' : 'Criar conta'}
            onPress={handleSignup}
            variant="primary"
            size="full"
            loading={loading}
            style={{ marginTop: SPACING.sm }}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem conta?</Text>
            <Text style={styles.footerLink} onPress={() => navigation.navigate('Login')}>
              Entrar
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, flexGrow: 1, justifyContent: 'center' },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  subtitle: { fontSize: FONT_SIZES.sm, color: COLORS.textMuted, marginBottom: SPACING.lg },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.xl,
  },
  footerText: { fontSize: FONT_SIZES.sm, color: COLORS.textMuted },
  footerLink: { fontSize: FONT_SIZES.sm, color: COLORS.primary, fontWeight: FONT_WEIGHTS.bold },
});
