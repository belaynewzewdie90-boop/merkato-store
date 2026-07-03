import { Navigate, Link, Outlet, useLocation } from "react-router-dom";
import { FiGrid, FiLogOut, FiHome, FiFileText } from "react-icons/fi";
import { useAuth } from "../App";

export default function AdminLayout() {
  const { user, setUser } = useAuth();
  const location = useLocation();

  if (!user || user.role !== "admin") {
    return <Navigate to="/auth" replace />;
  }

  const handleLogout = () => {
    setUser(null);
  };

  const isActive = (path) =>
    location.pathname === path
      ? "bg-orange-500/20 text-orange-400 border-l-4 border-orange-500 font-bold"
      : "text-gray-400 hover:text-white hover:bg-slate-800 border-l-4 border-transparent";

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 bg-slate-900 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <Link
            to="/admin/dashboard"
            className="text-xl font-black tracking-tight"
          >
            <span className="text-white">Merkato</span>
            <span className="text-orange-500 ml-1">Admin</span>
          </Link>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1 font-semibold">
            Control Panel
          </p>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-3">
          <Link
            to="/admin/dashboard"
            className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-r-lg transition-all ${isActive("/admin/dashboard")}`}
          >
            <FiGrid className="shrink-0" />
            Dashboard
          </Link>
          <Link
            to="/admin/orders"
            className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-r-lg transition-all ${isActive("/admin/orders")}`}
          >
            <FiFileText className="shrink-0" />
            Orders
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          >
            <FiHome className="shrink-0" />
            Back to Store
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-all cursor-pointer"
          >
            <FiLogOut className="shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-auto bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-gray-900">
            Welcome, Admin
          </h2>
        </header>

        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
