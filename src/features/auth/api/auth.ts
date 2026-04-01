// features/auth/api/auth.ts
import { supabase } from "../../../services/supabase/client";

export interface SignUpData {
  email: string;
  password: string;
}

export const checkUserExistsDB = async (email: string): Promise<boolean> => {
  const { data, error } = await supabase.rpc("check_user_exists", {
    user_email: email,
  });

  if (error) {
    console.error("Error checking user existence:", error);
    return false;
  }

  return data || false;
};

export const signUp = async ({ email, password }: SignUpData) => {
  // Check if user already exists in auth.users
  const exists = await checkUserExistsDB(email);

  if (exists) {
    throw new Error("User already registered");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
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

// Google OAuth
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      // Use popup mode to stay on the same page
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) throw error;
  return data;
};

// Logout (unchanged)
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
