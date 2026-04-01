import { createContext } from "react";
import type { User } from "@supabase/supabase-js";

export type Profile = {
  id: string;
  is_admin: boolean;
  full_name?: string;
  avatar_url?: string;
};

export type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean | undefined;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isAdmin: undefined,
  loading: true,
});
