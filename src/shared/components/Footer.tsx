import React from "react";
import { Container } from "./Container";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-24">
      <Container>
        <div className="py-16 grid md:grid-cols-3 gap-10">
          <div>
            <h2 className="text-white text-xl font-bold">GreenCart</h2>

            <p className="mt-4 text-gray-400">
              Your everyday marketplace for bags, clothing, utensils and more.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Shop</h3>

            <ul className="space-y-2">
              <li>All Products</li>
              <li>Bags</li>
              <li>Clothing</li>
              <li>Utensils</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>

            <ul className="space-y-2">
              <li>About</li>
              <li>Contact</li>
              <li>Support</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} GreenCart. All rights reserved.
        </div>
      </Container>
    </footer>
  );
};
