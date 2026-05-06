// Gallery Screen — 2-column grid of all saved ShilpaKala photos
import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Modal,
  Share,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/constants/theme';
import { StorageService, SavedPhoto } from '@/services/StorageService';
import { useAlert } from '@/template';

const { width } = Dimensions.get('window');
const COLS = 2;
const GAP = 8;
const TILE_W = (width - Spacing.md * 2 - GAP) / COLS;
const TILE_H = TILE_W * 1.22;

export default function GalleryScreen() {
  const [photos, setPhotos] = useState<SavedPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<SavedPhoto | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();

  const loadPhotos = useCallback(async () => {
    try {
      const data = await StorageService.loadGalleryPhotos();
      setPhotos(data.reverse()); // newest first
    } catch (e) {
      console.error('Failed to load gallery:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPhotos();
    }, [loadPhotos])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadPhotos();
  };

  const handleLongPress = (photo: SavedPhoto) => {
    showAlert(
      photo.filename || 'Photo',
      'What would you like to do?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Share',
          onPress: () => handleShare(photo),
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDelete(photo),
        },
      ]
    );
  };

  const handleShare = async (photo: SavedPhoto) => {
    try {
      await Share.share({
        url: photo.uri,
        message: 'Handcrafted in Karnataka — #ShilpaKala #MadeInKarnataka',
        title: 'Shilpa-Kala Craft Photo',
      });
    } catch (e) {
      // cancelled
    }
  };

  const handleDelete = async (photo: SavedPhoto) => {
    setDeleting(photo.id);
    try {
      const ok = await StorageService.deletePhoto(photo.id);
      if (ok) {
        setPhotos(prev => prev.filter(p => p.id !== photo.id));
        if (selectedPhoto?.id === photo.id) setSelectedPhoto(null);
      } else {
        showAlert('Error', 'Could not delete this photo. Please try again.');
      }
    } finally {
      setDeleting(null);
    }
  };

  const renderItem = ({ item }: { item: SavedPhoto }) => (
    <TouchableOpacity
      style={styles.tile}
      onPress={() => setSelectedPhoto(item)}
      onLongPress={() => handleLongPress(item)}
      activeOpacity={0.85}
      delayLongPress={400}
    >
      <Image
        source={{ uri: item.uri }}
        style={styles.tileImage}
        contentFit="cover"
        transition={150}
      />
      {deleting === item.id ? (
        <View style={styles.deletingOverlay}>
          <ActivityIndicator size="small" color={Colors.white} />
        </View>
      ) : null}
      <View style={styles.tileOverlay}>
        <MaterialIcons name="more-vert" size={16} color="rgba(255,255,255,0.8)" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Gallery</Text>
          <Text style={styles.headerSubtitle}>
            {photos.length} branded {photos.length === 1 ? 'photo' : 'photos'}
          </Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>✦ Shilpa-Kala</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={Colors.secondary} />
          <Text style={styles.loadingText}>Loading your gallery...</Text>
        </View>
      ) : photos.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="photo-library" size={80} color={`${Colors.secondary}40`} />
          <Text style={styles.emptyTitle}>No Photos Yet</Text>
          <Text style={styles.emptySubtitle}>
            Capture your first craft photo and apply branding to see it here.
          </Text>
          <View style={styles.emptyHint}>
            <MaterialIcons name="camera-alt" size={16} color={Colors.textMuted} />
            <Text style={styles.emptyHintText}>Go to Camera tab to get started</Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={photos}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={COLS}
          contentContainerStyle={[styles.grid, { paddingBottom: insets.bottom + 24 }]}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={Colors.secondary}
              colors={[Colors.secondary]}
            />
          }
        />
      )}

      {/* Full-screen photo viewer */}
      <Modal
        visible={selectedPhoto !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPhoto(null)}
      >
        <View style={styles.viewer}>
          <TouchableOpacity
            style={styles.viewerClose}
            onPress={() => setSelectedPhoto(null)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="close" size={28} color={Colors.white} />
          </TouchableOpacity>

          {selectedPhoto ? (
            <Image
              source={{ uri: selectedPhoto.uri }}
              style={styles.viewerImage}
              contentFit="contain"
              transition={200}
            />
          ) : null}

          {/* Viewer actions */}
          <View style={[styles.viewerActions, { paddingBottom: insets.bottom + Spacing.md }]}>
            <TouchableOpacity
              style={styles.viewerBtn}
              onPress={() => selectedPhoto && handleShare(selectedPhoto)}
              activeOpacity={0.8}
            >
              <MaterialIcons name="share" size={22} color={Colors.white} />
              <Text style={styles.viewerBtnText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewerBtn, styles.viewerDeleteBtn]}
              onPress={() => selectedPhoto && handleLongPress(selectedPhoto)}
              activeOpacity={0.8}
            >
              <MaterialIcons name="delete-outline" size={22} color={Colors.accent} />
              <Text style={[styles.viewerBtnText, { color: Colors.accent }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceDark,
  },
  headerTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: Typography.sm,
    color: `${Colors.secondary}90`,
    marginTop: 2,
  },
  headerBadge: {
    backgroundColor: `${Colors.secondary}20`,
    borderWidth: 1,
    borderColor: `${Colors.secondary}50`,
    borderRadius: Radius.round,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  headerBadgeText: {
    color: Colors.secondary,
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    letterSpacing: 0.5,
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    color: Colors.textMuted,
    fontSize: Typography.base,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.white,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: Typography.base,
    color: 'rgba(255,248,240,0.6)',
    textAlign: 'center',
    lineHeight: Typography.base * Typography.relaxed,
    marginBottom: Spacing.lg,
  },
  emptyHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceDark,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.round,
  },
  emptyHintText: {
    color: Colors.textMuted,
    fontSize: Typography.sm,
  },
  grid: {
    padding: Spacing.md,
    gap: GAP,
  },
  row: {
    gap: GAP,
  },
  tile: {
    width: TILE_W,
    height: TILE_H,
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceDark,
  },
  tileImage: {
    width: '100%',
    height: '100%',
  },
  tileOverlay: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: Radius.round,
    padding: 3,
  },
  deletingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Full-screen viewer
  viewer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewerClose: {
    position: 'absolute',
    top: 52,
    right: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: Radius.round,
    padding: 8,
  },
  viewerImage: {
    width: width,
    height: width * 1.3,
  },
  viewerActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
    paddingTop: Spacing.md,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  viewerBtn: {
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  viewerDeleteBtn: {},
  viewerBtnText: {
    color: Colors.white,
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
  },
});
