// features/favorites/pages/FavoritesPage.tsx
import React from "react";
import { useFavorites } from "../hooks/useFavorites";
import { ProductGrid } from "../../products/components/ProductGrid";
import { Container } from "../../../shared/components/Container";
import { Heart } from "lucide-react";

export const FavoritesPage: React.FC = () => {
  const { favorites, isLoading, error } = useFavorites();

  if (isLoading) {
    return (
      <Container>
        <div className="py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-72 rounded-md"></div>
                <div className="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="mt-2 h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="py-16 text-center">
          <p className="text-red-500">Failed to load favorites</p>
        </div>
      </Container>
    );
  }

  const products = favorites.map((f) => f.product);

  return (
    <div className="min-h-screen bg-gray-50">
      <Container>
        <div className="py-16">
          <div className="flex items-center gap-3 mb-8">
            <Heart className="w-8 h-8 text-primary fill-primary" />
            <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No favorites yet</p>
              <p className="text-gray-400 mt-2">
                Start adding products you love to your favorites!
              </p>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </Container>
    </div>
  );
};
