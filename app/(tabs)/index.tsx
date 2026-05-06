// Camera Screen — CameraX equivalent using expo-camera
import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import OverlayView from '@/components/ui/OverlayView';
import ProductDetailsSheet from '@/components/feature/ProductDetailsSheet';
import SettingsSheet from '@/components/feature/SettingsSheet';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/constants/theme';
import { useArtisan } from '@/hooks/useArtisan';
import { ProductDetails } from '@/contexts/ArtisanContext';
import { useAlert } from '@/template';

const { width, height } = Dimensions.get('window');

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<'on' | 'off' | 'auto'>('off');
  const [capturing, setCapturing] = useState(false);
  const [showProductSheet, setShowProductSheet] = useState(false);
  const [showSettingsSheet, setShowSettingsSheet] = useState(false);
  const [capturedUri, setCapturedUri] = useState<string | null>(null);

  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile, setPendingPhoto, setProductDetails, updateProfile } = useArtisan();
  const { showAlert } = useAlert();

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.92,
        base64: false,
        exif: false,
      });
      if (photo?.uri) {
        setCapturedUri(photo.uri);
        setPendingPhoto(photo.uri);
        setShowProductSheet(true);
      }
    } catch (e) {
      showAlert('Capture Failed', 'Could not take photo. Please try again.');
    } finally {
      setCapturing(false);
    }
  }, [capturing]);

  const handleApplyBranding = (details: ProductDetails) => {
    setProductDetails(details);
    setShowProductSheet(false);
    router.push('/preview');
  };

  const handleRetake = () => {
    setShowProductSheet(false);
    setCapturedUri(null);
    setPendingPhoto(null);
  };

  const toggleFlash = () => {
    setFlash(f => f === 'off' ? 'on' : f === 'on' ? 'auto' : 'off');
  };

  const flashIcon = flash === 'on' ? 'flash-on' : flash === 'auto' ? 'flash-auto' : 'flash-off';

  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <ActivityIndicator size="large" color={Colors.secondary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.permissionContainer, { paddingTop: insets.top }]}>
        <MaterialIcons name="camera-alt" size={72} color={Colors.secondary} />
        <Text style={styles.permTitle}>Camera Access Required</Text>
        <Text style={styles.permSubtitle}>
          Shilpa-Kala needs camera access to help you capture your craft beautifully.
        </Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission} activeOpacity={0.82}>
          <Text style={styles.permBtnText}>Grant Camera Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Full-screen Camera */}
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
        flash={flash}
      />

      {/* Camera Overlay — guide frame */}
      <OverlayView />

      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        {/* App badge */}
        <View style={styles.appBadge}>
          <Text style={styles.appBadgeText}>✦ Shilpa-Kala</Text>
        </View>

        {/* Controls */}
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.iconBtn} onPress={toggleFlash} activeOpacity={0.8}>
            <MaterialIcons name={flashIcon as any} size={22} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setFacing(f => f === 'back' ? 'front' : 'back')}
            activeOpacity={0.8}
          >
            <MaterialIcons name="flip-camera-ios" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom toolbar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + Spacing.sm }]}>
        {/* Gallery shortcut */}
        <TouchableOpacity
          style={styles.sideBtn}
          onPress={() => router.push('/(tabs)/gallery')}
          activeOpacity={0.8}
        >
          <MaterialIcons name="photo-library" size={28} color={Colors.white} />
          <Text style={styles.sideBtnLabel}>Gallery</Text>
        </TouchableOpacity>

        {/* Capture button */}
        <TouchableOpacity
          style={styles.captureBtn}
          onPress={handleCapture}
          disabled={capturing}
          activeOpacity={0.85}
        >
          <View style={styles.captureBtnOuter}>
            {capturing ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <View style={styles.captureBtnInner} />
            )}
          </View>
        </TouchableOpacity>

        {/* Settings */}
        <TouchableOpacity
          style={styles.sideBtn}
          onPress={() => setShowSettingsSheet(true)}
          activeOpacity={0.8}
        >
          <MaterialIcons name="settings" size={28} color={Colors.white} />
          <Text style={styles.sideBtnLabel}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Artisan name tag */}
      {profile ? (
        <View style={[styles.artisanTag, { bottom: insets.bottom + 80 }]}>
          <Text style={styles.artisanTagText}>{profile.name} · {profile.village}</Text>
        </View>
      ) : null}

      {/* Product Details Bottom Sheet */}
      <ProductDetailsSheet
        visible={showProductSheet}
        artisanName={profile?.name ?? ''}
        onApply={handleApplyBranding}
        onDismiss={handleRetake}
      />

      {/* Settings Sheet */}
      <SettingsSheet
        visible={showSettingsSheet}
        currentProfile={profile}
        onSave={updateProfile}
        onDismiss={() => setShowSettingsSheet(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  permTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.white,
    textAlign: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  permSubtitle: {
    fontSize: Typography.base,
    color: 'rgba(255,248,240,0.75)',
    textAlign: 'center',
    lineHeight: Typography.base * Typography.relaxed,
    marginBottom: Spacing.xl,
  },
  permBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingVertical: 14,
    paddingHorizontal: Spacing.xl,
  },
  permBtnText: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.white,
  },
  // Top bar
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  appBadge: {
    backgroundColor: 'rgba(200,150,12,0.25)',
    borderWidth: 1,
    borderColor: `${Colors.secondary}60`,
    borderRadius: Radius.round,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  appBadgeText: {
    color: Colors.secondary,
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    letterSpacing: 0.5,
  },
  topControls: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Bottom toolbar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingTop: Spacing.md,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sideBtn: {
    alignItems: 'center',
    gap: 4,
    minWidth: 60,
  },
  sideBtnLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
  },
  // Capture button
  captureBtn: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureBtnOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    borderColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(200,150,12,0.15)',
  },
  captureBtnInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.white,
  },
  // Artisan tag
  artisanTag: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  artisanTagText: {
    color: 'rgba(255,248,240,0.65)',
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
    letterSpacing: 0.4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
