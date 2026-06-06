import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiLogOut, FiGrid, FiPackage, FiArrowLeft, FiFileText } from "react-icons/fi";
import { useAdmin } from "../context/AdminContext";

export default function AdminNavbar() {
  const { logout } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();

  const linkStyle = (path) =>
    `text-sm font-semibold transition-colors duration-200 px-3 py-1.5 rounded-lg ${
      location.pathname === path
        ? "bg-orange-500 text-white"
        : "text-gray-600 hover:text-orange-500 hover:bg-orange-50"
    }`;

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100 backdrop-blur-md bg-white/95">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center max-w-6xl">
        <div className="flex items-center gap-6">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center">
              <FiGrid className="text-orange-500" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-black text-gray-900 tracking-tight">
                Merkato Admin
              </p>
              <p className="text-[10px] text-gray-400 font-semibold uppercase">
                Control Panel
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <Link to="/admin" className={linkStyle("/admin")}>
              <FiPackage className="inline mr-1 -mt-0.5" /> Products
            </Link>
            <Link to="/admin/orders" className={linkStyle("/admin/orders")}>
              <FiFileText className="inline mr-1 -mt-0.5" /> Orders
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="text-xs font-bold text-gray-500 hover:text-orange-500 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-gray-50"
          >
            <FiArrowLeft /> Store
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs font-bold text-white bg-gray-900 hover:bg-orange-600 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>
    </header>
  );
}
