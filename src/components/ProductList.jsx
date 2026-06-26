import React, { useEffect, useState } from "react";

const ProductList = () => {
  const categories = [
    "Electronics",
    "Fashion",
    "Home & Living",
    "Groceries",
    "Beauty",
  ];

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH FROM BACKEND
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.log("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // FILTER
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <section className="py-8">

      {/* CATEGORY FILTER */}
      <div className="mb-6 flex gap-3">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="All">All</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* LOADING */}
      {loading ? (
        <p className="text-gray-500">Loading products...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {filteredProducts.map((product) => {
            const inStock = product.stock > 0;

            return (
              <div
                key={product._id}
                className="border rounded-2xl bg-white p-4 shadow-sm"
              >

                {/* 🖼️ 2 IMAGES SLIDER SIMPLE */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {product.images?.slice(0, 2).map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={product.name}
                      className="h-24 w-full object-cover rounded-lg"
                    />
                  ))}
                </div>

                <h3 className="font-bold">{product.name}</h3>

                <p className="text-xs text-gray-500">
                  {product.category}
                </p>

                <p className="font-black mt-2">
                  {Number(product.price).toLocaleString()} ETB
                </p>

                <p className={`text-xs mt-1 ${inStock ? "text-green-600" : "text-red-500"}`}>
                  {inStock ? `In Stock (${product.stock})` : "Out of Stock"}
                </p>

                <button
                  disabled={!inStock}
                  className={`w-full mt-3 py-2 rounded-lg font-bold text-sm ${
                    inStock
                      ? "bg-black text-white hover:bg-orange-600"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  Add to Cart
                </button>
              </div>
            );
          })}

        </div>
      )}
    </section>
  );
};

export default ProductList;
