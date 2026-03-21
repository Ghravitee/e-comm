import React, { useState } from "react";
import { useProducts } from "../../features/products/hooks/useProducts";
import { ProductGrid } from "../../features/products/components/ProductGrid";

// Extracted FeaturedProducts component
const FeaturedProducts: React.FC = () => {
  const { data: products, isLoading, isError } = useProducts();
  const [showAll, setShowAll] = useState(false);

  const initialDisplayCount = 4;
  const displayedProducts = showAll
    ? products
    : products?.slice(0, initialDisplayCount);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading products...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">
          Failed to load products. Please try again later.
        </p>
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No products available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          Featured Product
        </h2>

        {/* {products.length > initialDisplayCount && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-primary hover:text-[#9f7828] font-medium transition-colors flex items-center gap-1"
          >
            {showAll ? "Show less" : `Show all (${products.length})`}
            <svg
              className={`w-4 h-4 transition-transform ${showAll ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        )} */}
      </div>

      <ProductGrid products={displayedProducts || []} />

      {!showAll && products.length > initialDisplayCount && (
        <div className="text-center mt-8">
          <button
            onClick={() => setShowAll(true)}
            className="bg-white border border-primary text-primary px-6 py-2 hover:bg-primary hover:text-white transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default FeaturedProducts;
