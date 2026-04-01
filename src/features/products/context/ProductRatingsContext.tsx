// features/products/context/ProductRatingsContext.ts
import { createContext } from "react";

export interface ProductRatingsContextValue {
  getRating: (productId: string) => { avg: number; count: number };
  isLoading: boolean;
}

export const ProductRatingsContext = createContext<
  ProductRatingsContextValue | undefined
>(undefined);
