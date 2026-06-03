import React, { useState } from "react";

const ProductList = () => {
  // 1. Explicit clean category options list
  const categories = [
    "Electronics",
    "Fashion",
    "Home & Living",
    "Groceries",
    "Beauty",
  ];

  // 2. State management for tracking the selected filter option
  const [selectedCategory, setSelectedCategory] = useState("All");

  // 3. Complete structural mockup dataset aligned
  const allProducts = [
    {
      id: 1,
      name: "Wireless Bluetooth Noise-Cancelling Headphones",
      price: "ETB 2,500",
      stock: 12,
      category: "Electronics",
      image: "🎧",
    },
    {
      id: 2,
      name: "Smart Fitness Running Watch & Heart Tracker",
      price: "ETB 4,200",
      stock: 4,
      category: "Electronics",
      image: "⌚",
    },
    {
      id: 3,
      name: "Premium Minimalist Leather Travel Wallet",
      price: "ETB 1,800",
      stock: 0,
      category: "Fashion",
      image: "💼",
    },
    {
      id: 4,
      name: "Ergonomic High-Back Office Mesh Chair",
      price: "ETB 8,500",
      stock: 3,
      category: "Home & Living",
      image: "🪑",
    },
    {
      id: 5,
      name: "Organic Ethiopian Honey (1KG Pure)",
      price: "ETB 950",
      stock: 20,
      category: "Groceries",
      image: "🍯",
    },
    {
      id: 6,
      name: "Hydrating Face Cream & Skin Cleanser",
      price: "ETB 1,200",
      stock: 8,
      category: "Beauty",
      image: "🧴",
    },
  ];

  // 4. Filter processing logic matching your strict options state
  const filteredProducts =
    selectedCategory === "All"
      ? allProducts
      : allProducts.filter((product) => product.category === selectedCategory);

  return (
    <section className="py-8">
      {/* Categories Dropdown Selector Element Block */}
      <div className="flex items-center gap-3 mb-8 bg-white p-4 rounded-xl border border-gray-200 max-w-xs shadow-sm">
        <label
          htmlFor="category-select"
          className="text-xs font-black text-gray-500 uppercase tracking-wider whitespace-nowrap"
        >
          Product Category:
        </label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg font-medium focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-2 outline-none transition-all cursor-pointer"
        >
          <option value="All">All Categories</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Dynamic Results Header Tracking Context */}
      <div className="mb-6 flex items-baseline gap-2">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          {selectedCategory === "All"
            ? "All Featured Listings"
            : `${selectedCategory} Catalogue`}
        </h2>
        <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full">
          {filteredProducts.length} Items Found
        </span>
      </div>

      {/* Product List Core Grid System */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              {/* Product Visual Frame Placeholder */}
              <div className="h-48 bg-gray-50 flex items-center justify-center text-5xl select-none">
                {product.image}
              </div>

              {/* Product Info Block Details */}
              <div className="p-4 flex flex-col flex-grow">
                <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">
                  {product.category}
                </span>
                <h3 className="font-semibold text-gray-900 mt-1 text-base line-clamp-2 min-h-[3rem]">
                  {product.name}
                </h3>

                {/* Available Stock Indicator Warning*/}
                <div className="mt-2">
                  {product.stock > 0 ? (
                    <span className="text-xs text-green-600 font-medium">
                      In Stock ({product.stock} left)[cite: 1]
                    </span>
                  ) : (
                    <span className="text-xs text-red-500 font-semibold">
                      Out of Stock[cite: 1]
                    </span>
                  )}
                </div>

                {/* Pricing & Cart Action Trigger */}
                <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-50">
                  <span className="text-lg font-black text-gray-900">
                    {product.price}[cite: 1]
                  </span>
                  <button
                    disabled={product.stock === 0}
                    className={`text-xs font-bold px-3.5 py-2 rounded-lg transition-colors ${
                      product.stock > 0
                        ? "bg-gray-900 text-white hover:bg-orange-600"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-2xl bg-white">
          No items found in this section right now!
        </div>
      )}
    </section>
  );
};

export default ProductList;
