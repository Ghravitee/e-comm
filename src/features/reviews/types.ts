// features/reviews/types/index.ts
export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewWithUser extends Review {
  user: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface CreateReviewData {
  product_id: string;
  rating: number;
  comment: string;
}
