// BrandingCanvas — renders the branded photo overlay as a View
// Used with react-native-view-shot to export as image
import React, { forwardRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';

const { width } = Dimensions.get('window');
export const CANVAS_W = width;
export const CANVAS_H = width * 1.2; // 5:6 ratio — portrait product

interface BrandingCanvasProps {
  photoUri: string;
  artisanName: string;
  village: string;
  productName: string;
  woodType: string;
  price: string;
}

const BrandingCanvas = forwardRef<View, BrandingCanvasProps>(
  ({ photoUri, artisanName, village, productName, woodType, price }, ref) => {
    return (
      <View ref={ref} style={styles.canvas} collapsable={false}>
        {/* Base photo */}
        <Image
          source={{ uri: photoUri }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />

        {/* Vignette */}
        <LinearGradient
          colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.0)', 'rgba(44,26,14,0.5)']}
          locations={[0, 0.55, 1]}
          style={StyleSheet.absoluteFill}
        />

        {/* ── TOP LEFT: Watermark ── */}
        <View style={styles.watermark}>
          <Text style={styles.watermarkText}>✦ Shilpa-Kala</Text>
        </View>

        {/* ── TOP LEFT (below watermark): Product Name ── */}
        <View style={styles.productNameContainer}>
          <Text style={styles.productName} numberOfLines={2}>{productName}</Text>
        </View>

        {/* ── TOP RIGHT: Price Badge ── */}
        <View style={styles.priceBadge}>
          <Text style={styles.priceCurrency}>₹</Text>
          <Text style={styles.priceValue}>{price}</Text>
        </View>

        {/* ── BOTTOM: Heritage Strip ── */}
        <LinearGradient
          colors={['transparent', Colors.brandingStrip]}
          locations={[0, 0.4]}
          style={styles.heritageStrip}
        >
          {/* Top divider line */}
          <View style={styles.goldDivider} />

          <View style={styles.heritageContent}>
            {/* Left: Icon + Handmade label */}
            <View style={styles.heritageLeft}>
              <Text style={styles.heritageIcon}>🪵</Text>
              <View>
                <Text style={styles.heritageLabel}>Handmade in</Text>
                <Text style={styles.heritageState}>Karnataka</Text>
              </View>
            </View>

            {/* Center: Artisan */}
            <View style={styles.heritageCenter}>
              <Text style={styles.artisanName} numberOfLines={1}>{artisanName}</Text>
              <Text style={styles.artisanVillage} numberOfLines={1}>{village}</Text>
            </View>

            {/* Right: Wood type */}
            <View style={styles.heritageRight}>
              <Text style={styles.woodLabel}>Material</Text>
              <Text style={styles.woodType} numberOfLines={1}>{woodType}</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }
);

BrandingCanvas.displayName = 'BrandingCanvas';
export default BrandingCanvas;

const styles = StyleSheet.create({
  canvas: {
    width: CANVAS_W,
    height: CANVAS_H,
    overflow: 'hidden',
    backgroundColor: '#1a0d05',
  },
  // Watermark — top left
  watermark: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: Radius.round,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: `${Colors.secondary}60`,
  },
  watermarkText: {
    color: Colors.secondary,
    fontSize: 11,
    fontWeight: Typography.bold,
    letterSpacing: 0.8,
  },
  // Product Name — top left below watermark
  productNameContainer: {
    position: 'absolute',
    top: 50,
    left: 14,
    maxWidth: CANVAS_W * 0.62,
  },
  productName: {
    color: Colors.white,
    fontSize: Typography.xl,
    fontWeight: Typography.extrabold,
    letterSpacing: 0.4,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    lineHeight: Typography.xl * 1.25,
  },
  // Price Badge — top right
  priceBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: Colors.priceBadge,
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  priceCurrency: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: Typography.md,
    fontWeight: Typography.bold,
  },
  priceValue: {
    color: Colors.white,
    fontSize: Typography.xxl,
    fontWeight: Typography.extrabold,
    letterSpacing: 0.5,
  },
  // Heritage Strip — bottom
  heritageStrip: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  goldDivider: {
    height: 1.5,
    backgroundColor: Colors.secondary,
    marginBottom: Spacing.sm,
    opacity: 0.6,
  },
  heritageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  heritageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  heritageIcon: {
    fontSize: 20,
  },
  heritageLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 10,
    fontWeight: Typography.medium,
    letterSpacing: 0.3,
  },
  heritageState: {
    color: Colors.secondary,
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    letterSpacing: 0.3,
  },
  heritageCenter: {
    flex: 1.2,
    alignItems: 'center',
  },
  artisanName: {
    color: Colors.white,
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    textAlign: 'center',
    letterSpacing: 0.4,
  },
  artisanVillage: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: Typography.xs,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  heritageRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  woodLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    fontWeight: Typography.medium,
    letterSpacing: 0.3,
  },
  woodType: {
    color: Colors.secondary,
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    textAlign: 'right',
  },
});
