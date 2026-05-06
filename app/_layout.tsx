import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertProvider } from '@/template';
import { ArtisanProvider } from '@/contexts/ArtisanContext';

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <ArtisanProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="preview" options={{ animation: 'slide_from_bottom' }} />
          </Stack>
        </ArtisanProvider>
      </SafeAreaProvider>
    </AlertProvider>
  );
}
