import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import EmptyState from '../components/EmptyState';

export default function VetPrescricoesScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <EmptyState
        icon="💊"
        title="Prescrição de receitas em breve"
        description="O fluxo para o veterinário prescrever medicamentos durante o atendimento ainda está em desenvolvimento."
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center' },
});
