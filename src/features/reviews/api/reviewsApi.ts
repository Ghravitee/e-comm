// features/reviews/api/reviewsApi.ts
import { supabase } from "../../../services/supabase/client";
import type { Review, CreateReviewData, ReviewWithUser } from "../types";

// Get all reviews for a product with user data
export const getProductReviews = async (
  productId: string,
): Promise<ReviewWithUser[]> => {
  // First, get all reviews
  const { data: reviews, error: reviewsError } = await supabase
    .from("product_reviews")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (reviewsError) throw reviewsError;
  if (!reviews || reviews.length === 0) return [];

  // Get all unique user IDs from reviews
  const userIds = [...new Set(reviews.map((review) => review.user_id))];

  // Fetch all profiles for these users
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .in("id", userIds);

  if (profilesError) throw profilesError;

  // Create a map of user profiles
  const userMap = new Map();
  profiles?.forEach((profile) => {
    userMap.set(profile.id, {
      id: profile.id,
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
    });
  });

  // Combine reviews with user data
  return reviews.map((review) => ({
    ...review,
    user: userMap.get(review.user_id) || {
      id: review.user_id,
      full_name: null,
      avatar_url: null,
    },
  }));
};

// Check if user has reviewed a product
export const hasUserReviewed = async (
  productId: string,
  userId: string,
): Promise<boolean> => {
  const { data, error } = await supabase
    .from("product_reviews")
    .select("id")
    .eq("product_id", productId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
};

// Create a new review
export const createReview = async (
  userId: string,
  data: CreateReviewData,
): Promise<Review> => {
  const { data: review, error } = await supabase
    .from("product_reviews")
    .insert({
      product_id: data.product_id,
      user_id: userId,
      rating: data.rating,
      comment: data.comment,
    })
    .select()
    .single();

  if (error) throw error;
  return review;
};

// Get average rating for a product
export const getProductAverageRating = async (
  productId: string,
): Promise<{ avg: number; count: number }> => {
  const { data, error } = await supabase
    .from("product_reviews")
    .select("rating")
    .eq("product_id", productId);

  if (error) throw error;

  if (!data || data.length === 0) {
    return { avg: 0, count: 0 };
  }

  const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
  const avg = sum / data.length;

  return { avg, count: data.length };
};
