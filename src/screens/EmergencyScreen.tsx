import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { EMERGENCY_SIGNS } from '../constants/appContent';
import { showAlert } from '../utils/alert';
import Card from '../components/Card';
import SectionHeader from '../components/SectionHeader';

const SEVERITY_CONFIG = {
  critical: { color: COLORS.danger, bg: COLORS.dangerLight, label: 'CRÍTICO', icon: '🚨' },
  high: { color: '#D97706', bg: COLORS.warningLight, label: 'ALTO', icon: '⚠️' },
  medium: { color: COLORS.info, bg: COLORS.infoLight, label: 'MÉDIO', icon: 'ℹ️' },
};

function SignCard({ sign }) {
  const cfg = SEVERITY_CONFIG[sign.severity];
  return (
    <Card style={[styles.signCard, { borderLeftColor: cfg.color, borderLeftWidth: 4 }]}>
      <View style={styles.signRow}>
        <Text style={styles.signIcon}>{cfg.icon}</Text>
        <View style={styles.signContent}>
          <View style={styles.signHeader}>
            <Text style={styles.signText}>{sign.sign}</Text>
            <View style={[styles.severityBadge, { backgroundColor: cfg.bg }]}>
              <Text style={[styles.severityText, { color: cfg.color }]}>{cfg.label}</Text>
            </View>
          </View>
          <Text style={[styles.signAction, { color: cfg.color }]}>{sign.action}</Text>
        </View>
      </View>
    </Card>
  );
}

