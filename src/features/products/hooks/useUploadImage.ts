// features/products/hooks/useUploadImage.ts
import { useMutation } from "@tanstack/react-query";
import { uploadProductImage } from "../api/uploadImage";

export const useUploadImage = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      console.log("useUploadImage mutationFn called with:", file.name);
      try {
        const result = await uploadProductImage(file);
        console.log("useUploadImage result:", result);
        return result;
      } catch (error) {
        console.error("useUploadImage error:", error);
        throw error;
      }
    },
    onError: (error) => {
      console.error("Image upload error:", error);
    },
  });
};
