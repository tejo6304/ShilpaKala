// MediaStore equivalent — save & load branded photos
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

const ALBUM_NAME = 'ShilpaKala';

export interface SavedPhoto {
  id: string;
  uri: string;
  filename: string;
  creationTime: number;
  width: number;
  height: number;
}

export const StorageService = {
  async requestPermissions(): Promise<boolean> {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return status === 'granted';
  },

  async saveToGallery(localUri: string): Promise<string | null> {
    try {
      const granted = await this.requestPermissions();
      if (!granted) return null;

      const asset = await MediaLibrary.createAssetAsync(localUri);
      
      // Add to ShilpaKala album
      let album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
      if (!album) {
        await MediaLibrary.createAlbumAsync(ALBUM_NAME, asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      return asset.uri;
    } catch (e) {
      console.error('Save failed:', e);
      return null;
    }
  },

  async loadGalleryPhotos(): Promise<SavedPhoto[]> {
    try {
      const { status } = await MediaLibrary.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await MediaLibrary.requestPermissionsAsync();
        if (newStatus !== 'granted') return [];
      }

      const album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
      if (!album) return [];

      const { assets } = await MediaLibrary.getAssetsAsync({
        album,
        sortBy: [MediaLibrary.SortBy.creationTime],
        mediaType: MediaLibrary.MediaType.photo,
        first: 200,
      });

      return assets.map(a => ({
        id: a.id,
        uri: a.uri,
        filename: a.filename,
        creationTime: a.creationTime,
        width: a.width,
        height: a.height,
      }));
    } catch (e) {
      console.error('Load gallery failed:', e);
      return [];
    }
  },

  async deletePhoto(assetId: string): Promise<boolean> {
    try {
      await MediaLibrary.deleteAssetsAsync([assetId]);
      return true;
    } catch (e) {
      console.error('Delete failed:', e);
      return false;
    }
  },
};
