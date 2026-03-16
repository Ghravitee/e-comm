import React from "react";
import { useProducts } from "../features/products/hooks/useProducts";
import { ProductGrid } from "../features/products/components/ProductGrid";
import { Hero } from "../shared/components/Hero";
import { Categories } from "../shared/components/Categories";
import { Container } from "../shared/components/Container";

export const Home: React.FC = () => {
  const { data: products, isLoading, isError } = useProducts();

  return (
    <>
      <Hero />

      <Categories />

      <Container>
        <h2 className="text-3xl font-bold text-gray-900 mb-10">
          Featured Products
        </h2>

        {isLoading && <p>Loading products...</p>}
        {isError && <p>Failed to load products.</p>}

        {products && <ProductGrid products={products} />}
      </Container>
    </>
  );
};
