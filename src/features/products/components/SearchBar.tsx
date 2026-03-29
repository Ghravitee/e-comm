// features/products/components/SearchBar.tsx
import React, { useState, useRef, useEffect, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useSearchSuggestions } from "../hooks/useSearchProducts";

interface SearchBarProps {
  onClose?: () => void;
  isMobile?: boolean;
  autoFocus?: boolean;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ onClose, isMobile = false, autoFocus = false }, ref) => {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [, setIsFocused] = useState(false);
    const internalRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Use either the forwarded ref or internal ref
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalRef;

    const { data: suggestions, isLoading } = useSearchSuggestions(query);

    // Auto focus effect
    useEffect(() => {
      if (autoFocus && inputRef?.current) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
    }, [autoFocus, inputRef]);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node) &&
          inputRef?.current &&
          !inputRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [inputRef]);

    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
        setIsOpen(false);
        if (onClose) onClose();
      }
    };

    const handleSuggestionClick = (productId: string) => {
      navigate(`/products/${productId}`);
      setIsOpen(false);
      setQuery("");
      if (onClose) onClose();
    };

    const clearSearch = () => {
      setQuery("");
      setIsOpen(false);
      if (inputRef?.current) {
        inputRef.current.focus();
      }
    };

    return (
      <div className="relative w-full">
        <form onSubmit={handleSearch} className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(e.target.value.length >= 2);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search products..."
            className={`w-full px-4 py-2 pl-10 pr-10 border-2 focus:outline-none focus:ring-1 focus:ring-primary ${
              isMobile ? "bg-white" : "bg-gray-100 focus:bg-white"
            }`}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </form>

        {/* Search Suggestions Dropdown */}
        {isOpen &&
          query.length >= 2 &&
          suggestions &&
          suggestions.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto"
            >
              <div className="p-2">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    Loading...
                  </div>
                ) : (
                  <>
                    <div className="px-3 py-2 text-xs text-gray-500 font-medium border-b">
                      Suggestions
                    </div>
                    {suggestions.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleSuggestionClick(product.id)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
                      >
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {product.name}
                          </p>
                          <p className="text-xs text-primary">
                            ₦{product.price.toLocaleString()}
                          </p>
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={handleSearch}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-primary/70 bg-primary text-white border mt-1"
                    >
                      Click to see all results for "{query}"
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

        {isOpen &&
          query.length >= 2 &&
          suggestions?.length === 0 &&
          !isLoading && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4 text-center text-gray-500">
                No products found for "{query}"
              </div>
              <button
                onClick={handleSearch}
                className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-gray-50 border-t"
              >
                Search for "{query}"
              </button>
            </div>
          )}
      </div>
    );
  },
);

SearchBar.displayName = "SearchBar";
