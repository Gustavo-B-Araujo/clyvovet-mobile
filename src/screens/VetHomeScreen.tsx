import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useConsultasByVeterinario } from '../hooks/useConsultas';
import { STATUS_CONSULTA_LABELS } from '../api/consultas';
import { formatDate } from '../services/healthScore';
import Card from '../components/Card';
import SectionHeader from '../components/SectionHeader';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';

export default function VetHomeScreen() {
  const { user } = useAuth();
  const veterinarioId = user?.veterinarioId;
  const { data: consultas, isLoading } = useConsultasByVeterinario(veterinarioId);

  const hoje = new Date().toISOString().slice(0, 10);
  const consultasHoje = (consultas || []).filter(c => c.date === hoje);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá, {user?.nome?.split(' ')[0] || 'Doutor(a)'} 👋</Text>
          <Text style={styles.subGreeting}>Aqui está sua agenda de hoje</Text>
        </View>

        <View style={styles.profileBanner}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarEmoji}>👨‍⚕️</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.nome || 'Veterinário(a)'}</Text>
            <Text style={styles.profileMeta}>{user?.email}</Text>
          </View>
        </View>

        <SectionHeader title="Consultas de hoje" />

        {!veterinarioId ? (
          <Card variant="flat">
            <Text style={styles.warningText}>
              Não foi possível identificar seu cadastro de veterinário para carregar a agenda automaticamente.
            </Text>
          </Card>
        ) : isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: SPACING.lg }} />
        ) : consultasHoje.length === 0 ? (
          <EmptyState
            icon="🗓️"
            title="Nenhuma consulta hoje"
            description="Quando um tutor agendar uma consulta com você, ela aparecerá aqui."
          />
        ) : (
          consultasHoje.map(consulta => (
            <Card key={consulta.id} style={styles.consultaCard}>
              <View style={styles.consultaRow}>
                <View style={styles.consultaInfo}>
                  <Text style={styles.consultaTitle}>{consulta.title}</Text>
                  <Text style={styles.consultaDate}>{formatDate(consulta.date)}</Text>
                </View>
                <Badge status="active" label={STATUS_CONSULTA_LABELS[consulta.statusConsulta] || consulta.statusConsulta} />
              </View>
              {consulta.observacoes ? (
                <Text style={styles.consultaDesc} numberOfLines={2}>{consulta.observacoes}</Text>
              ) : null}
            </Card>
          ))
        )}

        <View style={{ height: SPACING['2xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  content: { padding: SPACING.base },

  header: { marginBottom: SPACING.lg },
  greeting: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.textPrimary,
  },
  subGreeting: { fontSize: FONT_SIZES.sm, color: COLORS.textMuted, marginTop: 2 },

  profileBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.base,
    marginBottom: SPACING.lg,
    gap: SPACING.md,
    ...SHADOWS.md,
  },
  profileAvatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  profileAvatarEmoji: { fontSize: 26 },
  profileInfo: { flex: 1 },
  profileName: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.white,
  },
  profileMeta: { fontSize: FONT_SIZES.xs, color: 'rgba(255,255,255,0.7)', marginTop: 2 },

  warningText: { fontSize: FONT_SIZES.sm, color: COLORS.textMuted, lineHeight: 20 },

  consultaCard: { marginBottom: SPACING.sm },
  consultaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  consultaInfo: { flex: 1 },
  consultaTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
  },
  consultaDate: { fontSize: FONT_SIZES.xs, color: COLORS.textMuted, marginTop: 2 },
  consultaDesc: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    lineHeight: 18,
  },
});
