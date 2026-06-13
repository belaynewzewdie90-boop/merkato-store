import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Added useNavigate for logout
import { FiShoppingCart, FiSearch } from "react-icons/fi";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { cart } = useCart();
  const location = useLocation();
  const navigate = useNavigate(); // Hook to redirect users on logout
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchOpen(false);
      setSearchVal("");
    }
  };

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

        {/* Global Search */}
        <div ref={searchRef} className="relative">
          {searchOpen ? (
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search products..."
                autoFocus
                className="w-40 md:w-56 border border-gray-200 rounded-xl py-2 pl-3 pr-8 text-sm outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 cursor-pointer"
              >
                <FiSearch size={16} />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 hover:bg-gray-50 rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer"
              aria-label="Open search"
            >
              <FiSearch className="text-xl text-gray-700 hover:text-orange-500 transition-colors" />
            </button>
          )}
        </div>

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
