// features/products/context/ProductRatingsProvider.tsx
import { type ReactNode } from "react";
import { useProductRatings } from "../../reviews/hooks/useProductRatings";
import { ProductRatingsContext } from "./ProductRatingsContext";

interface ProductRatingsProviderProps {
  children: ReactNode;
  productIds: string[];
}

export const ProductRatingsProvider = ({
  children,
  productIds,
}: ProductRatingsProviderProps) => {
  const { getRating, isLoading } = useProductRatings({ productIds });

  return (
    <ProductRatingsContext value={{ getRating, isLoading }}>
      {children}
    </ProductRatingsContext>
  );
};
