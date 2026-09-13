import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING } from '../constants/theme';
import { usePetProfile } from '../hooks/usePetProfile';
import { ESPECIE_OPTIONS, SEXO_OPTIONS } from '../api/pets';
import { showAlert } from '../utils/alert';
import Input from '../components/Input';
import DatePickerField from '../components/DatePickerField';
import Button from '../components/Button';
import SelectOption from '../components/SelectOption';
import SectionHeader from '../components/SectionHeader';
import Card from '../components/Card';

const AVATAR_BY_SPECIES = {
  Cachorro: '🐶', Gato: '🐱', Pássaro: '🐦', Roedor: '🐹', Réptil: '🦎', Peixe: '🐠', Outro: '🐾',
};

const INITIAL_FORM = {
  name: '', species: '', breed: '', birthDate: '', weight: '', sex: '', castrado: false,
};

export default function PetFormScreen({ navigation, route }) {
  const { pet, createPet, updatePet, removePet } = usePetProfile();
  const forceCreate = !!route?.params?.create;

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [isEditing] = useState(() => !forceCreate && !!pet?.name);

  useEffect(() => {
    if (isEditing && pet) {
      setForm({ ...INITIAL_FORM, ...pet });
    }
  }, [isEditing, pet]);

  const setField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!form.species) newErrors.species = 'Espécie é obrigatória';
    if (form.weight && isNaN(parseFloat(form.weight))) newErrors.weight = 'Informe um número válido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (isEditing) {
        await updatePet(form);
      } else {
        await createPet(form);
      }
      showAlert('✅ Salvo!', 'Perfil do pet atualizado com sucesso.', [
        { text: 'Ok', onPress: () => navigation.navigate('PetProfile') },
      ]);
    } catch (error) {
      showAlert('Erro', 'Não foi possível salvar o pet. Verifique os dados e tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    showAlert(
      '🗑️ Remover pet',
      'Tem certeza que deseja remover o perfil? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await removePet();
              navigation.navigate('Home');
            } catch (error) {
              showAlert('Erro', 'Não foi possível remover o pet.');
            }
          },
        },
      ]
    );
  };

  const previewAvatar = AVATAR_BY_SPECIES[form.species] || '🐾';

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
          <Card style={styles.previewCard} variant="primary">
            <View style={styles.previewContent}>
              <View style={styles.previewAvatar}>
                <Text style={styles.previewAvatarEmoji}>{previewAvatar}</Text>
              </View>
              <Text style={styles.previewName}>
                {form.name || 'Nome do Pet'}
              </Text>
              <Text style={styles.previewMeta}>
                {[form.species, form.breed, form.weight ? `${form.weight} kg` : '']
                  .filter(Boolean).join(' · ') || 'Preencha os campos abaixo'}
              </Text>
            </View>
          </Card>

          <View style={styles.section}>
            <SectionHeader title="Identificação" />
            <Card>
              <Input
                label="Nome do pet *"
                value={form.name}
                onChangeText={(v) => setField('name', v)}
                placeholder="Ex: Thor, Luna, Mel..."
                error={errors.name}
              />
              <SelectOption
                label="Espécie *"
                options={ESPECIE_OPTIONS}
                value={form.species}
                onChange={(v) => setField('species', v)}
              />
              {errors.species ? (
                <Text style={styles.fieldError}>{errors.species}</Text>
              ) : null}
              <Input
                label="Raça"
                value={form.breed}
                onChangeText={(v) => setField('breed', v)}
                placeholder="Ex: Golden Retriever, SRD..."
              />
              <DatePickerField
                label="Data de nascimento"
                value={form.birthDate}
                onChange={(v) => setField('birthDate', v)}
                maximumDate={new Date()}
              />
              <Input
                label="Peso (kg)"
                value={form.weight}
                onChangeText={(v) => setField('weight', v)}
                placeholder="Ex: 12.5"
                keyboardType="decimal-pad"
                error={errors.weight}
              />
              <SelectOption
                label="Sexo"
                options={SEXO_OPTIONS}
                value={form.sex}
                onChange={(v) => setField('sex', v)}
              />
              <SelectOption
                label="Castrado(a)?"
                options={['Sim', 'Não']}
                value={form.castrado ? 'Sim' : 'Não'}
                onChange={(v) => setField('castrado', v === 'Sim')}
              />
            </Card>
          </View>

          <View style={styles.actions}>
            <Button
              title={saving ? 'Salvando...' : isEditing ? 'Atualizar Perfil' : 'Cadastrar Pet'}
              onPress={handleSave}
              variant="primary"
              size="full"
              loading={saving}
              icon="💾"
            />
            {isEditing && (
              <Button
                title="Remover pet"
                onPress={handleDelete}
                variant="dangerOutline"
                size="full"
                style={{ marginTop: SPACING.sm }}
                icon="🗑️"
              />
            )}
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

  previewCard: { marginBottom: SPACING.lg },
  previewContent: { alignItems: 'center' },
  previewAvatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  previewAvatarEmoji: { fontSize: 28 },
  previewName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.white,
    marginBottom: 4,
  },
  previewMeta: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },

  section: { marginBottom: SPACING.md },

  fieldError: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.danger,
    marginTop: -SPACING.sm,
    marginBottom: SPACING.sm,
  },

  actions: { gap: SPACING.xs },
});
