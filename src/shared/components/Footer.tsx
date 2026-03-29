import { Link } from "react-router";
import { Instagram, Facebook, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-800 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-neutral-900 flex items-center justify-center">
                <span className="text-white font-serif text-xl">F</span>
              </div>
              <span className="text-2xl tracking-widest font-light">FSJ</span>
            </Link>
            <p className="text-sm text-neutral-600 max-w-xs">
              Curating timeless pieces for modern living. Quality craftsmanship
              meets contemporary design.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm tracking-wide mb-4">SHOP</h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>
                <Link
                  to="/shop?category=living-room"
                  className="hover:text-neutral-900"
                >
                  Living Room
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=bedroom"
                  className="hover:text-neutral-900"
                >
                  Bedroom
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=dining"
                  className="hover:text-neutral-900"
                >
                  Dining
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=accessories"
                  className="hover:text-neutral-900"
                >
                  Accessories
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-neutral-900">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-sm tracking-wide mb-4">CUSTOMER CARE</h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>
                <a href="/contact" className="hover:text-neutral-900">
                  Contact Us
                </a>
              </li>
              {/* <li>
                <a href="#" className="hover:text-neutral-900">
                  Shipping & Returns
                </a>
              </li> */}
              <li>
                <a href="/faqs" className="hover:text-neutral-900">
                  FAQs
                </a>
              </li>
              {/* <li>
                <a href="#" className="hover:text-neutral-900">
                  Size Guide
                </a>
              </li> */}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm tracking-wide mb-4">STAY UPDATED</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <div className="flex space-x-2 mb-4">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 px-4 py-2 text-sm border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
              <button className="px-4 py-2 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors">
                <Mail className="w-4 h-4" />
              </button>
            </div>
            <div className="flex space-x-3">
              <a
                href="#"
                className="w-8 h-8 flex items-center justify-center border border-neutral-300 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 flex items-center justify-center border border-neutral-300 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 flex items-center justify-center border border-neutral-300 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-neutral-600">
          <div className="border-t border-gray-800 py-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} FSJ. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-neutral-900">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-neutral-900">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
