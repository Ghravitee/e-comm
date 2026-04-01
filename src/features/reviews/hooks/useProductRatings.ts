// features/reviews/hooks/useProductRatings.ts
import { useQuery } from "@tanstack/react-query";
import { getMultipleProductRatings } from "../api/reviewsApi";

interface UseProductRatingsOptions {
  productIds: string[];
  enabled?: boolean;
}

export const useProductRatings = ({
  productIds,
  enabled = true,
}: UseProductRatingsOptions) => {
  const {
    data: ratingsMap,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product-ratings", productIds.sort().join(",")],
    queryFn: () => getMultipleProductRatings(productIds),
    enabled: enabled && productIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  // Helper function to get rating for a specific product
  const getRating = (productId: string) => {
    return ratingsMap?.get(productId) || { avg: 0, count: 0 };
  };

  return {
    ratings: ratingsMap,
    getRating,
    isLoading,
    error,
  };
};
