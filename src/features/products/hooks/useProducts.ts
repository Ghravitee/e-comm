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
