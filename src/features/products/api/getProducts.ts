// features/products/api/getProducts.ts
import { supabase } from "../../../services/supabase/client";
import { type Product } from "../types";

interface GetProductsParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
}

export const getProducts = async (
  params?: GetProductsParams,
): Promise<Product[]> => {
  let query = supabase.from("products").select("*");

  // Apply search filter
  if (params?.search && params.search.trim()) {
    query = query.ilike("name", `%${params.search.trim()}%`);
  }

  // Apply category filter
  if (params?.category && params.category !== "all") {
    query = query.eq("category", params.category);
  }

  // Apply price filters
  if (params?.minPrice !== undefined) {
    query = query.gte("price", params.minPrice);
  }
  if (params?.maxPrice !== undefined) {
    query = query.lte("price", params.maxPrice);
  }

  // Apply sorting
  if (params?.sortBy) {
    switch (params.sortBy) {
      case "price-asc":
        query = query.order("price", { ascending: true });
        break;
      case "price-desc":
        query = query.order("price", { ascending: false });
        break;
      case "name-asc":
        query = query.order("name", { ascending: true });
        break;
      case "name-desc":
        query = query.order("name", { ascending: false });
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) throw error;
  return (data as Product[]) || [];
};

// Supabase's query builder uses method chaining — I build up filters conditionally
// without executing until the final await. This means if no filters are passed,
// I get all products. Each filter is optional and only applied when present.
