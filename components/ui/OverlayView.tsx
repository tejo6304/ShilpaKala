// OverlayView — Camera guide frame with golden dashed border + corner accents
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Colors, Typography, Spacing } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

const FRAME_W = width * 0.72;
const FRAME_H = FRAME_W * 1.15;
const CORNER_SIZE = 24;
const CORNER_THICKNESS = 3;

export default function OverlayView() {
  const pulseAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.7, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Darkened vignette corners */}
      <View style={styles.vignetteTop} />
      <View style={styles.vignetteBottom} />
      <View style={styles.vignetteLeft} />
      <View style={styles.vignetteRight} />

      {/* Guide frame */}
      <Animated.View style={[styles.frame, { opacity: pulseAnim }]}>
        {/* Dashed border simulation: use multiple small segments */}
        <DashedBorder />

        {/* Corner accents — top-left */}
        <View style={[styles.corner, styles.cornerTL]} />
        {/* top-right */}
        <View style={[styles.corner, styles.cornerTR]} />
        {/* bottom-left */}
        <View style={[styles.corner, styles.cornerBL]} />
        {/* bottom-right */}
        <View style={[styles.corner, styles.cornerBR]} />

        {/* Center crosshair */}
        <View style={styles.crossH} />
        <View style={styles.crossV} />
      </Animated.View>

      {/* Hint text */}
      <View style={styles.hintContainer}>
        <Text style={styles.hintText}>Place your craft inside the frame</Text>
        <Text style={styles.hintKannada}>ನಿಮ್ಮ ಕಲಾಕೃತಿಯನ್ನು ಚೌಕಟ್ಟಿನಲ್ಲಿ ಇರಿಸಿ</Text>
      </View>
    </View>
  );
}

// Simple dashed border using multiple View segments
function DashedBorder() {
  const dashCount = 14;
  const dashH = Math.floor(FRAME_H / dashCount);
  const dashW = Math.floor(FRAME_W / dashCount);

  const hDashes = Array.from({ length: dashCount });
  const vDashes = Array.from({ length: dashCount });

  return (
    <>
      {/* Top edge */}
      {hDashes.map((_, i) => (
        i % 2 === 0 ? (
          <View key={`top-${i}`} style={[styles.dashH, { left: i * dashW, top: 0, width: dashW - 3 }]} />
        ) : null
      ))}
      {/* Bottom edge */}
      {hDashes.map((_, i) => (
        i % 2 === 0 ? (
          <View key={`bot-${i}`} style={[styles.dashH, { left: i * dashW, bottom: 0, width: dashW - 3 }]} />
        ) : null
      ))}
      {/* Left edge */}
      {vDashes.map((_, i) => (
        i % 2 === 0 ? (
          <View key={`lft-${i}`} style={[styles.dashV, { top: i * dashH, left: 0, height: dashH - 3 }]} />
        ) : null
      ))}
      {/* Right edge */}
      {vDashes.map((_, i) => (
        i % 2 === 0 ? (
          <View key={`rgt-${i}`} style={[styles.dashV, { top: i * dashH, right: 0, height: dashH - 3 }]} />
        ) : null
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Vignette panels
  vignetteTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: (height - FRAME_H) / 2 - 20,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  vignetteBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: (height - FRAME_H) / 2 + 60,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  vignetteLeft: {
    position: 'absolute',
    left: 0,
    top: (height - FRAME_H) / 2 - 20,
    width: (width - FRAME_W) / 2,
    height: FRAME_H,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  vignetteRight: {
    position: 'absolute',
    right: 0,
    top: (height - FRAME_H) / 2 - 20,
    width: (width - FRAME_W) / 2,
    height: FRAME_H,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  // Guide frame
  frame: {
    width: FRAME_W,
    height: FRAME_H,
    marginBottom: 60,
    position: 'relative',
  },
  // Dashed segments
  dashH: {
    position: 'absolute',
    height: 1.5,
    backgroundColor: Colors.guideFrame,
  },
  dashV: {
    position: 'absolute',
    width: 1.5,
    backgroundColor: Colors.guideFrame,
  },
  // Corner L-shapes
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: Colors.cornerAccent,
  },
  cornerTL: {
    top: -1,
    left: -1,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: -1,
    right: -1,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: -1,
    left: -1,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: -1,
    right: -1,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderBottomRightRadius: 4,
  },
  // Center crosshair
  crossH: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 20,
    height: 1,
    marginLeft: -10,
    backgroundColor: `${Colors.secondary}80`,
  },
  crossV: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 1,
    height: 20,
    marginTop: -10,
    backgroundColor: `${Colors.secondary}80`,
  },
  // Hint text
  hintContainer: {
    position: 'absolute',
    bottom: height * 0.16,
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  hintText: {
    color: 'rgba(255,248,240,0.9)',
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    textAlign: 'center',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  hintKannada: {
    color: Colors.secondary,
    fontSize: Typography.xs,
    textAlign: 'center',
    marginTop: 3,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
