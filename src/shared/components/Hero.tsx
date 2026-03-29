import React, { useState } from "react";
import heroImage from "../../assets/heroImage.webp";
import blurImage from "../../assets/heroImage-blur.jpg";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero: React.FC = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <section className="relative h-[90vh] min-h-150">
      {/* Background Images */}
      <div className="absolute inset-0">
        {/* Blur placeholder */}
        <img
          src={blurImage}
          className="absolute inset-0 w-full h-full object-cover"
          alt=""
        />

        {/* Full image */}
        <img
          src={heroImage}
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          alt="Furniture hero background"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      {/* Overlay (optional for readability) */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white space-y-6 px-4">
          <h1 className="text-5xl md:text-7xl tracking-wider font-light">
            TIMELESS DESIGN
          </h1>
          <p className="text-lg md:text-xl tracking-wide max-w-2xl mx-auto">
            Curated collection of furniture and decor for the modern home
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-neutral-900 text-sm tracking-wide hover:bg-neutral-100 transition-colors"
          >
            <span>EXPLORE COLLECTION</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
