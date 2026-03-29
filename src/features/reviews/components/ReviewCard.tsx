// features/reviews/components/ReviewCard.tsx
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { RatingStars } from "./RatingStars";
import type { ReviewWithUser } from "../types";

interface ReviewCardProps {
  review: ReviewWithUser;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const timeAgo = formatDistanceToNow(new Date(review.created_at), {
    addSuffix: true,
  });

  // Debug log to see what data is being passed
  console.log("ReviewCard received:", {
    reviewId: review.id,
    userId: review.user_id,
    user: review.user,
    fullName: review.user?.full_name,
    avatarUrl: review.user?.avatar_url,
  });

  const getUserInitial = () => {
    if (review.user?.full_name) {
      return review.user.full_name.charAt(0).toUpperCase();
    }
    return "U";
  };

  const displayName = review.user?.full_name || "Anonymous User";
  const hasAvatar = !!review.user?.avatar_url;

  return (
    <div className="border-b border-gray-100 py-4 last:border-0">
      {/* User Info Section */}
      <div className="flex items-center gap-3 mb-2">
        {/* Avatar */}
        <div className="shrink-0">
          {hasAvatar ? (
            <img
              src={review.user.avatar_url || undefined}
              alt={displayName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-medium text-primary">
                {getUserInitial()}
              </span>
            </div>
          )}
        </div>

        {/* User Name and Rating */}
        <div>
          <p className="text-sm font-medium text-gray-900">{displayName}</p>
          <div className="flex items-center gap-2">
            <RatingStars rating={review.rating} size={14} />
            <span className="text-xs text-gray-400">{timeAgo}</span>
          </div>
        </div>
      </div>

      {/* Review Comment */}
      <p className="text-gray-600 text-sm mt-2 ml-11">{review.comment}</p>
    </div>
  );
};
