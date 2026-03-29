import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container } from "./Container";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useProfile } from "../../features/profiles/hooks/useProfile";
import { useAdminProfile } from "../../features/profiles/hooks/useAdminProfile";
import { signOut } from "../../features/auth/api/auth";
import { useCartStore } from "../../features/cart/store/useCartStore";
import { useFavoritesStore } from "../../features/favorites/store/useFavoritesStore";
import {
  User,
  Heart,
  ShoppingCart,
  LogOut,
  UserCircle,
  LogIn,
  UserPlus,
  Shield,
  Package,
  ShoppingBag,
  Menu,
  X,
  Search,
  ChevronRight,
} from "lucide-react";
import { CartDrawer } from "../../features/cart/components/CartDrawer";
import { SearchBar } from "../../features/products/components/SearchBar";
import toast from "react-hot-toast";

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { isAdmin, loading: adminLoading } = useAdminProfile();

  const items = useCartStore((state) => state.items);
  const favorites = useFavoritesStore((state) => state.favorites);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const isLoading = profileLoading || adminLoading;
  const avatarUrl = profile?.avatar_url;
  const emailInitial = user?.email?.[0]?.toUpperCase();
  const cartItemsCount = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  const favoritesCount = favorites.length;

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Successfully logged out! 👋", {
        duration: 3000,
        position: "top-right",
        icon: "👋",
      });
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Failed to log out:", error);
      toast.error("Failed to log out. Please try again.", {
        duration: 4000,
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest(".mobile-menu-button")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isMobileSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <>
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <Container>
          {/* Main Navbar Row */}
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group shrink-0">
              <div className="w-8 h-8 md:w-9 md:h-9 bg-neutral-900 flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
                <span className="text-white font-serif text-lg md:text-xl">
                  F
                </span>
              </div>
              <span className="text-xl md:text-2xl tracking-widest font-light text-gray-900">
                FSJ
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8 lg:gap-12">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-gray-700 hover:text-[#b88e2f] transition-colors cursor-pointer text-sm lg:text-base font-medium relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#b88e2f] transition-all group-hover:w-full"></span>
                </Link>
              ))}
            </div>

            {/* Desktop Search */}
            <div className="hidden md:block flex-1 max-w-md lg:max-w-xl mx-8">
              <SearchBar />
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-2 md:gap-5">
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors relative z-20"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-gray-700" />
              </button>

              {/* Favorites */}
              <Link
                to="/favorites"
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors group"
                aria-label="Favorites"
              >
                <Heart className="w-5 h-5 text-gray-700 group-hover:text-primary transition-colors" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1 shadow-lg">
                    {favoritesCount > 99 ? "99+" : favoritesCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors group"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-primary transition-colors" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1 shadow-lg">
                    {cartItemsCount > 99 ? "99+" : cartItemsCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none p-1 rounded-full hover:bg-gray-100"
                  aria-label="User menu"
                  disabled={isLoading}
                >
                  {user ? (
                    avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={profile?.full_name || user.email || "User avatar"}
                        className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover border-2 border-[#b88e2f]"
                      />
                    ) : (
                      <div className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-white font-bold text-sm bg-[#b88e2f]">
                        {emailInitial || <User className="w-4 h-4" />}
                      </div>
                    )
                  ) : (
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    {user ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center gap-3 mb-2">
                            {avatarUrl ? (
                              <img
                                src={avatarUrl}
                                alt={profile?.full_name || "User avatar"}
                                className="w-10 h-10 rounded-full object-cover border-2 border-[#b88e2f]"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-[#b88e2f]">
                                {emailInitial}
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-900">
                                {profile?.full_name ||
                                  user.email?.split("@")[0]}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="py-2">
                          <DropdownItem
                            to="/profile"
                            icon={UserCircle}
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            My Profile
                          </DropdownItem>
                          <DropdownItem
                            to="/favorites"
                            icon={Heart}
                            onClick={() => setIsDropdownOpen(false)}
                            badge={favoritesCount}
                          >
                            My Favorites
                          </DropdownItem>
                          <DropdownItem
                            to="/orders"
                            icon={ShoppingCart}
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            My Orders
                          </DropdownItem>
                        </div>

                        {isAdmin && (
                          <div className="py-2 border-t border-gray-100">
                            <div className="px-4 py-1">
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Admin
                              </p>
                            </div>
                            <DropdownItem
                              to="/admin/products"
                              icon={Shield}
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              Admin Dashboard
                            </DropdownItem>
                            <DropdownItem
                              to="/admin/orders"
                              icon={Package}
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              Manage Orders
                            </DropdownItem>
                            <DropdownItem
                              to="/admin/products"
                              icon={ShoppingBag}
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              Manage Products
                            </DropdownItem>
                          </div>
                        )}

                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors group"
                          >
                            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            Logout
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="py-2">
                        <DropdownItem
                          to="/signin"
                          icon={LogIn}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Sign In
                        </DropdownItem>
                        <DropdownItem
                          to="/signup"
                          icon={UserPlus}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Sign Up
                        </DropdownItem>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                className="mobile-menu-button md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors relative z-20"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar - Full width row below navbar */}
          {isMobileSearchOpen && (
            <div className="md:hidden py-3 border-t border-gray-100 animate-slide-down bg-white">
              <SearchBar
                autoFocus
                ref={searchInputRef}
                isMobile={true}
                onClose={() => setIsMobileSearchOpen(false)}
              />
            </div>
          )}
        </Container>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div
            ref={mobileMenuRef}
            className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-white z-50 md:hidden shadow-2xl animate-slide-in-right"
          >
            {/* Header with close button */}
            <div className="flex items-center justify-end p-5 border-b border-gray-100">
              {/* <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-neutral-900 flex items-center justify-center rounded-lg">
                  <span className="text-white font-serif text-lg">F</span>
                </div>
                <span className="text-xl tracking-widest font-light">FSJ</span>
              </div> */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="flex flex-col h-full overflow-y-auto pb-20">
              {/* User Profile Section */}
              {user && (
                <div className="p-5 bg-linear-to-r from-gray-50 to-white border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={profile?.full_name || "User avatar"}
                        className="w-14 h-14 rounded-full object-cover border-2 border-[#b88e2f]"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl bg-[#b88e2f]">
                        {emailInitial}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-base font-semibold text-gray-900">
                        {profile?.full_name || user.email?.split("@")[0]}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className="flex-1 py-4">
                <div className="px-4 py-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Menu
                  </p>
                  {navLinks.map((link) => (
                    <MobileMenuItem
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </MobileMenuItem>
                  ))}
                </div>

                <div className="h-px bg-gray-100 my-2 mx-4" />

                <div className="px-4 py-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Account
                  </p>
                  {user ? (
                    <>
                      <MobileMenuItem
                        to="/profile"
                        icon={UserCircle}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        My Profile
                      </MobileMenuItem>
                      <MobileMenuItem
                        to="/favorites"
                        icon={Heart}
                        onClick={() => setIsMobileMenuOpen(false)}
                        badge={favoritesCount}
                      >
                        My Favorites
                      </MobileMenuItem>
                      <MobileMenuItem
                        to="/orders"
                        icon={ShoppingCart}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        My Orders
                      </MobileMenuItem>

                      {isAdmin && (
                        <>
                          <div className="mt-4 mb-2">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                              Admin
                            </p>
                          </div>
                          <MobileMenuItem
                            to="/admin/products"
                            icon={Shield}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Admin Dashboard
                          </MobileMenuItem>
                          <MobileMenuItem
                            to="/admin/orders"
                            icon={Package}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Manage Orders
                          </MobileMenuItem>
                          <MobileMenuItem
                            to="/admin/products"
                            icon={ShoppingBag}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Manage Products
                          </MobileMenuItem>
                        </>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full mt-4 flex items-center justify-between px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">Logout</span>
                        </div>
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </>
                  ) : (
                    <>
                      <MobileMenuItem
                        to="/signin"
                        icon={LogIn}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign In
                      </MobileMenuItem>
                      <MobileMenuItem
                        to="/signup"
                        icon={UserPlus}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign Up
                      </MobileMenuItem>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

// Helper Components
const DropdownItem: React.FC<{
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  onClick?: () => void;
  badge?: number;
}> = ({ to, icon: Icon, children, onClick, badge }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
  >
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
      <span>{children}</span>
    </div>
    {badge !== undefined && badge > 0 && (
      <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
        {badge > 99 ? "99+" : badge}
      </span>
    )}
  </Link>
);

const MobileMenuItem: React.FC<{
  to: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  onClick?: () => void;
  badge?: number;
}> = ({ to, icon: Icon, children, onClick, badge }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors group"
  >
    <div className="flex items-center gap-3">
      {Icon && (
        <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
      )}
      <span className="font-medium">{children}</span>
    </div>
    <div className="flex items-center gap-2">
      {badge !== undefined && badge > 0 && (
        <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
      <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  </Link>
);
