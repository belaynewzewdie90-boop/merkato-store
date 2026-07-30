import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiShoppingCart, FiPackage, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { fetchProduct } from "../api/api";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchProduct(id);
        if (data) {
          setProduct(data);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("[ProductDetails] API fetch failed:", err.message);
      }

      try {
        const stored = localStorage.getItem("merkato_products");
        if (stored) {
          const parsed = JSON.parse(stored);
          const found = parsed.find((p) => String(p._id || p.id) === String(id));
          if (found) {
            setProduct(found);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn("[ProductDetails] localStorage error:", e);
      }

      setError("Product not found");
      setLoading(false);
    };

    load();
    setQty(1);
    setAdded(false);
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-4xl text-center">
        <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500 text-lg font-semibold">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-4xl text-center">
        <FiPackage className="mx-auto text-gray-300 mb-4" size={48} />
        <p className="text-gray-500 text-lg font-semibold">{error || "Product not found"}</p>
        <Link
          to="/products"
          className="mt-4 inline-flex items-center gap-2 text-orange-600 font-bold text-sm hover:underline"
        >
          <FiArrowLeft /> Back to Products
        </Link>
      </div>
    );
  }

  const inStock = (product.stock ?? 0) > 0;

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 font-bold text-sm mb-8 transition-colors"
      >
        <FiArrowLeft size={16} />
        Back to Products
      </Link>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative bg-gray-50 aspect-square md:aspect-auto md:min-h-[420px]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs">
              {product.category}
            </span>
            {!inStock && (
              <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs uppercase">
                Out of Stock
              </span>
            )}
          </div>

          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              <div className="mt-4 flex items-center gap-3">
                <span className="text-3xl font-black text-gray-900">
                  {Number(product.price).toLocaleString()}
                </span>
                <span className="text-sm font-bold text-orange-600">ETB</span>
              </div>

              <div className="mt-4 flex items-center gap-2">
                {inStock ? (
                  <>
                    <FiCheckCircle className="text-green-500" size={16} />
                    <span className="text-sm font-bold text-green-600">
                      In Stock ({product.stock} available)
                    </span>
                  </>
                ) : (
                  <>
                    <FiXCircle className="text-red-500" size={16} />
                    <span className="text-sm font-bold text-red-500">
                      Currently Unavailable
                    </span>
                  </>
                )}
              </div>

              {product.description && (
                <div className="mt-6">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {product.productDetail && (
                <div className="mt-6">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                    Product Details
                  </h3>
                  <div className="text-gray-600 text-sm leading-relaxed bg-gray-50 rounded-xl p-4 whitespace-pre-wrap">
                    {product.productDetail}
                  </div>
                </div>
              )}

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                    Category
                  </p>
                  <p className="text-sm font-bold text-gray-800 mt-0.5">
                    {product.category}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                    Stock
                  </p>
                  <p className="text-sm font-bold text-gray-800 mt-0.5">
                    {product.stock ?? 0} units
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              {inStock && (
                <div className="flex items-center gap-3 mb-4">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Quantity
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 font-bold text-sm transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-sm font-bold text-gray-900 min-w-[40px] text-center">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty((q) => Math.min(product.stock ?? 99, q + 1))}
                      className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 font-bold text-sm transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`w-full font-bold py-3 px-6 rounded-xl transition-all duration-200 text-sm shadow-xs active:scale-[0.98] inline-flex items-center justify-center gap-2 cursor-pointer ${
                  inStock
                    ? added
                      ? "bg-green-500 text-white"
                      : "bg-gray-900 hover:bg-orange-600 text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <FiShoppingCart size={16} />
                {added
                  ? "Added to Cart!"
                  : inStock
                    ? "Add to Cart"
                    : "Unavailable"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
