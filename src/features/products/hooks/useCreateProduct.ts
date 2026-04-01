// features/products/hooks/useCreateProduct.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "../api/createProduct";
import type { CreateProductInput } from "../api/createProduct";
import { devError, devLog } from "../../../shared/utils/logger";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData: CreateProductInput) => {
      devLog("useCreateProduct mutationFn called with:", productData);
      const result = await createProduct(productData);
      devLog("useCreateProduct result:", result);
      return result;
    },
    onSuccess: (data) => {
      devLog("Product created successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      devError("Product creation error:", error);
    },
  });
};

// After any write operation, the products cache is invalidated — forcing React Query to refetch.
// This ensures the UI always reflects the latest database state after a create, update, or delete.
