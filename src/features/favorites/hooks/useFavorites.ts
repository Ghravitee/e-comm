/* eslint-disable @typescript-eslint/no-explicit-any */
// features/favorites/hooks/useFavorites.ts
import { useEffect, useRef } from "react";
import { useFavoritesStore } from "../store/useFavoritesStore";
import { useAuth } from "../../auth/hooks/useAuth";

export const useFavorites = () => {
  const {
    favorites,
    isLoading,
    error,
    loadFavorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearFavorites,
    hasLoaded, // Add this
  } = useFavoritesStore();

  const { user } = useAuth();
  const initialLoadDone = useRef(false);

  // Load favorites when user logs in (ONLY ONCE)
  useEffect(() => {
    if (user && !hasLoaded && !initialLoadDone.current) {
      initialLoadDone.current = true;
      loadFavorites(user.id);
    } else if (!user) {
      // Clear favorites when user logs out
      clearFavorites();
      initialLoadDone.current = false;
    }
  }, [user, loadFavorites, clearFavorites, hasLoaded]);

  const toggleFavorite = async (productId: string, product: any) => {
    if (!user) {
      console.log("Please login to add favorites");
      return false;
    }

    if (isFavorite(productId)) {
      await removeFromFavorites(user.id, productId);
      return false;
    } else {
      await addToFavorites(user.id, productId, product);
      return true;
    }
  };

  return {
    favorites,
    isLoading,
    error,
    toggleFavorite,
    isFavorite,
    addToFavorites: (productId: string, product: any) =>
      user && addToFavorites(user.id, productId, product),
    removeFromFavorites: (productId: string) =>
      user && removeFromFavorites(user.id, productId),
  };
};
