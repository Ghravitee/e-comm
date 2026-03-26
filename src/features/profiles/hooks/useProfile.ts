import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../auth/hooks/useAuth";
import { fetchProfileById } from "../api/profiles";
import type { Profile } from "../types";

export const useProfile = () => {
  const { user } = useAuth();

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery<Profile | null>({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      return await fetchProfileById(user.id);
    },
    enabled: !!user,
    retry: 1,
  });

  return {
    profile,
    loading: isLoading,
    error,
  };
};
