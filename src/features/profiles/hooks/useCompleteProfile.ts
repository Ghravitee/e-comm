// features/profiles/hooks/useCompleteProfile.ts
import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "../api/profiles";
import type { UpdateProfileData } from "../types";
import { useQueryClient } from "@tanstack/react-query";

// export const useCompleteProfile = () => {
//   return useMutation({
//     mutationFn: (data: UpdateProfileData) => updateProfile(data),
//   });
// };

export const useCompleteProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileData) => updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    // This tells React Query to refetch profile data
    // after a successful update, keeping the UI in sync.
  });
};
