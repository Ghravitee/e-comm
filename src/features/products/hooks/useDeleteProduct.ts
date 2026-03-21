// features/products/hooks/useDeleteProduct.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../services/supabase/client";

const deleteProduct = async (id: string) => {
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) throw error;
  return id;
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
