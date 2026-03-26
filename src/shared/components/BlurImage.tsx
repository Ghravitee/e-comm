import React, { useState } from "react";

interface BlurImageProps {
  src: string;
  placeholder?: string;
  alt: string;
  className?: string;
}

export const BlurImage: React.FC<BlurImageProps> = ({
  src,
  placeholder,
  alt,
  className = "",
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative overflow-hidden">
      {/* Blur placeholder */}
      {placeholder && (
        <img
          src={placeholder}
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover scale-110 blur-2xl`}
        />
      )}

      {/* Main image */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`${className} transition-opacity duration-700 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        loading="lazy"
      />
    </div>
  );
};
