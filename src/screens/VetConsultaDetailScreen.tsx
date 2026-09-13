import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING } from '../constants/theme';
import { STATUS_CONSULTA_LABELS } from '../api/consultas';
import { formatDate } from '../services/healthScore';
import { showAlert } from '../utils/alert';
import { useUpdateConsulta } from '../hooks/useConsultas';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';

const STATUS_BADGE = {
  AGENDADA: 'active',
  CONFIRMADA: 'active',
  EM_ANDAMENTO: 'active',
  CONCLUIDA: 'done',
  CANCELADA: 'inactive',
};

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export default function VetConsultaDetailScreen({ route }) {
  const [consulta, setConsulta] = useState(route.params.consulta);
  const updateConsulta = useUpdateConsulta();
  const hora = consulta.dataHora ? consulta.dataHora.slice(11, 16) : '';
  const podeMarcarAtendida = consulta.statusConsulta !== 'CONCLUIDA' && consulta.statusConsulta !== 'CANCELADA';

  const handleMarcarAtendida = async () => {
    try {
      const atualizada = await updateConsulta.mutateAsync({
        id: consulta.id,
        consulta: {
          dataHora: consulta.dataHora,
          tipoConsulta: consulta.tipoConsulta,
          statusConsulta: 'CONCLUIDA',
          observacoes: consulta.observacoes || null,
          diagnostico: consulta.diagnostico || null,
          tratamento: consulta.tratamento || null,
          petId: consulta.petId,
          veterinarioId: consulta.veterinarioId,
        },
      });
      setConsulta(atualizada);
    } catch (error) {
      showAlert('Erro', 'Não foi possível marcar a consulta como atendida.');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.petName}>{consulta.petNome || 'Pet não identificado'}</Text>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{consulta.title}</Text>
            <Badge
              status={STATUS_BADGE[consulta.statusConsulta] || 'active'}
              label={STATUS_CONSULTA_LABELS[consulta.statusConsulta] || consulta.statusConsulta}
            />
          </View>
        </View>

        <Card>
          <InfoRow label="Data" value={formatDate(consulta.date)} />
          <InfoRow label="Horário" value={hora} />
          <InfoRow label="Veterinário" value={consulta.vet} />
          <InfoRow label="Observações" value={consulta.observacoes} />
          <InfoRow label="Diagnóstico" value={consulta.diagnostico} />
          <InfoRow label="Tratamento" value={consulta.tratamento} />
        </Card>

        {podeMarcarAtendida && (
          <Button
            title="Marcar como atendida"
            onPress={handleMarcarAtendida}
            variant="primary"
            size="full"
            loading={updateConsulta.isPending}
            icon="✅"
            style={styles.actionButton}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.base },

  header: { marginBottom: SPACING.lg },
  petName: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.textPrimary,
  },

  infoRow: {
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  infoLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },

  actionButton: { marginTop: SPACING.lg },
});
