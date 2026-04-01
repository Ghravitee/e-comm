// features/products/hooks/useSearchProducts.ts
import { useQuery } from "@tanstack/react-query";
import { searchProducts, searchSuggestions } from "../api/searchProducts";
// import type { Product } from "../types";
import { useState, useEffect } from "react";

export const useSearchProducts = (params: {
  query: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}) => {
  return useQuery({
    queryKey: ["search", params],
    queryFn: () => searchProducts(params),
    enabled: params.query.length > 0,
    staleTime: 1000 * 30,
  });
};

export const useSearchSuggestions = (query: string) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce to avoid too many requests
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return useQuery({
    queryKey: ["suggestions", debouncedQuery],
    queryFn: () => searchSuggestions(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 1000 * 30,
  });
};

// Debouncing prevents a network request on every keystroke. I delay updating the query by 300ms and cancel the timer
// if the user keeps typing. Only when they pause does the actual search fire — reducing Supabase calls dramatically.
