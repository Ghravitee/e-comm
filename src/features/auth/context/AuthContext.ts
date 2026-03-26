import { createContext } from "react";

export type Profile = {
  id: string;
  is_admin: boolean;
  full_name?: string;
  avatar_url?: string;
};

export type AuthContextType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
