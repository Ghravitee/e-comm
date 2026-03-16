import React from "react";
import { ProductCard } from "./ProductCard";
import type { Product } from "../types";

interface Props {
  products: Product[];
}

export const ProductGrid: React.FC<Props> = ({ products }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
    {products.map((p) => (
      <ProductCard key={p.id} product={p} />
    ))}
  </div>
);
