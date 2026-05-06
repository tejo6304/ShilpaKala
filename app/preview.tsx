// Branded Photo Preview Screen
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import ViewShot from 'react-native-view-shot';
import { useArtisan } from '@/hooks/useArtisan';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/constants/theme';
import BrandingCanvas from '@/components/feature/BrandingCanvas';
import { StorageService } from '@/services/StorageService';
import { useAlert } from '@/template';

const { width } = Dimensions.get('window');

export default function PreviewScreen() {
  const { profile, pendingPhoto, productDetails, setPendingPhoto, setProductDetails } = useArtisan();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();
  const viewShotRef = useRef<ViewShot>(null);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sharing, setSharing] = useState(false);

  if (!pendingPhoto || !productDetails || !profile) {
    router.replace('/(tabs)');
    return null;
  }

  const captureImage = async (): Promise<string | null> => {
    try {
      const uri = await viewShotRef.current?.capture?.();
      return uri ?? null;
    } catch (e) {
      console.error('Capture failed:', e);
      return null;
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const uri = await captureImage();
      if (!uri) {
        showAlert('Error', 'Could not capture branded image. Please try again.');
        return;
      }
      const savedUri = await StorageService.saveToGallery(uri);
      if (savedUri) {
        setSaved(true);
        showAlert('Saved!', 'Your branded photo has been saved to Pictures/ShilpaKala in your gallery.');
      } else {
        showAlert('Permission Required', 'Please grant gallery access to save photos.');
      }
    } catch (e) {
      showAlert('Error', 'Failed to save photo. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      const uri = await captureImage();
      if (!uri) {
        showAlert('Error', 'Could not prepare image for sharing.');
        return;
      }
      await Share.share({
        url: uri,
        message: `${productDetails.productName} by ${profile.name} from ${profile.village} — Handcrafted in Karnataka 🪵 | ₹${productDetails.price} | #ShilpaKala #MadeInKarnataka`,
        title: productDetails.productName,
      });
    } catch (e) {
      // User cancelled share — no error needed
    } finally {
      setSharing(false);
    }
  };

  const handleRetake = () => {
    setPendingPhoto(null);
    setProductDetails(null);
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleRetake} style={styles.backBtn} activeOpacity={0.8}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.white} />
          <Text style={styles.backBtnText}>Retake</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preview</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Branded Canvas */}
        <View style={styles.canvasWrapper}>
          <ViewShot
            ref={viewShotRef}
            options={{ format: 'jpg', quality: 0.95 }}
            style={styles.canvasShadow}
          >
            <BrandingCanvas
              photoUri={pendingPhoto}
              artisanName={profile.name}
              village={profile.village}
              productName={productDetails.productName}
              woodType={productDetails.woodType}
              price={productDetails.price}
            />
          </ViewShot>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Product</Text>
              <Text style={styles.infoValue}>{productDetails.productName}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Wood</Text>
              <Text style={styles.infoValue}>{productDetails.woodType}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Price</Text>
              <Text style={[styles.infoValue, { color: Colors.accent }]}>₹{productDetails.price}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <Text style={styles.artisanInfo}>
            🪵 {profile.name} · {profile.village}
          </Text>
          <Text style={styles.artisanInfoKannada}>ಕರ್ನಾಟಕದಲ್ಲಿ ತಯಾರಿಸಲಾಗಿದೆ</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          {/* Save */}
          <TouchableOpacity
            style={[styles.primaryBtn, saved && styles.savedBtn]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.82}
          >
            {saving ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <>
                <MaterialIcons name={saved ? 'check-circle' : 'save-alt'} size={20} color={Colors.white} />
                <Text style={styles.primaryBtnText}>{saved ? 'Saved to Gallery' : 'Save to Gallery'}</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Share */}
          <TouchableOpacity
            style={styles.shareBtn}
            onPress={handleShare}
            disabled={sharing}
            activeOpacity={0.82}
          >
            {sharing ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <>
                <MaterialIcons name="share" size={20} color={Colors.primary} />
                <Text style={styles.shareBtnText}>Share via WhatsApp / Facebook</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Retake */}
          <TouchableOpacity style={styles.retakeBtn} onPress={handleRetake} activeOpacity={0.8}>
            <MaterialIcons name="camera-alt" size={18} color={Colors.textLight} />
            <Text style={styles.retakeBtnText}>Retake Photo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceDark,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    minWidth: 80,
  },
  backBtnText: {
    color: Colors.white,
    fontSize: Typography.base,
    fontWeight: Typography.medium,
  },
  headerTitle: {
    color: Colors.secondary,
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    letterSpacing: 0.5,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  canvasWrapper: {
    alignItems: 'center',
  },
  canvasShadow: {
    borderRadius: Radius.md,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  infoCard: {
    width: '100%',
    backgroundColor: Colors.surfaceDark,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: `${Colors.secondary}30`,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: Typography.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: Typography.medium,
    marginBottom: 4,
  },
  infoValue: {
    color: Colors.white,
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: `${Colors.secondary}25`,
    marginVertical: Spacing.sm,
  },
  artisanInfo: {
    color: Colors.secondary,
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    textAlign: 'center',
  },
  artisanInfoKannada: {
    color: 'rgba(200,150,12,0.65)',
    fontSize: Typography.xs,
    textAlign: 'center',
    marginTop: 2,
  },
  actions: {
    width: '100%',
    gap: Spacing.sm,
  },
  primaryBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  savedBtn: {
    backgroundColor: '#2E7D32',
  },
  primaryBtnText: {
    color: Colors.white,
    fontSize: Typography.base,
    fontWeight: Typography.bold,
  },
  shareBtn: {
    backgroundColor: Colors.secondary,
    borderRadius: Radius.md,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  shareBtnText: {
    color: Colors.primary,
    fontSize: Typography.base,
    fontWeight: Typography.bold,
  },
  retakeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.md,
  },
  retakeBtnText: {
    color: Colors.textMuted,
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
  },
});
