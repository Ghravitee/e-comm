// features/products/components/ProductDetails.tsx
import React, { useState } from "react";
import { type Product } from "../types";
import { useCartStore } from "../../cart/store/useCartStore";
import {
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Check,
  Star,
  Link,
} from "lucide-react";
import { useFavorites } from "../../favorites/hooks/useFavorites";
import { RatingStars } from "../../reviews/components/RatingStars";
import { ReviewCard } from "../../reviews/components/ReviewCard";
import {
  useProductReviews,
  useProductAverageRating,
  useHasUserReviewed,
  useCreateReview,
  useHasUserPurchased,
} from "../../reviews/hooks/useReviews";
import { useAuth } from "../../auth/hooks/useAuth";
import toast from "react-hot-toast";
import { devError } from "../../../shared/utils/logger";

interface Props {
  product: Product;
}

// Simple Review Form Component
const ReviewFormSimple: React.FC<{
  productName: string;
  onSubmit: (rating: number, comment: string) => Promise<void>;
  onCancel: () => void;
  canReview?: boolean;
}> = ({ productName, onSubmit, onCancel, canReview = true }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a review");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(rating, comment);
    } catch (error) {
      devError("Failed to submit review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canReview) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <p className="text-gray-500">
          You can only review products you've purchased and received.
        </p>
        <Link
          to="/orders"
          className="text-primary hover:underline mt-2 inline-block"
        >
          View Your Orders
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Review: {productName}
      </h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Rating *
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none"
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  star <= (hoverRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Review *
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          placeholder="Share your experience with this product..."
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/80 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export const ProductDetails: React.FC<Props> = ({ product }) => {
  const addToCart = useCartStore((state) => state.addItem);
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();

  // React Query hooks for reviews
  const { data: reviews, isLoading: isLoadingReviews } = useProductReviews(
    product.id,
  );
  const { data: avgRating } = useProductAverageRating(product.id);
  const { data: hasReviewed, isLoading: isLoadingUserReview } =
    useHasUserReviewed(product.id, user?.id);
  const { data: hasPurchased } = useHasUserPurchased(product.id, user?.id);

  const createReviewMutation = useCreateReview();

  const isFav = isFavorite(product.id);

  const handleSubmitReview = async (rating: number, comment: string) => {
    if (!user) return;
    await createReviewMutation.mutateAsync({
      userId: user.id,
      data: {
        product_id: product.id,
        rating,
        comment,
      },
    });
    setShowReviewForm(false);
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
    });

    setAddedToCart(true);
    toast.success(`${quantity} × ${product.name} added to cart!`, {
      duration: 2000,
      position: "bottom-center",
    });

    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleQuantityChange = (type: "increment" | "decrement") => {
    if (type === "increment") {
      setQuantity((prev) => Math.min(prev + 1, 99));
    } else {
      setQuantity((prev) => Math.max(prev - 1, 1));
    }
  };

  const handleToggleFavorite = async () => {
    if (isTogglingFavorite) return;

    setIsTogglingFavorite(true);
    const wasFavorite = isFav;

    try {
      await toggleFavorite(product.id, product);

      if (wasFavorite) {
        toast.success(`Removed ${product.name} from favorites`, {
          duration: 2000,
          position: "bottom-center",
          icon: "💔",
        });
      } else {
        toast.success(`${product.name} added to favorites!`, {
          duration: 2000,
          position: "bottom-center",
          icon: "❤️",
        });
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      toast.error("Failed to update favorites. Please try again.", {
        duration: 3000,
        position: "bottom-center",
      });
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const isUserLoading = isLoadingUserReview;
  const hasUserReviewedValue = hasReviewed || false;

  return (
    <div className="space-y-12">
      {/* Product Info Section */}
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image Gallery */}
        <div className="space-y-4">
          <div className="relative group">
            <img
              src={product.image || "https://via.placeholder.com/600x600"}
              alt={product.name}
              className="w-full rounded-lg object-cover border border-gray-200"
            />
            <button
              onClick={handleToggleFavorite}
              disabled={isTogglingFavorite}
              className={`absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all ${
                isTogglingFavorite ? "opacity-50 cursor-wait" : ""
              }`}
            >
              <Heart
                className={`w-6 h-6 transition-colors ${
                  isFav ? "fill-red-500 text-red-500" : "text-gray-600"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
            {product.name}
          </h1>

          {/* Rating Display */}
          {avgRating && avgRating.count > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <RatingStars rating={avgRating.avg} size={18} />
              <span className="text-sm text-gray-500">
                ({avgRating.count}{" "}
                {avgRating.count === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="mt-4">
            <p className="text-2xl md:text-3xl font-bold text-primary">
              ₦{product.price.toLocaleString()}
            </p>
          </div>

          {/* Stock Status */}
          <div className="mt-4">
            <span className="inline-flex items-center gap-2 text-sm text-green-600">
              <span className="w-2 h-2 bg-green-600 rounded-full"></span>
              In Stock
            </span>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Description
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Quantity
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange("decrement")}
                  disabled={quantity === 1}
                  className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange("increment")}
                  disabled={quantity === 99}
                  className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                addedToCart
                  ? "bg-green-600 text-white"
                  : "bg-primary text-white hover:bg-primary/80"
              }`}
            >
              {addedToCart ? (
                <>
                  <Check className="w-5 h-5" />
                  Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </>
              )}
            </button>
            <button
              onClick={handleToggleFavorite}
              disabled={isTogglingFavorite}
              className={`flex items-center justify-center gap-2 px-6 py-3 border rounded-lg font-medium transition-colors ${
                isTogglingFavorite
                  ? "opacity-50 cursor-wait"
                  : "hover:bg-gray-50"
              } ${
                isFav
                  ? "border-red-200 bg-red-50 text-red-600"
                  : "border-gray-300 text-gray-600"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${
                  isFav ? "fill-red-500 text-red-500" : "text-gray-600"
                }`}
              />
              {isFav ? "Added to Favorites" : "Add to Favorites"}
            </button>
          </div>

          {/* Product Features */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Free Shipping
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                30-Day Returns
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Quick Delivery
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                Secure Payment
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t border-gray-100 pt-8 md:pt-12">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="text-center sm:text-left">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
              Customer Reviews
            </h2>
            {avgRating && avgRating.count > 0 && (
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                <RatingStars rating={avgRating.avg} size={16} />
                <span className="text-xs md:text-sm text-gray-500">
                  Based on {avgRating.count}{" "}
                  {avgRating.count === 1 ? "review" : "reviews"}
                </span>
              </div>
            )}
          </div>

          {user &&
            !isUserLoading &&
            !hasUserReviewedValue &&
            !showReviewForm &&
            hasPurchased && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary/80 transition-colors text-sm md:text-base w-full sm:w-auto"
              >
                Write a Review
              </button>
            )}

          {user && !isUserLoading && !hasUserReviewedValue && !hasPurchased && (
            <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <p className=" text-sm">
                You can only review products you've purchased and received.
              </p>
            </div>
          )}

          {/* <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm text-red-700">{serverError}</p>
            </div>
          </div> */}
        </div>

        {showReviewForm && (
          <div className="mt-4 mb-6">
            <ReviewFormSimple
              productName={product.name}
              onSubmit={handleSubmitReview}
              onCancel={() => setShowReviewForm(false)}
            />
          </div>
        )}

        <div className="space-y-4 mt-6">
          {isLoadingReviews ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 bg-gray-100 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : !reviews || reviews.length === 0 ? (
            <div className="text-center py-8 md:py-12 bg-gray-50 rounded-xl px-4">
              <p className="text-gray-500 text-sm md:text-base">
                No reviews yet. Be the first to review this product!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
