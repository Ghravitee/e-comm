// features/auth/api/auth.ts
import { supabase } from "../../../services/supabase/client";

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  avatarFile?: File;
}

export const signUp = async ({ email, password }: SignUpData) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  return data;
};

// Login (unchanged)
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

// Google OAuth (unchanged)
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  if (error) throw error;
  return data;
};

// Logout (unchanged)
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
