import { supabase } from "../../../services/supabase/client";
import { type CartItem } from "../store/useCartStore";

export const getCartFromBackend = async (userId: string) => {
  const { data, error } = await supabase
    .from("user_carts")
    .select("items")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") throw error; // only throw unexpected errors

  return data?.items ?? []; // if no row, return empty array
};

export const saveCartToBackend = async (userId: string, items: CartItem[]) => {
  const { error } = await supabase.from("user_carts").upsert(
    {
      user_id: userId,
      items,
    },
    {
      onConflict: "user_id",
    },
  );

  if (error) throw error;
};
