import React from "react";
import { Container } from "./Container";
import livingRoom from "../../assets/living-room.webp";
import diningRoom from "../../assets/dining-furniture.webp";
import bedroom from "../../assets/bedroom-furniture.webp";

const categories = [
  {
    id: 1,
    name: "Dining",
    image: diningRoom,
    alt: "Elegant dining furniture",
  },
  {
    id: 2,
    name: "Living Room",
    image: livingRoom,
    alt: "Cozy living room furniture",
  },
  {
    id: 3,
    name: "Bedroom",
    image: bedroom,
    alt: "Comfortable bedroom furniture",
  },
];

export const Categories: React.FC = () => {
  return (
    <section className="py-16">
      <Container>
        <h2 className="text-3xl font-bold text-gray-900 text-center capitalize">
          Browse the range
        </h2>

        <p className="mt-4 text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Discover our curated collection of handcrafted furniture designed to
          bring warmth and character to every corner of your home.
        </p>
        {/* <p>
          , designed to bring warmth and character to every corner of your home.
          From elegant dining sets to cozy living room pieces, each item tells a
          story of exceptional craftsmanship.
        </p> */}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer"
            >
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                <img
                  src={category.image}
                  alt={category.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 text-center">
                <p className="font-semibold text-gray-800">{category.name}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
