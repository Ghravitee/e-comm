import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/getProducts";
import type { Product } from "../types";

export const useProducts = () => {
  return useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 1000 * 60, // cache for 1 minute
  });
};
