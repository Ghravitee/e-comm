// shared/components/Categories.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Container } from "./Container";
import livingRoom from "../../assets/living-room.webp";
import diningRoom from "../../assets/dining-furniture.webp";
import bedroom from "../../assets/bedroom-furniture.webp";
import accessories from "../../assets/accessories.webp"; // Add this image

const categories = [
  {
    id: "living-room",
    name: "Living Room",
    image: livingRoom,
    alt: "Modern Living room collection",
    description: "Sofas, coffee tables, and entertainment centers",
    count: 48,
  },
  {
    id: "dining",
    name: "Dining",
    image: diningRoom,
    alt: "Elegant dining furniture",
    description: "Create memorable dining experiences",
    count: 32,
  },
  {
    id: "bedroom",
    name: "Bedroom",
    image: bedroom,
    alt: "Comfortable bedroom furniture",
    description: "Create your perfect sanctuary",
    count: 56,
  },
  {
    id: "accessories",
    name: "Accessories",
    image: accessories,
    alt: "Home accessories and decor",
    description: "Add the perfect finishing touches",
    count: 42,
  },
];

export const Categories: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl uppercase text-gray-900 mb-3">
            Shop by Categories
          </h2>
        </div>

        {/* Categories Grid - Now 4 columns on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.id}`}
              className="group relative h-96 overflow-hidden shadow-lg"
            >
              {/* Background Image */}
              <img
                src={category.image}
                alt={category.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                <p className="text-sm text-gray-200 mb-2">
                  {category.description}
                </p>
                <p className="text-sm text-primary font-medium">
                  {category.count} Products →
                </p>
              </div>

              {/* Hover Effect Badge */}
              <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Shop Now
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
};
