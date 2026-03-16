import React from "react";
import { type Product } from "../types";
import { Link } from "react-router-dom";
import { useCartStore } from "../../cart/store/useCartStore";

interface Props {
  product: Product;
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  const addToCart = useCartStore((state) => state.addItem);

  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition">
      <Link to={`/products/${product.id}`}>
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-52 object-cover rounded-md"
        />
      </Link>

      <Link to={`/products/${product.id}`}>
        <h3 className="mt-4 font-semibold text-gray-900">{product.name}</h3>
      </Link>

      <p className="text-green-600 font-bold mt-1">${product.price}</p>

      {/* Button is outside any Link, so no propagation needed */}
      <button
        onClick={() =>
          addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image_url,
            quantity: 1,
          })
        }
        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
      >
        Add to Cart
      </button>
    </div>
  );
};
