import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { usePetProfile } from '../hooks/usePetProfile';
import { useVacinasByPet } from '../hooks/useVacinas';
import { generateAlerts } from '../services/healthScore';
import Card from '../components/Card';
import SectionHeader from '../components/SectionHeader';
import AlertBanner from '../components/AlertBanner';
import Badge from '../components/Badge';

const CHECKUP_ITEMS = [
  {
    id: 'weight',
    category: 'Nutrição & Peso',
    icon: '⚖️',
    items: [
      { label: 'Peso registrado e atualizado', field: 'weight' },
      { label: 'Dieta adequada à raça e idade', field: 'diet' },
      { label: 'Hidratação diária monitorada', field: 'hydration' },
    ],
  },
  {
    id: 'prevention',
    category: 'Prevenção',
    icon: '🛡️',
    items: [
      { label: 'Vacinas em dia', field: 'vaccines' },
      { label: 'Antiparasitário atualizado', field: 'antiparasitic' },
      { label: 'Vermífugo trimestral', field: 'deworming' },
    ],
  },
  {
    id: 'dental',
    category: 'Saúde Bucal',
    icon: '🦷',
    items: [
      { label: 'Limpeza dental anual', field: 'dental_clean' },
      { label: 'Escovação regular', field: 'brushing' },
    ],
  },
  {
    id: 'exams',
    category: 'Exames Anuais',
    icon: '🔬',
    items: [
      { label: 'Hemograma completo', field: 'blood_count' },
      { label: 'Bioquímica sérica', field: 'biochemistry' },
      { label: 'Urinálise', field: 'urinalysis' },
      { label: 'Ultrassom abdominal (>5 anos)', field: 'ultrasound' },
    ],
  },
  {
    id: 'wellness',
    category: 'Bem-estar',
    icon: '🧡',
    items: [
      { label: 'Exercício físico regular', field: 'exercise' },
      { label: 'Estimulação mental', field: 'mental' },
      { label: 'Socialização adequada', field: 'social' },
    ],
  },
];

export default function CheckupScreen({ navigation }) {
  const { pet } = usePetProfile();
  const { data: vaccines } = useVacinasByPet(pet?.id);
  const petVaccines = vaccines || [];

  const [checked, setChecked] = useState({});

  const toggleCheck = (field) => {
    setChecked(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const totalItems = CHECKUP_ITEMS.reduce((sum, cat) => sum + cat.items.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const completionPct = Math.round((checkedCount / totalItems) * 100);

  const alerts = generateAlerts(pet, petVaccines);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Completion progress */}
        <Card style={styles.progressCard}>
          <View style={styles.progressRow}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressTitle}>Checklist de Saúde</Text>
              <Text style={styles.progressSub}>{checkedCount} de {totalItems} itens verificados</Text>
            </View>
            <View style={styles.progressCircle}>
              <Text style={styles.progressPct}>{completionPct}%</Text>
            </View>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${completionPct}%` }]} />
          </View>
        </Card>

        {/* Alerts */}
        {alerts.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Itens que precisam de atenção" />
            {alerts.map(alert => (
              <AlertBanner
                key={alert.id}
                type={alert.type}
                title={alert.title}
                description={alert.description}
                action={alert.action}
                onAction={() => navigation.navigate(alert.route)}
              />
            ))}
          </View>
        )}

        {/* Checklist */}
        <SectionHeader title="Checklist Anual" subtitle="Marque os itens realizados" />
        {CHECKUP_ITEMS.map((category) => {
          const catChecked = category.items.filter(i => checked[i.field]).length;
          return (
            <Card key={category.id} style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryTitle}>{category.category}</Text>
                  <Text style={styles.categoryProgress}>
                    {catChecked}/{category.items.length} completos
                  </Text>
                </View>
                {catChecked === category.items.length && (
                  <Text style={styles.allDoneIcon}>✅</Text>
                )}
              </View>
              <View style={styles.categoryItems}>
                {category.items.map((item) => (
                  <TouchableOpacity
                    key={item.field}
                    style={styles.checkItem}
                    onPress={() => toggleCheck(item.field)}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.checkbox,
                      checked[item.field] && styles.checkboxChecked,
                    ]}>
                      {checked[item.field] && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text style={[
                      styles.checkLabel,
                      checked[item.field] && styles.checkLabelDone,
                    ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>
          );
        })}

        {/* Frequency guide */}
        <Card style={styles.guideCard} variant="flat">
          <Text style={styles.guideTitle}>📅 Frequências Recomendadas</Text>
          {[
            { freq: 'Diário', items: 'Alimentação, água, exercício, interação' },
            { freq: 'Mensal', items: 'Antiparasitário, pesagem, escovação dental' },
            { freq: 'Trimestral', items: 'Vermífugo, avaliação comportamental' },
            { freq: 'Anual', items: 'Vacinas, hemograma, urinálise, check-up clínico' },
          ].map((g, i) => (
            <View key={i} style={styles.guideRow}>
              <Badge status="active" label={g.freq} />
              <Text style={styles.guideText}>{g.items}</Text>
            </View>
          ))}
        </Card>

        <View style={{ height: SPACING['2xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  content: { padding: SPACING.base },

  progressCard: { marginBottom: SPACING.lg },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  progressInfo: {},
  progressTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
  },
  progressSub: { fontSize: FONT_SIZES.xs, color: COLORS.textMuted, marginTop: 2 },
  progressCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primaryPastel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPct: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.primary,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: COLORS.primaryPastel,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
  },

  section: { marginBottom: SPACING.lg },

  categoryCard: { marginBottom: SPACING.sm },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  categoryIcon: { fontSize: 22 },
  categoryInfo: { flex: 1 },
  categoryTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
  },
  categoryProgress: { fontSize: FONT_SIZES.xs, color: COLORS.textMuted, marginTop: 1 },
  allDoneIcon: { fontSize: 20 },
  categoryItems: { gap: SPACING.sm },

  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  checkboxChecked: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  checkmark: { color: COLORS.white, fontSize: 13, fontWeight: FONT_WEIGHTS.bold },
  checkLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    flex: 1,
  },
  checkLabelDone: {
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },

  guideCard: { marginTop: SPACING.sm },
  guideTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  guideRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  guideText: {
    flex: 1,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginTop: 2,
  },
});
