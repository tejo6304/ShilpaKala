// SharedPreferences equivalent — artisan profile storage
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  ARTISAN_NAME: '@shilpakala_artisan_name',
  ARTISAN_VILLAGE: '@shilpakala_artisan_village',
  ONBOARDING_DONE: '@shilpakala_onboarding_done',
};

export interface ArtisanProfile {
  name: string;
  village: string;
}

export const PrefsService = {
  async saveArtisanProfile(profile: ArtisanProfile): Promise<void> {
    await AsyncStorage.multiSet([
      [KEYS.ARTISAN_NAME, profile.name],
      [KEYS.ARTISAN_VILLAGE, profile.village],
      [KEYS.ONBOARDING_DONE, 'true'],
    ]);
  },

  async getArtisanProfile(): Promise<ArtisanProfile | null> {
    const result = await AsyncStorage.multiGet([
      KEYS.ARTISAN_NAME,
      KEYS.ARTISAN_VILLAGE,
    ]);
    const name = result[0][1];
    const village = result[1][1];
    if (!name || !village) return null;
    return { name, village };
  },

  async isOnboardingDone(): Promise<boolean> {
    const val = await AsyncStorage.getItem(KEYS.ONBOARDING_DONE);
    return val === 'true';
  },

  async clearProfile(): Promise<void> {
    await AsyncStorage.multiRemove([
      KEYS.ARTISAN_NAME,
      KEYS.ARTISAN_VILLAGE,
      KEYS.ONBOARDING_DONE,
    ]);
  },
};
