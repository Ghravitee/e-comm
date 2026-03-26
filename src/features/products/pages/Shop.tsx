import { useState } from "react";
import { ProductGrid } from "../components/ProductGrid";
import { useProducts } from "../hooks/useProducts";
import { Container } from "../../../shared/components/Container";
import { Filter, X, ChevronDown } from "lucide-react";

const Shop = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 1000000,
  });

  const { data: products, isLoading, error } = useProducts();

  // Get unique categories from products
  const categories = products
    ? ["all", ...new Set(products.map((p) => p.category).filter(Boolean))]
    : ["all"];

  // Apply filters and sorting
  const filteredProducts = products
    ? products.filter((product) => {
        // Category filter
        if (
          selectedCategory !== "all" &&
          product.category !== selectedCategory
        ) {
          return false;
        }

        // Price range filter
        if (product.price < priceRange.min || product.price > priceRange.max) {
          return false;
        }

        return true;
      })
    : [];

  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProductsPerPageChange = (value: number) => {
    setProductsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handlePriceRangeChange = (type: "min" | "max", value: number) => {
    setPriceRange((prev) => ({ ...prev, [type]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setSortBy("default");
    setPriceRange({ min: 0, max: 1000000 });
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">Error loading products</p>
          <p className="text-gray-500 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="h-[60vh] shop-bg w-full relative grid grid-cols-2"></section>

      {/* Products Section */}
      <Container>
        {/* Filter Bar - Mobile Toggle */}
        <div className="lg:hidden flex justify-between items-center my-4">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200"
          >
            <Filter className="w-5 h-5" />
            Filters
            <ChevronDown
              className={`w-4 h-4 transition-transform ${isFilterOpen ? "rotate-180" : ""}`}
            />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show:</span>
            <select
              value={productsPerPage}
              onChange={(e) =>
                handleProductsPerPageChange(Number(e.target.value))
              }
              className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm"
            >
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
              <option value={96}>96</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 py-8">
          {/* Filters Sidebar */}
          <div
            className={`lg:w-80 shrink-0 ${
              isFilterOpen ? "block" : "hidden lg:block"
            }`}
          >
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={resetFilters}
                  className="text-sm text-primary hover:text-primary/70"
                >
                  Reset All
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-gray-700 capitalize">
                        {category === "all" ? "All Products" : category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Min Price</label>
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) =>
                        handlePriceRangeChange("min", Number(e.target.value))
                      }
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Min"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Max Price</label>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) =>
                        handlePriceRangeChange("max", Number(e.target.value))
                      }
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h4 className="font-medium mb-3">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="default">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Area */}
          <div className="flex-1">
            {/* Desktop Header with Controls */}
            <div className="hidden lg:flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  All Products
                </h2>
                <p className="text-gray-600 mt-1">
                  Showing{" "}
                  {sortedProducts.length > 0
                    ? `${indexOfFirstProduct + 1}-${Math.min(indexOfLastProduct, sortedProducts.length)} of ${sortedProducts.length} products`
                    : "0 products"}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Show:</span>
                <select
                  value={productsPerPage}
                  onChange={(e) =>
                    handleProductsPerPageChange(Number(e.target.value))
                  }
                  className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm"
                >
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                  <option value={96}>96</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategory !== "all" ||
              priceRange.min > 0 ||
              priceRange.max < 1000000) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategory !== "all" && (
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20"
                  >
                    Category: {selectedCategory}
                    <X className="w-3 h-3" />
                  </button>
                )}
                {(priceRange.min > 0 || priceRange.max < 1000000) && (
                  <button
                    onClick={() => setPriceRange({ min: 0, max: 1000000 })}
                    className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20"
                  >
                    Price: ₦{priceRange.min.toLocaleString()} - ₦
                    {priceRange.max.toLocaleString()}
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            {/* Products Grid with Loading State */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-200 h-72 rounded-md"></div>
                    <div className="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="mt-2 h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="mt-4 h-10 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 text-primary hover:text-primary/70"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <ProductGrid products={currentProducts} />

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                          : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                      }`}
                    >
                      Previous
                    </button>

                    <div className="flex gap-2">
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 &&
                            pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => handlePageChange(pageNumber)}
                              className={`w-10 h-10 rounded-lg border transition-colors ${
                                currentPage === pageNumber
                                  ? "bg-primary text-white border-primary"
                                  : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        }
                        if (
                          pageNumber === currentPage - 2 ||
                          pageNumber === currentPage + 2
                        ) {
                          return (
                            <span
                              key={pageNumber}
                              className="w-10 h-10 flex items-center justify-center text-gray-400"
                            >
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                          : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Shop;
