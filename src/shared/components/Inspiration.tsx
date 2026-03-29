import { useState } from "react";
import { Container } from "./Container";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const Inspiration = () => {
  const images = [
    {
      id: 1,
      title: "Modern Minimalist",
      imageUrl:
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&h=800&fit=crop",
    },
    {
      id: 2,
      title: "Scandinavian Comfort",
      imageUrl:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&h=800&fit=crop",
    },
    {
      id: 3,
      title: "Industrial Chic",
      imageUrl:
        "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=1200&h=800&fit=crop",
    },
    {
      id: 4,
      title: "Bohemian Paradise",
      imageUrl:
        "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&h=800&fit=crop",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <section className="py-10 bg-white">
      <Container>
        {/* Header */}
        {/* <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-primary text-sm font-medium tracking-wider uppercase">
            Inspiration
          </span>
          <h2 className="text-4xl font-light text-gray-900 mt-2 mb-4">
            50+ Beautiful Rooms
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Discover endless possibilities for your dream space. From modern
            minimalism to cozy bohemian styles, find inspiration for every
            corner of your home.
          </p>
        </div> */}

        {/* Main Carousel */}
        <div className="relative max-w-5xl mx-auto">
          {/* Main Image */}
          <div className="relative overflow-hidden rounded-2xl shadow-xl">
            <img
              src={images[currentIndex].imageUrl}
              alt={images[currentIndex].title}
              className="w-full h-[550px] object-cover transition-transform duration-700 hover:scale-105"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h3 className="text-2xl font-light tracking-wide">
                {images[currentIndex].title}
              </h3>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 transition-all flex items-center justify-center shadow-lg"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 transition-all flex items-center justify-center shadow-lg"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? "w-8 bg-primary"
                    : "w-4 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Explore Button */}
        <div className="text-center mt-10">
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-neutral-900 text-sm tracking-wide hover:bg-neutral-100 transition-colors"
          >
            <span>EXPLORE MORE</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default Inspiration;
