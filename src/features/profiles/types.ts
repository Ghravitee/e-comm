export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  email?: string;
};
