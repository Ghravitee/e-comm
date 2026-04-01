// features/products/hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/getProducts";
import type { Product } from "../types";

export interface UseProductsParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
}

export const useProducts = (params?: UseProductsParams) => {
  return useQuery<Product[], Error>({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
    staleTime: 1000 * 60,
  });
};

// The query key includes the full params object so React Query treats every
// unique filter combination as a separate cache entry. Filtering
// by bedroom and then switching to dining hits the cache for dining
// if you've been there before — no extra network request.
