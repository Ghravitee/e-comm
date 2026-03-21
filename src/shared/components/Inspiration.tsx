import React, { useState } from "react";
import { Container } from "./Container";

const Inspiration = () => {
  // Sample images data
  const images = [
    {
      id: 1,
      title: "01 — Modern Minimalist",
      imageUrl:
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=600&fit=crop",
      description: "Clean lines and natural light",
    },
    {
      id: 2,
      title: "02 — Scandinavian Comfort",
      imageUrl:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop",
      description: "Warm and cozy ambiance",
    },
    {
      id: 3,
      title: "03 — Industrial Chic",
      imageUrl:
        "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&h=600&fit=crop",
      description: "Raw materials meet elegance",
    },
    {
      id: 4,
      title: "04 — Bohemian Paradise",
      imageUrl:
        "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&h=600&fit=crop",
      description: "Eclectic and free-spirited",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  const currentImage = images[currentIndex];
  const nextImage = images[(currentIndex + 1) % images.length];
  const prevImage =
    images[currentIndex === 0 ? images.length - 1 : currentIndex - 1];

  return (
    <div className="bg-primary/10">
      <Container>
        <div className="inspiration-container">
          {/* Left Side - Text Content */}

          <div className="text-side">
            <h2 className="main-title">50+ Beautiful Rooms Inspiration</h2>
            <p className="catch-paragraph">
              Discover endless possibilities for your dream space. From modern
              minimalism to cozy bohemian styles, our curated collection of 50+
              stunning room designs will spark your creativity and help you
              transform your home into a personal sanctuary.
            </p>
            <button className="bg-primary text-white px-6 py-2 transition-colors w-fit">
              Explore More →
            </button>
          </div>

          {/* Right Side - Slideshow */}
          <div className="slideshow-side">
            {/* Main Image Display */}
            <div className="main-image-container">
              <img
                src={currentImage.imageUrl}
                alt={currentImage.title}
                className="main-image"
              />
            </div>

            {/* Bottom Control Section */}
            <div className="control-section">
              <div className="image-info">
                <h3 className="image-title">{currentImage.title}</h3>
                <p className="image-description">{currentImage.description}</p>
              </div>
              <div className="navigation-buttons">
                <button
                  className="bg-primary text-white px-2 py-2 transition-colors w-fit"
                  onClick={handlePrev}
                  aria-label="Previous image"
                >
                  <span className="">←</span>
                </button>
                <button
                  className="bg-primary text-white px-2 py-2 transition-colors w-fit"
                  onClick={handleNext}
                  aria-label="Next image"
                >
                  <span className="">→</span>
                </button>
              </div>
            </div>

            {/* Thumbnail Preview (shows next and previous images) */}
            <div className="thumbnails-container">
              {/* Previous Image Thumbnail */}
              <div
                className="thumbnail prev-thumbnail"
                onClick={() =>
                  handleThumbnailClick(
                    currentIndex === 0 ? images.length - 1 : currentIndex - 1,
                  )
                }
              >
                <img
                  src={prevImage.imageUrl}
                  alt={prevImage.title}
                  className="thumbnail-image"
                />
                <div className="thumbnail-overlay">
                  <p className="thumbnail-title">{prevImage.title}</p>
                </div>
              </div>

              {/* Current Image Thumbnail */}
              <div
                className="thumbnail current-thumbnail"
                onClick={() => handleThumbnailClick(currentIndex)}
              >
                <img
                  src={currentImage.imageUrl}
                  alt={currentImage.title}
                  className="thumbnail-image"
                />
                <div className="thumbnail-overlay active">
                  <p className="thumbnail-title">{currentImage.title}</p>
                </div>
              </div>

              {/* Next Image Thumbnail */}
              <div
                className="thumbnail next-thumbnail"
                onClick={() =>
                  handleThumbnailClick((currentIndex + 1) % images.length)
                }
              >
                <img
                  src={nextImage.imageUrl}
                  alt={nextImage.title}
                  className="thumbnail-image"
                />
                <div className="thumbnail-overlay">
                  <p className="thumbnail-title">{nextImage.title}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Inspiration;
