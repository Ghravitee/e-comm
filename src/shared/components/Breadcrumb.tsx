import React from "react";
import { Link } from "react-router-dom";

interface Props {
  productName: string;
}

export const Breadcrumb: React.FC<Props> = ({ productName }) => {
  return (
    <div className="text-sm text-gray-500 mb-8">
      <Link to="/" className="hover:text-green-600">
        Home
      </Link>

      <span className="mx-2">/</span>

      <span className="text-gray-700">{productName}</span>
    </div>
  );
};
