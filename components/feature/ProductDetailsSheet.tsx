// Product Details Bottom Sheet — appears after photo capture
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/constants/theme';
import { ProductDetails } from '@/contexts/ArtisanContext';

const { height } = Dimensions.get('window');
const SHEET_H = height * 0.68;

const WOOD_TYPES = ['Rosewood', 'Teak', 'Sandalwood', 'Lacquered Wood', 'Bamboo', 'Other'];

interface Props {
  visible: boolean;
  artisanName: string;
  onApply: (details: ProductDetails) => void;
  onDismiss: () => void;
}

export default function ProductDetailsSheet({ visible, artisanName, onApply, onDismiss }: Props) {
  const slideAnim = useRef(new Animated.Value(SHEET_H)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;

  const [productName, setProductName] = useState('');
  const [woodType, setWoodType] = useState('Rosewood');
  const [price, setPrice] = useState('');
  const [showWoodPicker, setShowWoodPicker] = useState(false);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 65, friction: 11 }),
        Animated.timing(bgAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: SHEET_H, duration: 250, useNativeDriver: true }),
        Animated.timing(bgAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const handleApply = () => {
    if (!productName.trim()) return;
    onApply({
      productName: productName.trim(),
      woodType,
      price: price.trim() || '—',
    });
  };

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible} onRequestClose={onDismiss}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={onDismiss}>
          <Animated.View style={[styles.backdrop, { opacity: bgAnim }]} />
        </TouchableWithoutFeedback>

        {/* Sheet */}
        <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
          {/* Handle */}
          <View style={styles.handle} />

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={styles.sheetTitle}>Product Details</Text>
            <Text style={styles.sheetSubtitle}>This info will appear on your branded photo</Text>

            {/* Artisan name (read-only) */}
            <View style={styles.infoRow}>
              <MaterialIcons name="person" size={16} color={Colors.secondary} />
              <Text style={styles.infoText}>Artisan: <Text style={styles.infoValue}>{artisanName}</Text></Text>
            </View>

            {/* Product Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Product Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Dancing Doll, Elephant Set"
                placeholderTextColor={Colors.textMuted}
                value={productName}
                onChangeText={setProductName}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

            {/* Wood Type Dropdown */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Wood Type</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowWoodPicker(!showWoodPicker)}
                activeOpacity={0.8}
              >
                <Text style={styles.dropdownValue}>{woodType}</Text>
                <MaterialIcons
                  name={showWoodPicker ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                  size={22}
                  color={Colors.textLight}
                />
              </TouchableOpacity>
              {showWoodPicker ? (
                <View style={styles.pickerList}>
                  {WOOD_TYPES.map(w => (
                    <TouchableOpacity
                      key={w}
                      style={[styles.pickerItem, woodType === w && styles.pickerItemActive]}
                      onPress={() => { setWoodType(w); setShowWoodPicker(false); }}
                    >
                      <Text style={[styles.pickerItemText, woodType === w && styles.pickerItemTextActive]}>{w}</Text>
                      {woodType === w ? <MaterialIcons name="check" size={16} color={Colors.secondary} /> : null}
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null}
            </View>

            {/* Price */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Price (₹)</Text>
              <View style={styles.priceRow}>
                <View style={styles.pricePrefix}>
                  <Text style={styles.pricePrefixText}>₹</Text>
                </View>
                <TextInput
                  style={styles.priceInput}
                  placeholder="e.g., 450"
                  placeholderTextColor={Colors.textMuted}
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                  returnKeyType="done"
                />
              </View>
            </View>

            {/* Apply Button */}
            <TouchableOpacity
              style={[styles.applyBtn, !productName.trim() && styles.applyBtnDisabled]}
              onPress={handleApply}
              disabled={!productName.trim()}
              activeOpacity={0.82}
            >
              <MaterialIcons name="auto-fix-high" size={20} color={Colors.white} />
              <Text style={styles.applyBtnText}>Apply Branding</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.retakeBtn} onPress={onDismiss}>
              <Text style={styles.retakeBtnText}>← Retake Photo</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_H,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.sm,
    ...Shadows.lg,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.md,
    marginTop: 4,
  },
  sheetTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  sheetSubtitle: {
    fontSize: Typography.sm,
    color: Colors.textLight,
    marginBottom: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: `${Colors.secondary}18`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.sm,
    marginBottom: Spacing.md,
  },
  infoText: {
    fontSize: Typography.sm,
    color: Colors.textLight,
  },
  infoValue: {
    fontWeight: Typography.semibold,
    color: Colors.text,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.textLight,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: Typography.base,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    backgroundColor: Colors.background,
  },
  dropdownValue: {
    fontSize: Typography.base,
    color: Colors.text,
  },
  pickerList: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    marginTop: 4,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  pickerItemActive: {
    backgroundColor: `${Colors.secondary}12`,
  },
  pickerItemText: {
    fontSize: Typography.base,
    color: Colors.text,
  },
  pickerItemTextActive: {
    color: Colors.primary,
    fontWeight: Typography.semibold,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pricePrefix: {
    borderWidth: 1.5,
    borderRightWidth: 0,
    borderColor: Colors.border,
    borderTopLeftRadius: Radius.md,
    borderBottomLeftRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: `${Colors.secondary}18`,
  },
  pricePrefixText: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.secondary,
  },
  priceInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderTopRightRadius: Radius.md,
    borderBottomRightRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: Typography.base,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  applyBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: Spacing.sm,
  },
  applyBtnDisabled: {
    opacity: 0.5,
  },
  applyBtnText: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.white,
  },
  retakeBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  retakeBtnText: {
    fontSize: Typography.sm,
    color: Colors.textLight,
  },
});
