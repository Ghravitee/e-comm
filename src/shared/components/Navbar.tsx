import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container } from "./Container";
import { useAuth } from "../../features/auth/context/AuthProvider";
import { useProfile } from "../../features/profiles/hooks/useProfile";
import { useAdminProfile } from "../../features/profiles/hooks/useAdminProfile";
import { signOut } from "../../features/auth/api/auth";
import { useCartStore } from "../../features/cart/store/useCartStore";
import {
  User,
  Heart,
  ShoppingCart,
  LogOut,
  UserCircle,
  LogIn,
  UserPlus,
  Shield,
} from "lucide-react";
import { CartDrawer } from "../../features/cart/components/CartDrawer";

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { isAdmin, loading: adminLoading } = useAdminProfile();

  // Only subscribe to items array to prevent unnecessary re-renders
  const items = useCartStore((state) => state.items);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Show loading state while profile is being fetched
  const isLoading = profileLoading || adminLoading;

  // Get avatar URL from profile, or fallback to email initial
  const avatarUrl = profile?.avatar_url;
  const emailInitial = user?.email?.[0]?.toUpperCase();

  // Calculate total number of items in cart
  const cartItemsCount = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const handleLogout = async () => {
    try {
      console.log("Attempting to sign out...");
      await signOut();
      console.log("Sign out successful");
      setIsDropdownOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed with error:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="bg-white py-6">
        <Container>
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="text-xl font-bold"
              style={{ color: "#b88e2f" }}
            >
              GreenCart
            </Link>

            <div className="flex items-center gap-10 text-black font-medium">
              <Link
                to="/"
                className="hover:opacity-80 transition-opacity cursor-pointer"
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="hover:opacity-80 transition-opacity cursor-pointer"
              >
                Shop
              </Link>
              <Link
                to="/about"
                className="hover:opacity-80 transition-opacity cursor-pointer"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="hover:opacity-80 transition-opacity cursor-pointer"
              >
                Contact
              </Link>
            </div>

            <div className="flex items-center gap-6">
              {/* Favorites Icon */}
              <Link
                to="/favorites"
                className="hover:opacity-80 transition-opacity"
                aria-label="Favorites"
              >
                <Heart className="w-5 h-5" />
              </Link>

              {/* Cart Icon with item count badge */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="hover:opacity-80 transition-opacity relative"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                    {cartItemsCount > 99 ? "99+" : cartItemsCount}
                  </span>
                )}
              </button>

              {/* User Menu with Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none"
                  aria-label="User menu"
                  disabled={isLoading}
                >
                  {user ? (
                    avatarUrl ? (
                      // Render avatar if available
                      <img
                        src={avatarUrl}
                        alt={profile?.full_name || user.email || "User avatar"}
                        className="w-8 h-8 rounded-full object-cover border-2"
                        style={{ borderColor: "#b88e2f" }}
                      />
                    ) : (
                      // Fallback to email initial
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: "#b88e2f" }}
                      >
                        {emailInitial || <User className="w-4 h-4" />}
                      </div>
                    )
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100 z-50">
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-100">
                          <div className="flex items-center gap-2 mb-1">
                            {avatarUrl ? (
                              <img
                                src={avatarUrl}
                                alt={profile?.full_name || "User avatar"}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                            ) : (
                              <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                style={{ backgroundColor: "#b88e2f" }}
                              >
                                {emailInitial}
                              </div>
                            )}
                            <p className="text-sm font-medium text-gray-900 truncate flex-1">
                              {profile?.full_name || user.email?.split("@")[0]}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-2">
                            <UserCircle className="w-4 h-4" />
                            My Profile
                          </div>
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4" />
                            My Orders
                          </div>
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin/products"
                            onClick={() => setIsDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              Admin Dashboard
                            </div>
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/signin"
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-2">
                            <LogIn className="w-4 h-4" />
                            Sign In
                          </div>
                        </Link>
                        <Link
                          to="/signup"
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-2">
                            <UserPlus className="w-4 h-4" />
                            Sign Up
                          </div>
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </nav>

      {/* Cart Drawer - Rendered outside the navbar but controlled by it */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
