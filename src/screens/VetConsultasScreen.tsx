import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import EmptyState from '../components/EmptyState';

export default function VetConsultasScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <EmptyState
        icon="🩺"
        title="Cadastro de consultas em breve"
        description="O fluxo para o veterinário criar e gerenciar consultas ainda está em desenvolvimento."
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center' },
});
