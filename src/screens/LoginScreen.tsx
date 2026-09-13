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
  if (status === 401) return 'E-mail ou senha incorretos.';
  if (status === 400) {
    return Object.values(error?.response?.data || {})[0] || 'Dados inválidos.';
  }
  return 'Não foi possível entrar. Verifique sua conexão e tente novamente.';
}

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Informe seu e-mail';
    if (!password) newErrors.password = 'Informe sua senha';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (error) {
      showAlert('Erro ao entrar', friendlyAuthError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.logo}>🐾 CLYVO</Text>
            <Text style={styles.tagline}>Saúde animal contínua e inteligente</Text>
          </View>

          <Text style={styles.title}>Entrar</Text>

          <Input
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="seuemail@exemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />
          <Input
            label="Senha"
            value={password}
            onChangeText={setPassword}
            placeholder="Sua senha"
            secureTextEntry
            autoCapitalize="none"
            error={errors.password}
          />

          <Button
            title={loading ? 'Entrando...' : 'Entrar'}
            onPress={handleLogin}
            variant="primary"
            size="full"
            loading={loading}
            style={{ marginTop: SPACING.sm }}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Ainda não tem conta?</Text>
            <Text style={styles.footerLink} onPress={() => navigation.navigate('Signup')}>
              Criar conta
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
  header: { alignItems: 'center', marginBottom: SPACING['3xl'] },
  logo: {
    fontSize: FONT_SIZES['3xl'],
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.primary,
    letterSpacing: 2,
  },
  tagline: { fontSize: FONT_SIZES.sm, color: COLORS.textMuted, marginTop: 4 },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.xl,
  },
  footerText: { fontSize: FONT_SIZES.sm, color: COLORS.textMuted },
  footerLink: { fontSize: FONT_SIZES.sm, color: COLORS.primary, fontWeight: FONT_WEIGHTS.bold },
});
