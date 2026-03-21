/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "../../../services/supabase/client";
import type { Profile } from "../types";

export const fetchProfileById = async (
  userId: string,
): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, is_admin, full_name, avatar_url, email")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data as Profile;
};

// Optional: fetch all admins
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

export const updateProfile = async (fullName: string, avatarFile?: File) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  let avatarUrl;

  if (avatarFile) {
    const fileExt = avatarFile.name.split(".").pop();
    // Change this: Include user ID in the folder structure
    // From: `${user.id}_${Date.now()}.${fileExt}`
    // To:   `${user.id}/${Date.now()}.${fileExt}`
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, avatarFile);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
    avatarUrl = data.publicUrl;
  }

  const updates: any = {
    full_name: fullName,
  };

  if (avatarUrl) {
    updates.avatar_url = avatarUrl;
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (updateError) throw updateError;
};
