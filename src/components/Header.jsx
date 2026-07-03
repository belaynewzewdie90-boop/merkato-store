import { Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiHome, FiGrid, FiInfo, FiSettings, FiBookOpen, FiMail, FiShoppingCart } from "react-icons/fi";
import { useAuth } from "../App";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { user, setUser } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate("/", { replace: true });
  };

  return (
    <header className="bg-slate-950 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-6xl">
        <Link
          to="/"
          className="text-xl font-black tracking-tight flex items-center shrink-0"
        >
          <span className="text-white">Merkato</span>
          <span className="text-orange-500 ml-1">Store</span>
        </Link>

        <nav className="flex items-center gap-1 md:gap-5 overflow-x-auto scrollbar-none mx-2 md:mx-4">
          <Link
            to="/"
            className="text-xs md:text-sm font-semibold text-gray-300 hover:text-orange-500 transition-colors flex items-center gap-1.5 whitespace-nowrap px-2 py-1"
          >
            <FiHome className="shrink-0" />
            <span className="hidden md:inline">Home</span>
          </Link>
          <Link
            to="/products"
            className="text-xs md:text-sm font-semibold text-gray-300 hover:text-orange-500 transition-colors flex items-center gap-1.5 whitespace-nowrap px-2 py-1"
          >
            <FiGrid className="shrink-0" />
            <span className="hidden md:inline">Products</span>
          </Link>
          <Link
            to="/about"
            className="text-xs md:text-sm font-semibold text-gray-300 hover:text-orange-500 transition-colors flex items-center gap-1.5 whitespace-nowrap px-2 py-1"
          >
            <FiInfo className="shrink-0" />
            <span className="hidden md:inline">About</span>
          </Link>
          <Link
            to="/services"
            className="text-xs md:text-sm font-semibold text-gray-300 hover:text-orange-500 transition-colors flex items-center gap-1.5 whitespace-nowrap px-2 py-1"
          >
            <FiSettings className="shrink-0" />
            <span className="hidden md:inline">Services</span>
          </Link>
          <Link
            to="/blog"
            className="text-xs md:text-sm font-semibold text-gray-300 hover:text-orange-500 transition-colors flex items-center gap-1.5 whitespace-nowrap px-2 py-1"
          >
            <FiBookOpen className="shrink-0" />
            <span className="hidden md:inline">Blog</span>
          </Link>
          <Link
            to="/contact"
            className="text-xs md:text-sm font-semibold text-gray-300 hover:text-orange-500 transition-colors flex items-center gap-1.5 whitespace-nowrap px-2 py-1"
          >
            <FiMail className="shrink-0" />
            <span className="hidden md:inline">Contact</span>
          </Link>
        </nav>

        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          <Link
            to="/cart"
            className="relative text-gray-300 hover:text-orange-500 transition-colors"
          >
            <FiShoppingCart className="text-lg md:text-xl" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <span className="text-xs md:text-sm text-gray-300 hidden sm:inline">
                👋 {user.firstName || "User"}
              </span>

              <button
                onClick={handleLogout}
                className="text-xs font-bold text-red-400 bg-red-400/10 border border-red-400/30 px-2 md:px-3 py-1.5 rounded-lg hover:bg-red-400/20 transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <FiLogOut />
                <span className="hidden md:inline">Logout</span>
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 px-3 md:px-4 py-2 rounded-lg transition-all shadow-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}