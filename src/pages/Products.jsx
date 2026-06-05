import { useCart } from "../context/CartContext";

const MERKATO_PRODUCTS = [
  {
    id: 1,
    name: "Premium Ethiopian Leather Shoes",
    price: 3400,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80",
    description:
      "100% genuine handcrafted local leather with exceptional durable sole structures.",
  },
  {
    id: 2,
    name: "Traditional Handcrafted Coffee Set",
    price: 1850,
    category: "Home & Living",
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
    description:
      "Classic ceramic jebena and coordinate cups setup for genuine cultural brewing.",
  },
  {
    id: 3,
    name: "Premium Woven Cotton Scarf (Netela)",
    price: 1200,
    category: "Traditional Textiles",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80",
    description:
      "Elegant, lightweight pure cotton hand-woven by local masters with golden tilet boundaries.",
  },
  {
    id: 4,
    name: "Organic Harar Coffee Beans (1KG)",
    price: 950,
    category: "Food & Beverage",
    image:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&auto=format&fit=crop&q=80",
    description:
      "Sun-dried single-origin medium roast Arabica beans with distinctive fruity notes.",
  },
];

export default function Products() {
  // Inside the function, call  global hook cleanly
  const { addToCart } = useCart();

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      {/* Header Section */}
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
          <span className="text-gray-900 font-bold">
            {MERKATO_PRODUCTS.length}
          </span>{" "}
          authentic products
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MERKATO_PRODUCTS.map((product) => (
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
                className="w-full bg-gray-900 hover:bg-orange-600 text-white font-bold py-2.5 px-4 rounded-xl transition-all duration-200 text-sm shadow-xs active:scale-[0.98] cursor-pointer"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
