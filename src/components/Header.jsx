import { Link, useLocation, useNavigate } from "react-router-dom"; // Added useNavigate for logout
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { cart } = useCart();
  const location = useLocation();
  const navigate = useNavigate(); // Hook to redirect users on logout

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // 👤 Read the active session from LocalStorage
  const currentUser = JSON.parse(localStorage.getItem("merkato_current_user"));

  // 🚪 Clean Logout process: Removes active session session, leaves databases alone
  const handleLogout = () => {
    localStorage.removeItem("merkato_current_user");
    navigate("/login"); // Instantly redirect to the authentication portal
  };

  const linkStyle = (path) =>
    `text-sm font-semibold transition-colors duration-200 ${
      location.pathname === path
        ? "text-orange-500 border-b-2 border-orange-500 pb-1"
        : "text-gray-600 hover:text-orange-500"
    }`;

  return (
    <header className="glass sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-6xl">
        {/* Brand Logo with Two-Tone Colors */}
        <Link
          to="/"
          className="text-2xl font-black tracking-tight flex items-center"
        >
          <span className="text-gray-900">Merkato</span>
          <span className="text-orange-500 ml-1">Store</span>
        </Link>

        {/* Navigation Center Menu */}
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
          <Link to="/tracking" className={linkStyle("/tracking")}>
            My Orders
          </Link>
          <Link to="/contact" className={linkStyle("/contact")}>
            Contact
          </Link>
          <Link to="/blog" className={linkStyle("/blog")}>
            Blog
          </Link>
          <Link to="/address" className={linkStyle("/address")}>
            Address
          </Link>
          <Link to="/admin/login" className={linkStyle("/admin/login")}>
            Admin
          </Link>
        </nav>

        {/* Action Container: Cart & Auth Buttons */}
        <div className="flex items-center gap-6">
          {/* Cart Badge */}
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

          {/* 🔐 AUTH CONTROLLER: Swaps dynamically based on login status */}
          {currentUser ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-xs font-bold text-gray-700 bg-gray-100 px-2.5 py-1.5 rounded-lg border border-gray-200">
                Hi, {currentUser.name.split(" ")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-3.5 py-2 rounded-xl hover:bg-red-100 transition-all duration-200 cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-xs font-bold text-white bg-orange-500 px-4 py-2 rounded-xl hover:bg-orange-600 shadow-xs transition-all duration-200"
            >
              Login / Register
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
