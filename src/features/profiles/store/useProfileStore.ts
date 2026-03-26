// features/profiles/store/useProfileStore.ts
import { create } from "zustand";
import type { Profile, UpdateProfileData } from "../types";
import { fetchProfileById, updateProfile, deleteAvatar } from "../api/profiles";

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  isUpdating: boolean;

  loadProfile: (userId: string) => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  removeAvatar: (userId: string) => Promise<void>;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,
  isUpdating: false,

  loadProfile: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await fetchProfileById(userId);
      set({ profile, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateProfile: async (data: UpdateProfileData) => {
    set({ isUpdating: true, error: null });
    try {
      const updatedProfile = await updateProfile(data);
      set({ profile: updatedProfile, isUpdating: false });
    } catch (error) {
      set({ error: (error as Error).message, isUpdating: false });
      throw error;
    }
  },

  removeAvatar: async (userId: string) => {
    set({ isUpdating: true, error: null });
    try {
      await deleteAvatar(userId);
      set((state) => ({
        profile: state.profile ? { ...state.profile, avatar_url: null } : null,
        isUpdating: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isUpdating: false });
      throw error;
    }
  },

  clearProfile: () => {
    set({ profile: null, isLoading: false, error: null, isUpdating: false });
  },
}));
