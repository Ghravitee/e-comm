import React from "react";
import { Container } from "./Container";

export const Hero: React.FC = () => {
  return (
    <section className="bg-gray-50 py-24">
      <Container>
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Shop Everyday Essentials
            <span className="text-green-600"> in One Place</span>
          </h1>

          <p className="mt-6 text-gray-600 text-lg">
            Discover bags, clothing, utensils and everyday items curated for
            convenience and quality.
          </p>

          <button className="mt-8 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium">
            Browse Products
          </button>
        </div>
      </Container>
    </section>
  );
};
