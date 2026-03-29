// features/products/api/searchProducts.ts
import { supabase } from "../../../services/supabase/client";
import type { Product } from "../types";

export interface SearchParams {
  query: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
}

export const searchProducts = async (
  params: SearchParams,
): Promise<Product[]> => {
  let query = supabase.from("products").select("*");

  // Search by name or description
  if (params.query) {
    query = query.or(
      `name.ilike.%${params.query}%,description.ilike.%${params.query}%`,
    );
  }

  // Filter by category
  if (params.category && params.category !== "all") {
    query = query.eq("category", params.category);
  }

  // Filter by price range
  if (params.minPrice !== undefined) {
    query = query.gte("price", params.minPrice);
  }
  if (params.maxPrice !== undefined) {
    query = query.lte("price", params.maxPrice);
  }

  // Limit results
  if (params.limit) {
    query = query.limit(params.limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Product[];
};

// For autocomplete suggestions
export const searchSuggestions = async (
  query: string,
  limit: number = 5,
): Promise<Product[]> => {
  if (!query || query.length < 2) return [];

  const { data, error } = await supabase
    .from("products")
    .select("id, name, image, price")
    .ilike("name", `%${query}%`)
    .limit(limit);

  if (error) throw error;
  return data as Product[];
};
