import React, { useState } from "react";
import { type Product } from "../types";
import { useCartStore } from "../../cart/store/useCartStore";
import { Heart, ShoppingCart, Minus, Plus, Check } from "lucide-react";
import { useFavorites } from "../../favorites/hooks/useFavorites";

interface Props {
  product: Product;
}

export const ProductDetails: React.FC<Props> = ({ product }) => {
  const addToCart = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
  const isFav = isFavorite(product.id);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleQuantityChange = (type: "increment" | "decrement") => {
    if (type === "increment") {
      setQuantity((prev) => Math.min(prev + 1, 99));
    } else {
      setQuantity((prev) => Math.max(prev - 1, 1));
    }
  };

  return (
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
            onClick={() => toggleFavorite(product.id, product)}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
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
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
        </div>

        {/* Quantity Selector */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
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
            onClick={() => toggleFavorite(product.id, product)}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
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
  );
};
