// features/favorites/api/favoritesApi.ts
import { supabase } from "../../../services/supabase/client";
import type { FavoriteWithProduct } from "../types";

export const getFavorites = async (
  userId: string,
): Promise<FavoriteWithProduct[]> => {
  const { data, error } = await supabase
    .from("user_favorites")
    .select(
      `
      *,
      product:products(*)
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

export const addFavorite = async (
  userId: string,
  productId: string,
): Promise<void> => {
  const { error } = await supabase
    .from("user_favorites")
    .insert({ user_id: userId, product_id: productId });

  if (error) throw error;
};

export const removeFavorite = async (
  userId: string,
  productId: string,
): Promise<void> => {
  const { error } = await supabase
    .from("user_favorites")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (error) throw error;
};

export const checkIsFavorite = async (
  userId: string,
  productId: string,
): Promise<boolean> => {
  const { data, error } = await supabase
    .from("user_favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
};
