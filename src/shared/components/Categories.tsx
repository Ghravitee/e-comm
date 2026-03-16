import React from "react";
import { Container } from "./Container";

const categories = ["Bags", "Clothing", "Utensils", "Accessories"];

export const Categories: React.FC = () => {
  return (
    <section className="py-16">
      <Container>
        <h2 className="text-3xl font-bold text-gray-900 mb-10">
          Shop by Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category}
              className="border rounded-lg p-10 text-center hover:shadow-lg transition cursor-pointer"
            >
              <p className="font-semibold text-gray-800">{category}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
