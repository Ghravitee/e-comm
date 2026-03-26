// features/profiles/hooks/useCompleteProfile.ts
import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "../api/profiles";
import type { UpdateProfileData } from "../types";

export const useCompleteProfile = () => {
  return useMutation({
    mutationFn: (data: UpdateProfileData) => updateProfile(data),
  });
};
