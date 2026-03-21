import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "../api/profiles";

export const useCompleteProfile = () => {
  return useMutation({
    mutationFn: ({ fullName, avatar }: { fullName: string; avatar?: File }) =>
      updateProfile(fullName, avatar),
  });
};
