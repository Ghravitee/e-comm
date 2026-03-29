import React from "react";
import { useProducts } from "../../features/products/hooks/useProducts";
import { ProductGrid } from "../../features/products/components/ProductGrid";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// Loading Skeleton Component - Updated to show 8 skeletons
const ProductSkeletonGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="group flex flex-col animate-pulse">
          <div className="relative">
            {/* Image Skeleton */}
            <div className="w-full h-72 bg-gray-200 rounded-md"></div>
          </div>

          {/* Title Skeleton */}
          <div className="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>

          {/* Price Skeleton */}
          <div className="mt-2 h-4 bg-gray-200 rounded w-1/4"></div>

          {/* Button Skeleton */}
          <div className="flex gap-2 mt-4">
            <div className="bg-gray-200 h-10 rounded flex-1"></div>
            <div className="bg-gray-200 h-10 w-10 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Featured Products Component
const FeaturedProducts: React.FC = () => {
  const { data: products, isLoading, isError } = useProducts();

  // Get first 8 products for featured section
  const featuredProducts = products?.slice(0, 8);

  // Loading State with Skeletons
  if (isLoading) {
    return (
      <div className="py-16">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            Featured Products
          </h2>
        </div>
        <ProductSkeletonGrid />
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="py-16">
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-red-600 text-lg font-medium">
            Failed to load products
          </p>
          <p className="text-gray-500 mt-2">Please try again later.</p>
        </div>
      </div>
    );
  }

  // Empty State
  if (!products?.length) {
    return (
      <div className="py-16">
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <p className="text-gray-600 text-lg">No products available</p>
          <p className="text-gray-500 mt-2">
            Check back later for new arrivals.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 flex justify-center flex-col items-center">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl tracking-wider font-light mb-4 uppercase">
          Featured Products
        </h2>
        <p className="text-neutral-600 max-w-2xl">
          Handpicked selections for discerning tastes — discover our most loved
          pieces
        </p>
      </div>

      <ProductGrid products={featuredProducts || []} />

      <div className="text-center mt-12">
        <Link
          to="/shop"
          className="inline-flex items-center justify-center gap-3 bg-white border border-primary uppercase text-primary px-8 py-4 hover:bg-primary hover:text-white transition-colors duration-300"
        >
          View All Products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default FeaturedProducts;
