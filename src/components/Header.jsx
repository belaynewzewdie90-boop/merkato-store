import { Link, useLocation } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { cart } = useCart();
  const location = useLocation(); 
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const linkStyle = (path) =>
    `text-sm font-semibold transition-colors duration-200 ${
      location.pathname === path
        ? "text-orange-500 border-b-2 border-orange-500 pb-1"
        : "text-gray-600 hover:text-orange-500"
    }`;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100 backdrop-blur-md bg-white/95">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-6xl">
        {/* Brand Logo with Two-Tone Colors */}
        <Link
          to="/"
          className="text-2xl font-black tracking-tight flex items-center"
        >
          <span className="text-gray-900">Merkato</span>
          <span className="text-orange-500 ml-1">Store</span>
        </Link>

        {/*   Navigation Center Menu */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className={linkStyle("/")}>
            Home
          </Link>
          <Link to="/products" className={linkStyle("/products")}>
            Products
          </Link>
          <Link to="/services" className={linkStyle("/services")}>
            Services
          </Link>
          <Link to="/about" className={linkStyle("/about")}>
            About
          </Link>
          <Link to="/contact" className={linkStyle("/contact")}>
            Contact
          </Link>
        </nav>

        {/* Cart Badge */}
        <div className="flex items-center gap-4">
          <Link
            to="/cart"
            className="relative p-2.5 hover:bg-gray-50 rounded-xl transition-all duration-200 flex items-center justify-center group"
            aria-label="View Shopping Cart"
          >
            <FiShoppingCart className="text-xl text-gray-700 group-hover:text-orange-500 transition-colors" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-xs animate-pulse">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
