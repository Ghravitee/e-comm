// features/products/hooks/useProductRating.ts
import { useContext } from "react";
import { ProductRatingsContext } from "../context/ProductRatingsContext";

export const useProductRating = (productId: string) => {
  const context = useContext(ProductRatingsContext);
  if (!context) {
    throw new Error(
      "useProductRating must be used within ProductRatingsProvider",
    );
  }
  return {
    rating: context.getRating(productId),
    isLoading: context.isLoading,
  };
};
