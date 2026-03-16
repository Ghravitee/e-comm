import React from "react";
import { useParams } from "react-router-dom";
import { useProduct } from "../features/products/hooks/useProduct";

import { ProductDetails } from "../features/products/components/ProductDetails";
import { Container } from "../shared/components/Container";
import { ProductSkeleton } from "../features/products/components/ProductSkeleton";
import { Breadcrumb } from "../shared/components/Breadcrumb";

export const ProductPage: React.FC = () => {
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

  if (isError) return <p>Failed to load product.</p>;

  if (!product) return <p>Product not found</p>;

  return (
    <div className="bg-white min-h-screen">
      <Container>
        <div className="py-16">
          <Breadcrumb productName={product.name} />
          <ProductDetails product={product} />
        </div>
      </Container>
    </div>
  );
};
