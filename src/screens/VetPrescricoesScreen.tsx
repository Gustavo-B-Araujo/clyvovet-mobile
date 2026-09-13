import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQueries } from '@tanstack/react-query';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useConsultasByVeterinario } from '../hooks/useConsultas';
import { listMedicamentosByPet } from '../api/medicamentos';
import { formatDate } from '../services/healthScore';
import Card from '../components/Card';
import SectionHeader from '../components/SectionHeader';
import EmptyState from '../components/EmptyState';

export default function VetPrescricoesScreen() {
  const { user } = useAuth();
  const veterinarioId = user?.veterinarioId;
  const { data: consultas, isLoading: loadingConsultas } = useConsultasByVeterinario(veterinarioId);

  const consultaIds = useMemo(() => new Set((consultas || []).map((c) => String(c.id))), [consultas]);
  const petIds = useMemo(
    () => Array.from(new Set((consultas || []).map((c) => c.petId).filter(Boolean))),
    [consultas]
  );

  const medicamentosQueries = useQueries({
    queries: petIds.map((petId) => ({
      queryKey: ['medicamentos', petId],
      queryFn: () => listMedicamentosByPet(petId),
      enabled: !!petId,
    })),
  });

  const loadingReceitas = medicamentosQueries.some((q) => q.isLoading);

  const receitas = useMemo(() => {
    const consultaById = new Map((consultas || []).map((c) => [String(c.id), c]));
    const todas = [];
    medicamentosQueries.forEach((q) => {
      (q.data || []).forEach((med) => {
        if (!med.consultaId || !consultaIds.has(String(med.consultaId))) return;
        const consulta = consultaById.get(String(med.consultaId));
        todas.push({ ...med, petNome: consulta?.petNome, consultaTitle: consulta?.title });
      });
    });
    return todas.sort((a, b) => (b.dataInicio || '').localeCompare(a.dataInicio || ''));
  }, [medicamentosQueries, consultas, consultaIds]);

  const isLoading = loadingConsultas || loadingReceitas;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileBanner}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarEmoji}>👨‍⚕️</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.nome || 'Veterinário(a)'}</Text>
            <Text style={styles.profileMeta}>{user?.email}</Text>
          </View>
        </View>

        <SectionHeader title="Receitas emitidas" />

        {!veterinarioId ? (
          <Card variant="flat">
            <Text style={styles.warningText}>
              Não foi possível identificar seu cadastro de veterinário para carregar as receitas automaticamente.
            </Text>
          </Card>
        ) : isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: SPACING.lg }} />
        ) : receitas.length === 0 ? (
          <EmptyState
            icon="💊"
            title="Nenhuma receita emitida"
            description="As receitas que você registrar nas consultas aparecerão aqui."
          />
        ) : (
          receitas.map((receita) => (
            <Card key={receita.id} style={styles.receitaCard}>
              <View style={styles.receitaRow}>
                <View style={styles.receitaInfo}>
                  <Text style={styles.receitaPet}>{receita.petNome || 'Pet não identificado'}</Text>
                  <Text style={styles.receitaNome}>{receita.title}</Text>
                  {receita.dosagem ? (
                    <Text style={styles.receitaDosagem}>{receita.dosagem}</Text>
                  ) : null}
                </View>
                <Text style={styles.receitaData}>{formatDate(receita.dataInicio)}</Text>
              </View>
              <Text style={styles.receitaConsulta}>{receita.consultaTitle}</Text>
              {receita.observacoes ? (
                <Text style={styles.receitaDesc} numberOfLines={2}>{receita.observacoes}</Text>
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

  receitaCard: { marginBottom: SPACING.sm },
  receitaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  receitaInfo: { flex: 1 },
  receitaPet: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  receitaNome: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  receitaDosagem: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
  receitaData: { fontSize: FONT_SIZES.xs, color: COLORS.textMuted },
  receitaConsulta: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
    fontStyle: 'italic',
  },
  receitaDesc: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    lineHeight: 18,
  },
});
