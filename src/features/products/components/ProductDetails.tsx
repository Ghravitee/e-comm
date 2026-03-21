import React from "react";
import { type Product } from "../types";
import { useCartStore } from "../../cart/store/useCartStore";

interface Props {
  product: Product;
}

export const ProductDetails: React.FC<Props> = ({ product }) => {
  const addToCart = useCartStore((state) => state.addItem);
  return (
    <div className="grid md:grid-cols-2 gap-12">
      {/* Product Image */}
      <div>
        <img
          src={product.image || "https://via.placeholder.com/500"}
          alt={product.name}
          className="w-full h-full rounded-lg object-cover border border-gray-400"
        />
      </div>

      {/* Product Info */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

        <p className="text-2xl text-green-600 font-semibold mt-4">
          ${product.price}
        </p>

        <p className="text-gray-600 mt-6 leading-relaxed">
          {product.description}
        </p>

        <button
          onClick={() =>
            addToCart({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              quantity: 1,
            })
          }
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};
