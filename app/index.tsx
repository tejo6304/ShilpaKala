// Shilpa-Kala — Onboarding / Splash Screen
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useArtisan } from '@/hooks/useArtisan';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/constants/theme';
import { useAlert } from '@/template';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const { isLoading, isOnboardingDone, saveProfile } = useArtisan();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();

  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Animations
  const logoAnim = useRef(new Animated.Value(0)).current;
  const taglineAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isLoading && isOnboardingDone) {
      router.replace('/(tabs)');
      return;
    }
    if (!isLoading) {
      // Animate in
      Animated.sequence([
        Animated.timing(logoAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(taglineAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.delay(400),
      ]).start(() => setShowForm(true));
    }
  }, [isLoading, isOnboardingDone]);

  useEffect(() => {
    if (showForm) {
      Animated.timing(formAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }
  }, [showForm]);

  const handleGetStarted = async () => {
    if (!name.trim()) {
      showAlert('Name Required', 'Please enter your artisan name to continue.');
      return;
    }
    if (!village.trim()) {
      showAlert('Village Required', 'Please enter your village or town name.');
      return;
    }
    setSaving(true);
    try {
      await saveProfile({ name: name.trim(), village: village.trim() });
      router.replace('/(tabs)');
    } catch (e) {
      showAlert('Error', 'Could not save your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <Image source={require('@/assets/images/logo.png')} style={styles.loadingLogo} contentFit="contain" />
        <ActivityIndicator size="large" color={Colors.secondary} style={{ marginTop: 24 }} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={require('@/assets/images/onboarding-hero.png')}
            style={styles.heroImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(92,51,23,0.65)', Colors.primary]}
            locations={[0.4, 0.72, 1]}
            style={StyleSheet.absoluteFillObject}
          />
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo & Title */}
          <Animated.View style={[styles.brandBlock, { opacity: logoAnim, transform: [{ translateY: logoAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }] }]}>
            <View style={styles.logoRow}>
              <Image source={require('@/assets/images/logo.png')} style={styles.logoSmall} contentFit="contain" />
              <Text style={styles.appName}>Shilpa-Kala</Text>
            </View>
            <Animated.View style={{ opacity: taglineAnim }}>
              <Text style={styles.tagline}>Your Craft. Your Brand.</Text>
              <Text style={styles.taglineKannada}>ನಿಮ್ಮ ಕಲೆ. ನಿಮ್ಮ ಬ್ರ್ಯಾಂಡ್.</Text>
              <Text style={styles.subtitle}>
                Transform your craft photos into luxury catalog images — instantly, offline.
              </Text>
            </Animated.View>
          </Animated.View>

          {/* Setup Form */}
          {showForm ? (
            <Animated.View style={[styles.formCard, Shadows.lg, { opacity: formAnim, transform: [{ translateY: formAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
              <Text style={styles.formTitle}>Set Up Your Profile</Text>
              <Text style={styles.formSubtitle}>This appears on every branded photo you create</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Artisan Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Ramesh Gowda"
                  placeholderTextColor={Colors.textMuted}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Village / Town *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Channapatna, Karnataka"
                  placeholderTextColor={Colors.textMuted}
                  value={village}
                  onChangeText={setVillage}
                  autoCapitalize="words"
                  returnKeyType="done"
                  onSubmitEditing={handleGetStarted}
                />
              </View>

              <TouchableOpacity
                style={[styles.ctaButton, saving && styles.ctaButtonDisabled]}
                onPress={handleGetStarted}
                disabled={saving}
                activeOpacity={0.82}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <>
                    <Text style={styles.ctaText}>Get Started</Text>
                    <Text style={styles.ctaSubText}>→</Text>
                  </>
                )}
              </TouchableOpacity>

              <Text style={styles.disclaimer}>You can update these details later in Settings</Text>
            </Animated.View>
          ) : null}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const HERO_H = height * 0.42;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingLogo: {
    width: 90,
    height: 90,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  heroContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HERO_H + 80,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: HERO_H - 20,
    paddingHorizontal: Spacing.md,
  },
  brandBlock: {
    marginBottom: Spacing.lg,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  logoSmall: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  appName: {
    fontSize: Typography.xxl,
    fontWeight: Typography.extrabold,
    color: Colors.secondary,
    letterSpacing: 1.2,
  },
  tagline: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.white,
    marginBottom: 2,
    letterSpacing: 0.4,
  },
  taglineKannada: {
    fontSize: Typography.sm,
    color: Colors.secondary,
    marginBottom: Spacing.sm,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: Typography.base,
    color: 'rgba(255,248,240,0.82)',
    lineHeight: Typography.base * Typography.relaxed,
  },
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.sm,
  },
  formTitle: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: Typography.sm,
    color: Colors.textLight,
    marginBottom: Spacing.lg,
    lineHeight: Typography.sm * Typography.relaxed,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: Typography.sm,
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
    paddingVertical: 13,
    fontSize: Typography.base,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  ctaButton: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    gap: 8,
  },
  ctaButtonDisabled: {
    opacity: 0.7,
  },
  ctaText: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.white,
    letterSpacing: 0.5,
  },
  ctaSubText: {
    fontSize: Typography.xl,
    color: Colors.white,
    fontWeight: Typography.bold,
  },
  disclaimer: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});
