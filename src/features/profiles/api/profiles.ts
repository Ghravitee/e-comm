// features/profiles/api/profiles.ts
import { supabase } from "../../../services/supabase/client";
import type { Profile, UpdateProfileData } from "../types";

// Throw error instead of returning null
export const fetchProfileById = async (userId: string): Promise<Profile> => {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, is_admin, full_name, avatar_url, email, created_at, updated_at",
    )
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    throw new Error(`Failed to fetch profile: ${error.message}`);
  }

  if (!data) {
    throw new Error(`Profile not found for user: ${userId}`);
  }

  return data as Profile;
};

// ✅ FIXED: Consistent - always throws on error
export const updateProfile = async (
  data: UpdateProfileData,
): Promise<Profile> => {
  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(`Authentication error: ${userError.message}`);
  }

  if (!user) {
    throw new Error("Not authenticated");
  }

  const updates: Partial<Profile> = {
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

    if (uploadError) {
      throw new Error(`Failed to upload avatar: ${uploadError.message}`);
    }

    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);
    updates.avatar_url = urlData.publicUrl;
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (updateError) {
    throw new Error(`Failed to update profile: ${updateError.message}`);
  }

  // Return updated profile - this will throw if fetch fails
  const updatedProfile = await fetchProfileById(user.id);
  return updatedProfile;
};

// ✅ FIXED: Consistent - always throws on error
export const deleteAvatar = async (userId: string): Promise<void> => {
  try {
    // Get current profile to find avatar URL
    const profile = await fetchProfileById(userId);

    if (profile?.avatar_url) {
      // Extract file path from URL
      const urlParts = profile.avatar_url.split("/");
      const filePath = urlParts
        .slice(urlParts.indexOf("avatars") + 1)
        .join("/");

      if (filePath) {
        const { error: removeError } = await supabase.storage
          .from("avatars")
          .remove([filePath]);

        if (removeError) {
          throw new Error(`Failed to remove avatar: ${removeError.message}`);
        }
      }
    }

    // Update profile to remove avatar_url
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: null })
      .eq("id", userId);

    if (updateError) {
      throw new Error(`Failed to update profile: ${updateError.message}`);
    }
  } catch (error) {
    console.error("Error in deleteAvatar:", error);
    throw error; // Re-throw to let caller handle it
  }
};

// ✅ FIXED: Throw error instead of returning empty array
export const fetchAdmins = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, email")
    .eq("is_admin", true);

  if (error) {
    console.error("Failed to fetch admins:", error);
    throw new Error(`Failed to fetch admins: ${error.message}`);
  }

  return data as Profile[];
};

// ✅ Already correct - throws error
export const changePassword = async (newPassword: string): Promise<void> => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw new Error(`Failed to change password: ${error.message}`);
  }
};
