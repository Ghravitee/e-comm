// import React from "react";
// import { type Product } from "../types";
// import { Link } from "react-router-dom";
// import { useCartStore } from "../../cart/store/useCartStore";

// interface Props {
//   product: Product;
// }

// export const ProductCard: React.FC<Props> = ({ product }) => {
//   const addToCart = useCartStore((state) => state.addItem);

//   return (
//     <div className="">
//       <div className="">
//         <Link to={`/products/${product.id}`}>
//           <img
//             src={product.image}
//             alt={product.name}
//             className="w-full h-72 object-cover rounded-md"
//           />
//         </Link>
//         <Link to={`/products/${product.id}`}>
//           <h3 className="mt-4 font-bold text-gray-900 text-sm">
//             {product.name}
//           </h3>
//         </Link>
//         <p className="font-semibold mt-1 mb-3 text-sm text-gray-700">
//           &#8358;{product.price.toLocaleString()}
//         </p>
//         {/* Button is outside any Link, so no propagation needed */}
//         <button
//           onClick={() =>
//             addToCart({
//               id: product.id,
//               name: product.name,
//               price: product.price,
//               image: product.image,
//               quantity: 1,
//             })
//           }
//           className="bg-primary text-white px-6 py-3  hover:bg-primary/60"
//         >
//           Add to Cart
//         </button>
//       </div>
//     </div>
//   );
// };

import React from "react";
import { type Product } from "../types";
import { Link } from "react-router-dom";
import { useCartStore } from "../../cart/store/useCartStore";
import { Heart } from "lucide-react";

interface Props {
  product: Product;
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  const addToCart = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };

  const handleAddToFavorites = () => {
    // TODO: Implement favorites functionality
    console.log("Add to favorites:", product.id);
  };

  return (
    <div className="group flex flex-col">
      <div className="relative">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-72 object-cover rounded-md"
          />
        </Link>

        {/* Overlay - appears on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md flex items-center justify-center">
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              className="bg-white text-primary px-4 py-2 rounded-lg hover:bg-gray-100 font-medium transition-colors"
            >
              Add to Cart
            </button>
            <button
              onClick={handleAddToFavorites}
              className="bg-white text-primary p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Add to favorites"
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <Link to={`/products/${product.id}`}>
        <h3 className="mt-4 font-bold text-gray-900 text-sm">{product.name}</h3>
      </Link>

      <p className="font-semibold mt-1 mb-3 text-sm text-gray-700">
        &#8358;{product.price.toLocaleString()}
      </p>

      {/* Buttons below the price */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={handleAddToCart}
          className="bg-primary text-white px-6 py-3 hover:bg-primary/60 flex-1"
        >
          Add to Cart
        </button>
        <button
          onClick={handleAddToFavorites}
          className="bg-primary text-white p-3 hover:bg-primary/60"
          aria-label="Add to favorites"
        >
          <Heart className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
