import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { PrefsService, ArtisanProfile } from '@/services/PrefsService';

export interface ProductDetails {
  productName: string;
  woodType: string;
  price: string;
}

export interface ArtisanContextType {
  profile: ArtisanProfile | null;
  isLoading: boolean;
  isOnboardingDone: boolean;
  pendingPhoto: string | null;  // URI of captured photo
  productDetails: ProductDetails | null;
  saveProfile: (profile: ArtisanProfile) => Promise<void>;
  updateProfile: (profile: ArtisanProfile) => Promise<void>;
  setPendingPhoto: (uri: string | null) => void;
  setProductDetails: (details: ProductDetails | null) => void;
}

export const ArtisanContext = createContext<ArtisanContextType | undefined>(undefined);

export function ArtisanProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ArtisanProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingDone, setIsOnboardingDone] = useState(false);
  const [pendingPhoto, setPendingPhotoState] = useState<string | null>(null);
  const [productDetails, setProductDetailsState] = useState<ProductDetails | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const done = await PrefsService.isOnboardingDone();
      setIsOnboardingDone(done);
      if (done) {
        const p = await PrefsService.getArtisanProfile();
        setProfile(p);
      }
    } catch (e) {
      console.error('Failed to load profile:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async (p: ArtisanProfile) => {
    await PrefsService.saveArtisanProfile(p);
    setProfile(p);
    setIsOnboardingDone(true);
  };

  const updateProfile = async (p: ArtisanProfile) => {
    await PrefsService.saveArtisanProfile(p);
    setProfile(p);
  };

  const setPendingPhoto = (uri: string | null) => {
    setPendingPhotoState(uri);
  };

  const setProductDetails = (details: ProductDetails | null) => {
    setProductDetailsState(details);
  };

  return (
    <ArtisanContext.Provider value={{
      profile,
      isLoading,
      isOnboardingDone,
      pendingPhoto,
      productDetails,
      saveProfile,
      updateProfile,
      setPendingPhoto,
      setProductDetails,
    }}>
      {children}
    </ArtisanContext.Provider>
  );
}
