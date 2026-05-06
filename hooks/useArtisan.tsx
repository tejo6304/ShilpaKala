import { useContext } from 'react';
import { ArtisanContext, ArtisanContextType } from '@/contexts/ArtisanContext';

export function useArtisan(): ArtisanContextType {
  const context = useContext(ArtisanContext);
  if (!context) throw new Error('useArtisan must be used within ArtisanProvider');
  return context;
}
