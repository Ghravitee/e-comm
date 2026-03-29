// features/products/pages/CategoryPage.tsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { ProductGrid } from "../components/ProductGrid";
import { Container } from "../../../shared/components/Container";

const categoryNames: Record<string, { name: string; description: string }> = {
  "living-room": {
    name: "Living Room",
    description:
      "Transform your living space with our curated collection of sofas, coffee tables, and entertainment centers",
  },
  dining: {
    name: "Dining",
    description:
      "Create memorable dining experiences with our elegant dining sets and dinnerware",
  },
  bedroom: {
    name: "Bedroom",
    description:
      "Create your perfect sanctuary with our comfortable beds, dressers, and bedding essentials",
  },
  accessories: {
    name: "Accessories",
    description:
      "Add the perfect finishing touches with our curated selection of lamps, vases, and decor",
  },
};

export const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();

  // Use the API with category filter - don't fetch all products
  const {
    data: products,
    isLoading,
    error,
  } = useProducts({
    category: categoryId,
  });

  const category = categoryNames[categoryId || ""] || {
    name: categoryId?.replace("-", " ") || "Category",
    description: "Explore our collection",
  };

  if (isLoading) {
    return (
      <Container>
        <div className="py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-72 rounded-md"></div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="py-16 text-center">
          <p className="text-red-500">Failed to load products</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Container>
        <div className="py-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-primary">
              Shop
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{category.name}</span>
          </div>

          {/* Category Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {category.name}
            </h1>
            <p className="text-gray-600 mt-2">{category.description}</p>
            <p className="text-sm text-primary mt-2">
              {products?.length || 0} products
            </p>
          </div>

          {/* Products Grid */}
          {products?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No products found in this category.
              </p>
              <Link
                to="/shop"
                className="text-primary hover:underline mt-2 inline-block"
              >
                Browse all products →
              </Link>
            </div>
          ) : (
            <ProductGrid products={products || []} />
          )}
        </div>
      </Container>
    </div>
  );
};
