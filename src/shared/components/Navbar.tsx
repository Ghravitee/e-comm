import React from "react";
import { Container } from "./Container";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { signOut } from "../../features/auth/api/auth";
import { useNavigate } from "react-router-dom";

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const initial = user?.email?.[0].toUpperCase();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/"); // redirect to home
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-white border-b">
      <Container>
        <div className="flex items-center justify-between h-16">
          <a href="/" className="text-green-600 text-xl font-bold">
            GreenCart
          </a>

          <div className="flex items-center gap-8 text-gray-700 font-medium">
            <a className="hover:text-green-600 cursor-pointer">Home</a>
            <a className="hover:text-green-600 cursor-pointer">Shop</a>
            <a className="hover:text-green-600 cursor-pointer">Categories</a>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                  {initial}
                </div>

                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-red-500"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <a
                  href="/signin"
                  className="hover:text-green-600 cursor-pointer"
                >
                  Sign In
                </a>
                <a
                  href="/signup"
                  className="hover:text-green-600 cursor-pointer"
                >
                  Sign Up
                </a>
              </>
            )}
          </div>
        </div>
      </Container>
    </nav>
  );
};
