// features/reviews/hooks/useReviews.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProductReviews,
  getProductAverageRating,
  createReview,
  hasUserReviewed,
  hasUserPurchasedProduct,
} from "../api/reviewsApi";
import type { CreateReviewData } from "../types";
import toast from "react-hot-toast";

// Hook to get product reviews
export const useProductReviews = (productId: string) => {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => getProductReviews(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get product average rating
export const useProductAverageRating = (productId: string) => {
  return useQuery({
    queryKey: ["product-rating", productId],
    queryFn: () => getProductAverageRating(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook to check if user has reviewed
export const useHasUserReviewed = (productId: string, userId?: string) => {
  return useQuery({
    queryKey: ["user-review", productId, userId],
    queryFn: () => hasUserReviewed(productId, userId!),
    enabled: !!productId && !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useHasUserPurchased = (productId: string, userId?: string) => {
  return useQuery({
    queryKey: ["user-purchased", productId, userId],
    queryFn: () => hasUserPurchasedProduct(userId!, productId),
    enabled: !!productId && !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook to create a review
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: CreateReviewData;
    }) => createReview(userId, data),
    onSuccess: (_, variables) => {
      // Invalidate and refetch reviews
      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.data.product_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["product-rating", variables.data.product_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-review", variables.data.product_id],
      });
      toast.success("Review submitted! Thank you!");
    },
    onError: (error) => {
      console.error("Failed to submit review:", error);
      toast.error("Failed to submit review. Please try again.");
    },
  });
};
