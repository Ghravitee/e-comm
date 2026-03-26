/* eslint-disable @typescript-eslint/no-explicit-any */
// features/favorites/store/useFavoritesStore.ts
import { create } from "zustand";
import type { FavoriteWithProduct } from "../types";
import { getFavorites, addFavorite, removeFavorite } from "../api/favoritesApi";

interface FavoritesState {
  favorites: FavoriteWithProduct[];
  isLoading: boolean;
  error: string | null;
  hasLoaded: boolean; // Add this flag to prevent multiple loads

  // Actions
  loadFavorites: (userId: string) => Promise<void>;
  addToFavorites: (
    userId: string,
    productId: string,
    product: any,
  ) => Promise<void>;
  removeFromFavorites: (userId: string, productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  isLoading: false,
  error: null,
  hasLoaded: false, // Initialize as false

  loadFavorites: async (userId: string) => {
    // Prevent multiple loads
    if (get().hasLoaded) return;

    set({ isLoading: true, error: null });
    try {
      const favorites = await getFavorites(userId);
      set({ favorites, isLoading: false, hasLoaded: true });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addToFavorites: async (userId: string, productId: string, product: any) => {
    try {
      await addFavorite(userId, productId);

      // Add to local state with product data
      const newFavorite: FavoriteWithProduct = {
        id: Date.now().toString(),
        user_id: userId,
        product_id: productId,
        created_at: new Date().toISOString(),
        product: product,
      };

      set((state) => ({
        favorites: [newFavorite, ...state.favorites],
      }));
    } catch (error) {
      console.error("Failed to add favorite:", error);
      throw error;
    }
  },

  removeFromFavorites: async (userId: string, productId: string) => {
    try {
      await removeFavorite(userId, productId);

      set((state) => ({
        favorites: state.favorites.filter((f) => f.product_id !== productId),
      }));
    } catch (error) {
      console.error("Failed to remove favorite:", error);
      throw error;
    }
  },

  isFavorite: (productId: string) => {
    return get().favorites.some((f) => f.product_id === productId);
  },

  clearFavorites: () => {
    set({ favorites: [], hasLoaded: false }); // Reset hasLoaded when clearing
  },
}));
