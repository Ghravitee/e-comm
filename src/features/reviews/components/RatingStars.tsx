// features/reviews/components/RatingStars.tsx
import React from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  size?: number;
  onClick?: (rating: number) => void;
  interactive?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  size = 16,
  onClick,
  interactive = false,
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  const handleClick = (value: number) => {
    if (interactive && onClick) {
      onClick(value);
    }
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          disabled={!interactive}
          className={interactive ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            size={size}
            className={`${
              star <= (hoverRating || rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            } ${interactive ? "transition-colors" : ""}`}
          />
        </button>
      ))}
    </div>
  );
};
