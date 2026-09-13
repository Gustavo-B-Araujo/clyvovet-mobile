import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SPACING } from '../constants/theme';
import Button from './Button';

function parseIsoDate(iso) {
  if (!iso) return null;
  const parsed = new Date(`${iso}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDisplay(iso) {
  const date = parseIsoDate(iso);
  if (!date) return null;
  return date.toLocaleDateString('pt-BR');
}

export default function DatePickerField({
  label,
  value,
  onChange,
  placeholder = 'Selecionar data',
  helper,
  error,
  maximumDate,
  minimumDate,
}) {
  const [show, setShow] = useState(false);
  const [draft, setDraft] = useState(null);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={[styles.wrapper, error && styles.errorBorder]}>
          <input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            max={maximumDate ? toIsoDate(maximumDate) : undefined}
            min={minimumDate ? toIsoDate(minimumDate) : undefined}
            style={webInputStyle}
          />
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
        {helper && !error && <Text style={styles.helperText}>{helper}</Text>}
      </View>
    );
  }

  const openPicker = () => {
    setDraft(parseIsoDate(value) || new Date());
    setShow(true);
  };

  const handleChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShow(false);
      if (event.type === 'set' && selectedDate) {
        onChange(toIsoDate(selectedDate));
      }
      return;
    }
    if (selectedDate) setDraft(selectedDate);
  };

  const confirmIos = () => {
    if (draft) onChange(toIsoDate(draft));
    setShow(false);
  };

  const display = formatDisplay(value);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[styles.wrapper, error && styles.errorBorder]}
        onPress={openPicker}
        activeOpacity={0.7}
      >
        <Text style={display ? styles.value : styles.placeholder}>
          {display || placeholder}
        </Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {helper && !error && <Text style={styles.helperText}>{helper}</Text>}

      {show && Platform.OS === 'android' && (
        <DateTimePicker
          value={draft || new Date()}
          mode="date"
          display="default"
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          onChange={handleChange}
        />
      )}

      {Platform.OS === 'ios' && (
        <Modal visible={show} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <DateTimePicker
                value={draft || new Date()}
                mode="date"
                display="spinner"
                maximumDate={maximumDate}
                minimumDate={minimumDate}
                onChange={handleChange}
                style={styles.iosPicker}
              />
              <Button title="Confirmar" onPress={confirmIos} variant="primary" size="full" />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const webInputStyle = {
  border: 'none',
  outline: 'none',
  background: 'transparent',
  fontSize: FONT_SIZES.base,
  color: COLORS.textPrimary,
  fontFamily: 'inherit',
  width: '100%',
  padding: 0,
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.base,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    letterSpacing: 0.2,
  },
  wrapper: {
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    minHeight: 50,
  },
  errorBorder: {
    borderColor: COLORS.danger,
  },
  value: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHTS.regular,
  },
  placeholder: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textMuted,
    fontWeight: FONT_WEIGHTS.regular,
  },
  errorText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.danger,
    marginTop: SPACING.xs,
  },
  helperText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalSheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.base,
  },
  iosPicker: {
    marginBottom: SPACING.md,
  },
});
