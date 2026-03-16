import React from "react";

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="grid md:grid-cols-2 gap-12 animate-pulse">
      <div className="bg-gray-200 h-100 rounded-lg"></div>

      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-2/3"></div>

        <div className="h-6 bg-gray-200 rounded w-1/4"></div>

        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>

        <div className="h-10 bg-gray-200 rounded w-40"></div>
      </div>
    </div>
  );
};
