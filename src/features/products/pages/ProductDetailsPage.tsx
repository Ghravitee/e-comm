import React from "react";
import { useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { ProductDetails } from "../components/ProductDetails";
import { Container } from "../../../shared/components/Container";
import { ProductSkeleton } from "../components/ProductSkeleton";
import { Breadcrumb } from "../../../shared/components/Breadcrumb";

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams();
  const { data: product, isLoading, isError } = useProduct(id!);

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen">
        <Container>
          <div className="py-16">
            <ProductSkeleton />
          </div>
        </Container>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white min-h-screen">
        <Container>
          <div className="py-16 flex items-center justify-center">
            <div className="text-center">
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
                Failed to load product
              </p>
              <p className="text-gray-500 mt-2">Please try again later.</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white min-h-screen">
        <Container>
          <div className="py-16 flex items-center justify-center">
            <div className="text-center">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 text-lg font-medium">
                Product Not Found
              </p>
              <p className="text-gray-500 mt-2">
                The product you're looking for doesn't exist or has been
                removed.
              </p>
              <button
                onClick={() => (window.location.href = "/shop")}
                className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
              >
                Browse Products
              </button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Container>
        <div className="py-8 md:py-16">
          <Breadcrumb productName={product.name} />
          <ProductDetails product={product} />
        </div>
      </Container>
    </div>
  );
};
