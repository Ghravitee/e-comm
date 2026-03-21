// features/products/hooks/useCreateProduct.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "../api/createProduct";
import type { CreateProductInput } from "../api/createProduct";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData: CreateProductInput) => {
      console.log("useCreateProduct mutationFn called with:", productData);
      const result = await createProduct(productData);
      console.log("useCreateProduct result:", result);
      return result;
    },
    onSuccess: (data) => {
      console.log("Product created successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      console.error("Product creation error:", error);
    },
  });
};
