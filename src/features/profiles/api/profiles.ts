/* eslint-disable @typescript-eslint/no-explicit-any */
// features/profiles/api/profiles.ts
import { supabase } from "../../../services/supabase/client";
import type { Profile, UpdateProfileData } from "../types";

export const fetchProfileById = async (
  userId: string,
): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, is_admin, full_name, avatar_url, email, created_at, updated_at",
    )
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data as Profile;
};

// features/profiles/api/profiles.ts
export const updateProfile = async (
  data: UpdateProfileData,
): Promise<Profile> => {
  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const updates: any = {
    full_name: data.full_name,
    updated_at: new Date().toISOString(),
  };

  // Handle avatar upload if provided
  if (data.avatar_file) {
    const fileExt = data.avatar_file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, data.avatar_file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);
    updates.avatar_url = urlData.publicUrl;
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (updateError) throw updateError;

  // Return updated profile
  const updatedProfile = await fetchProfileById(user.id);
  if (!updatedProfile) throw new Error("Failed to fetch updated profile");

  return updatedProfile;
};

export const deleteAvatar = async (userId: string): Promise<void> => {
  // Get current profile to find avatar URL
  const profile = await fetchProfileById(userId);

  if (profile?.avatar_url) {
    // Extract file path from URL
    const urlParts = profile.avatar_url.split("/");
    const filePath = urlParts.slice(urlParts.indexOf("avatars") + 1).join("/");

    if (filePath) {
      await supabase.storage.from("avatars").remove([filePath]);
    }
  }

  // Update profile to remove avatar_url
  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: null })
    .eq("id", userId);

  if (error) throw error;
};

export const fetchAdmins = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, email")
    .eq("is_admin", true);

  if (error) {
    console.error("Failed to fetch admins:", error);
    return [];
  }

  return data as Profile[];
};

export const changePassword = async (newPassword: string): Promise<void> => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
};
