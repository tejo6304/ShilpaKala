// Shilpa-Kala Design System
// Traditional Indian artisan aesthetic — warm, earthy, heritage

export const Colors = {
  // Brand Palette
  primary: '#5C3317',        // Dark Walnut Brown
  secondary: '#C8960C',      // Heritage Gold
  accent: '#FF6B00',         // Saffron Orange
  background: '#FDF6EC',     // Cream Ivory
  text: '#2C1A0E',           // Deep Espresso
  textLight: '#7A5C3E',      // Warm Tan
  textMuted: '#B8956A',      // Light Tan

  // Surface Colors
  surface: '#FFF8F0',        // Light Cream
  surfaceElevated: '#FFFFFF',
  surfaceDark: '#3A1E0A',    // Very Dark Brown

  // State Colors
  success: '#4CAF50',
  error: '#D32F2F',
  warning: '#FF6B00',

  // UI Elements
  border: '#E8D5BB',
  borderLight: '#F0E4CE',
  divider: '#EDE0CC',
  overlay: 'rgba(44, 26, 14, 0.6)',
  overlayLight: 'rgba(253, 246, 236, 0.85)',

  // Camera Overlay
  guideFrame: '#C8960C',
  cornerAccent: '#FF6B00',

  // Branding on Photo
  brandingStrip: 'rgba(44, 26, 14, 0.78)',
  priceBadge: '#FF6B00',
  watermark: '#C8960C',
  white: '#FFFFFF',
  black: '#000000',
};

export const Typography = {
  // Font sizes (16-base scale 1.25)
  xs: 11,
  sm: 13,
  base: 16,
  md: 18,
  lg: 20,
  xl: 24,
  xxl: 30,
  xxxl: 38,

  // Weights
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,

  // Line heights
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.6,
};

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const Radius = {
  sm: 6,
  md: 12,
  lg: 18,
  xl: 24,
  round: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#2C1A0E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#2C1A0E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
  },
  lg: {
    shadowColor: '#2C1A0E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.24,
    shadowRadius: 16,
    elevation: 10,
  },
};
