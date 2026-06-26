import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSearch, FiX } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useAdmin } from "../context/AdminContext";

export default function Products() {
  const { addToCart } = useCart();
  const { products } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => {
    return [...new Set(products.map((p) => p.category))];
  }, [products]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q && category === "all") return products;
    return products.filter((p) => {
      const matchSearch = !q
        ? true
        : p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q);
      const matchCategory = category === "all" || p.category === category;
      return matchSearch && matchCategory;
    });
  }, [products, search, category]);

  const clearSearch = () => {
    setSearch("");
    setSearchParams({});
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <div className="mb-10 border-b border-gray-100 pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <span className="text-orange-500 font-bold tracking-wider text-xs uppercase bg-orange-50 px-3 py-1 rounded-full">
            Habesha Marketplace
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mt-2">
            Explore Our Catalog
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Discover top-tier local items, curated with premium responsive
            designs.
          </p>
        </div>

        <div className="text-sm font-medium text-gray-400 bg-gray-50 px-4 py-2 rounded-xl w-fit">
          Showing{" "}
          <span className="text-gray-900 font-bold">{filtered.length}</span>{" "}
          authentic products
        </div>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, category, or description..."
            className="w-full border border-gray-200 rounded-xl py-3 pl-10 pr-10 text-sm outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white"
          />
          {search && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              <FiX size={18} />
            </button>
          )}
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white text-gray-700 cursor-pointer min-w-[160px]"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <FiSearch className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 text-lg font-semibold">No products found</p>
          <p className="text-gray-400 text-sm mt-1">
            Try adjusting your search or filter to find what you&apos;re looking for.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => {
            const inStock = (product.stock ?? 0) > 0;
            return (
              <div
                key={product.id}
                className="group border border-gray-100 rounded-2xl p-4 bg-white shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative overflow-hidden rounded-xl bg-gray-50 aspect-square mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs text-gray-800 text-[10px] font-bold px-2 py-1 rounded-md shadow-xs">
                      {product.category}
                    </span>
                    {!inStock && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-xs uppercase">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-gray-800 tracking-tight line-clamp-1 group-hover:text-orange-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 text-xs mt-1 mb-3 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="mt-2">
                  <div className="flex justify-between items-center mb-3 pt-2 border-t border-dashed border-gray-100">
                    <span className="text-xs text-gray-400">Price</span>
                    <span className="text-gray-900 font-black text-base">
                      {product.price.toLocaleString()}{" "}
                      <span className="text-xs font-bold text-orange-600">ETB</span>
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    disabled={!inStock}
                    className={`w-full font-bold py-2.5 px-4 rounded-xl transition-all duration-200 text-sm shadow-xs active:scale-[0.98] cursor-pointer ${
                      inStock
                        ? "bg-gray-900 hover:bg-orange-600 text-white"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {inStock ? "Add to Cart" : "Unavailable"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