export default function EmergencyScreen() {
  const [activeTab, setActiveTab] = useState('signs');

  const criticals = EMERGENCY_SIGNS.filter(s => s.severity === 'critical');
  const highs = EMERGENCY_SIGNS.filter(s => s.severity === 'high');
  const mediums = EMERGENCY_SIGNS.filter(s => s.severity === 'medium');

  const callClinic = () => {
    showAlert(
      '📞 Ligar para a Clínica',
      'Deseja ligar para a CLYVO VET agora?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Ligar',
          onPress: () => Linking.openURL('tel:+551140028922'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {/* Emergency Banner */}
      <View style={styles.emergencyBanner}>
        <View>
          <Text style={styles.emergencyTitle}>🚨 Central de Emergência</Text>
          <Text style={styles.emergencySubtitle}>CLYVO VET • Atendimento 24h</Text>
        </View>
        <TouchableOpacity style={styles.callBtn} onPress={callClinic} activeOpacity={0.8}>
          <Text style={styles.callIcon}>📞</Text>
          <Text style={styles.callText}>Ligar</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'signs' && styles.activeTab]}
          onPress={() => setActiveTab('signs')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'signs' && styles.activeTabText]}>
            Sinais de Alerta
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'protocol' && styles.activeTab]}
          onPress={() => setActiveTab('protocol')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'protocol' && styles.activeTabText]}>
            Protocolo
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'signs' ? (
          <>
            <View style={styles.section}>
              <SectionHeader
                title="🚨 Crítico — Emergência imediata"
                subtitle="Vá ao pronto-socorro agora"
              />
              {criticals.map(s => <SignCard key={s.id} sign={s} />)}
            </View>
            <View style={styles.section}>
              <SectionHeader
                title="⚠️ Alto — Urgente"
                subtitle="Contate a clínica em 2 horas"
              />
              {highs.map(s => <SignCard key={s.id} sign={s} />)}
            </View>
            <View style={styles.section}>
              <SectionHeader
                title="ℹ️ Médio — Atenção"
                subtitle="Agende consulta hoje"
              />
              {mediums.map(s => <SignCard key={s.id} sign={s} />)}
            </View>
          </>
        ) : (
          <View>
            <SectionHeader title="Protocolo de Emergência" subtitle="O que fazer em situações críticas" />

            {[
              {
                step: '1',
                title: 'Mantenha a calma',
                desc: 'Respire fundo. Seu pet percebe sua ansiedade. Uma postura calma ajuda a avaliação.',
                icon: '🧘',
              },
              {
                step: '2',
                title: 'Avalie a situação',
                desc: 'Observe: o pet está respirando? Consciente? Sangramento? Vômito? Convulsão?',
                icon: '👁️',
              },
              {
                step: '3',
                title: 'Não mova sem necessidade',
                desc: 'Em caso de trauma ou convulsão, evite movimentação. Proteja a coluna.',
                icon: '🛑',
              },
              {
                step: '4',
                title: 'Ligue para a clínica',
                desc: 'Descreva os sintomas com clareza: quando começou, o que mudou, o que o pet ingeriu.',
                icon: '📞',
              },
              {
                step: '5',
                title: 'Transporte com segurança',
                desc: 'Use uma caixa de transporte ou toalha. Evite pressão sobre ferimentos.',
                icon: '🚗',
              },
              {
                step: '6',
                title: 'Leve documentos',
                desc: 'Carteirinha de vacina, histórico médico, medicamentos em uso.',
                icon: '📋',
              },
            ].map((item) => (
              <Card key={item.step} style={styles.protocolCard}>
                <View style={styles.protocolRow}>
                  <View style={styles.protocolStep}>
                    <Text style={styles.protocolStepNum}>{item.step}</Text>
                  </View>
                  <Text style={styles.protocolIcon}>{item.icon}</Text>
                  <View style={styles.protocolContent}>
                    <Text style={styles.protocolTitle}>{item.title}</Text>
                    <Text style={styles.protocolDesc}>{item.desc}</Text>
                  </View>
                </View>
              </Card>
            ))}

            <Card style={styles.toxicCard} variant="flat">
              <Text style={styles.toxicTitle}>☠️ Produtos Tóxicos Comuns</Text>
              {[
                'Chocolate, xilitol, uva, cebola, alho',
                'Medicamentos humanos (ibuprofeno, paracetamol)',
                'Plantas: lírio, azaleia, flor de maio',
                'Produtos de limpeza, pesticidas',
                'Caroço de abacate',
              ].map((item, i) => (
                <View key={i} style={styles.toxicItem}>
                  <Text style={styles.toxicDot}>•</Text>
                  <Text style={styles.toxicText}>{item}</Text>
                </View>
              ))}
            </Card>
          </View>
        )}
        <View style={{ height: SPACING['2xl'] }} />
      </ScrollView>

      {/* Fixed CTA */}
      <View style={styles.fixedCta}>
        <TouchableOpacity style={styles.ctaBtn} onPress={callClinic} activeOpacity={0.8}>
          <Text style={styles.ctaBtnText}>📞 Ligar Agora para a Clínica</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },

  emergencyBanner: {
    backgroundColor: COLORS.danger,
    padding: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emergencyTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.white,
  },
  emergencySubtitle: {
    fontSize: FONT_SIZES.xs,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  callIcon: { fontSize: 16 },
  callText: { color: COLORS.white, fontWeight: FONT_WEIGHTS.bold, fontSize: FONT_SIZES.sm },

  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: FONT_SIZES.sm, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.textMuted },
  activeTabText: { color: COLORS.primary },

  scroll: { flex: 1 },
  content: { padding: SPACING.base },
  section: { marginBottom: SPACING.lg },

  signCard: { marginBottom: SPACING.sm },
  signRow: { flexDirection: 'row', gap: SPACING.sm, alignItems: 'flex-start' },
  signIcon: { fontSize: 20, marginTop: 2 },
  signContent: { flex: 1 },
  signHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
    gap: SPACING.sm,
  },
  signText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  severityText: { fontSize: 9, fontWeight: FONT_WEIGHTS.extrabold, letterSpacing: 0.5 },
  signAction: { fontSize: FONT_SIZES.xs, fontWeight: FONT_WEIGHTS.medium },

  protocolCard: { marginBottom: SPACING.sm },
  protocolRow: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm },
  protocolStep: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  protocolStepNum: { color: COLORS.white, fontWeight: FONT_WEIGHTS.bold, fontSize: FONT_SIZES.sm },
  protocolIcon: { fontSize: 22, marginTop: 2 },
  protocolContent: { flex: 1 },
  protocolTitle: { fontSize: FONT_SIZES.base, fontWeight: FONT_WEIGHTS.bold, color: COLORS.textPrimary, marginBottom: 2 },
  protocolDesc: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, lineHeight: 20 },

  toxicCard: { marginTop: SPACING.md, borderColor: COLORS.danger },
  toxicTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.danger,
    marginBottom: SPACING.sm,
  },
  toxicItem: { flexDirection: 'row', gap: SPACING.xs, marginBottom: 4 },
  toxicDot: { color: COLORS.danger, fontWeight: FONT_WEIGHTS.bold },
  toxicText: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, flex: 1 },

  fixedCta: {
    padding: SPACING.base,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.lg,
  },
  ctaBtn: {
    backgroundColor: COLORS.danger,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.base,
    alignItems: 'center',
    ...SHADOWS.danger,
  },
  ctaBtnText: { color: COLORS.white, fontWeight: FONT_WEIGHTS.bold, fontSize: FONT_SIZES.base },
});
