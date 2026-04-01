// features/products/hooks/useUpdateProduct.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../services/supabase/client";
import type { Product } from "../types";

const updateProduct = async (product: Partial<Product> & { id: string }) => {
  const { data, error } = await supabase
    .from("products")
    .update(product)
    .eq("id", product.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({
        queryKey: ["product", updatedProduct.id],
        // It invalidates both the list cache AND the individual product cache —
        // so the product details page also updates immediately.
      });
    },
  });
};
