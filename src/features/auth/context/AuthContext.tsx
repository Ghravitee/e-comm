/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext } from "react";

type Profile = {
  id: string;
  is_admin: boolean;
  full_name?: string;
  avatar_url?: string;
};

type AuthContextType = {
  user: any;
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

export const useAuth = () => useContext(AuthContext);
