// features/products/components/ProductCard.tsx
import React, { useState, useEffect } from "react";
import { type Product } from "../types";
import { Link } from "react-router-dom";
import { useCartStore } from "../../cart/store/useCartStore";
import { useFavorites } from "../../favorites/hooks/useFavorites";
import { Heart, Check } from "lucide-react";
import { BlurImage } from "../../../shared/components/BlurImage";
import { RatingStars } from "../../reviews/components/RatingStars";
import { getProductAverageRating } from "../../reviews/api/reviewsApi";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface Props {
  product: Product;
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  const addToCart = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  const { toggleFavorite, isFavorite } = useFavorites();

  const [showAddedFeedback, setShowAddedFeedback] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  // Get product rating
  const { data: ratingData } = useQuery({
    queryKey: ["product-rating", product.id],
    queryFn: () => getProductAverageRating(product.id),
    staleTime: 5 * 60 * 1000,
  });

  // Get current quantity of this product in cart
  const cartItem = items.find((item) => item.id === product.id);
  const quantityInCart = cartItem?.quantity || 0;

  // Reset feedback after 2 seconds
  useEffect(() => {
    if (showAddedFeedback) {
      const timer = setTimeout(() => {
        setShowAddedFeedback(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showAddedFeedback]);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });

    setShowAddedFeedback(true);
    toast.success(`${product.name} added to cart!`, {
      duration: 2000,
      position: "bottom-center",
      icon: "🛒",
    });
  };

  const handleToggleFavorite = async () => {
    if (isTogglingFavorite) return;

    setIsTogglingFavorite(true);
    const wasFavorite = isFavorite(product.id);

    try {
      await toggleFavorite(product.id, product);

      if (wasFavorite) {
        toast.success(`Removed ${product.name} from favorites`, {
          duration: 2000,
          position: "bottom-right",
        });
      } else {
        toast.success(`${product.name} added to favorites!`, {
          duration: 2000,
          position: "bottom-right",
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

  const isFav = isFavorite(product.id);

  return (
    <div className="group flex flex-col">
      <div className="relative">
        <Link to={`/products/${product.id}`}>
          <BlurImage
            src={product.image}
            alt={product.name}
            className="w-full h-72 object-cover rounded-md"
          />
        </Link>

        {/* Favorite Button - Top Right */}
        <button
          onClick={handleToggleFavorite}
          disabled={isTogglingFavorite}
          className={`absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all ${
            isTogglingFavorite ? "opacity-50 cursor-wait" : ""
          }`}
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFav ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md flex items-center justify-center">
          <button
            onClick={handleAddToCart}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showAddedFeedback
                ? "bg-green-500 text-white"
                : "bg-white text-primary hover:bg-gray-100"
            }`}
          >
            {showAddedFeedback ? (
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4" />
                Added!
              </span>
            ) : (
              "Add to Cart"
            )}
          </button>
        </div>
      </div>

      <Link to={`/products/${product.id}`}>
        <h3 className="mt-4 font-bold text-gray-900 text-sm">{product.name}</h3>
      </Link>

      {/* Rating Display */}
      {ratingData && ratingData.count > 0 && (
        <div className="flex items-center gap-2 mt-1">
          <RatingStars rating={ratingData.avg} size={14} />
          <span className="text-xs text-gray-500">({ratingData.count})</span>
        </div>
      )}

      <p className="font-semibold mt-1 mb-3 text-sm text-gray-700">
        ₦{product.price.toLocaleString()}
      </p>

      <div className="flex gap-2 mt-auto">
        {/* Main Add to Cart Button with Absolute Positioned Badge */}
        <div className="relative flex-1">
          <button
            onClick={handleAddToCart}
            className={`w-full px-2 py-3 text-sm transition-all duration-200 font-medium flex items-center justify-center gap-2 ${
              showAddedFeedback
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-primary text-white hover:bg-primary/60"
            }`}
          >
            {showAddedFeedback ? "Added to Cart" : "Add to Cart"}
          </button>

          {/* Quantity Badge - Absolutely positioned */}
          {quantityInCart > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg ring-2 ring-white">
              {quantityInCart}
            </div>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          disabled={isTogglingFavorite}
          className={`p-3 transition-colors ${
            isTogglingFavorite ? "opacity-50 cursor-wait" : ""
          } ${
            isFav
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-primary text-white hover:bg-primary/60"
          }`}
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`w-5 h-5 ${isFav ? "fill-white" : ""}`} />
        </button>
      </div>
    </div>
  );
};
