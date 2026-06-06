import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiLock, FiUser, FiArrowLeft } from "react-icons/fi";
import { useAdmin } from "../context/AdminContext";

export default function AdminLogin() {
  const { login, isAuthed } = useAdmin();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  if (isAuthed) {
    navigate("/admin", { replace: true });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const ok = login(form.username.trim(), form.password);
    if (ok) {
      navigate("/admin", { replace: true });
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10 bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 mb-6 font-medium"
        >
          <FiArrowLeft /> Back to store
        </Link>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
          <div className="mb-6 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gray-900 flex items-center justify-center mb-4">
              <FiLock className="text-orange-500 text-xl" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Admin Login
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Sign in to manage the Merkato store
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Username
              </label>
              <div className="mt-1 flex items-center border border-gray-200 rounded-xl px-3 focus-within:ring-2 focus-within:ring-orange-500 transition-all">
                <FiUser className="text-gray-400" />
                <input
                  type="text"
                  required
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  placeholder="admin"
                  className="w-full p-2.5 text-sm outline-none bg-transparent"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Password
              </label>
              <div className="mt-1 flex items-center border border-gray-200 rounded-xl px-3 focus-within:ring-2 focus-within:ring-orange-500 transition-all">
                <FiLock className="text-gray-400" />
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full p-2.5 text-sm outline-none bg-transparent"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl transition-all text-sm shadow-xs active:scale-[0.98] cursor-pointer"
            >
              Sign In
            </button>

            <p className="text-[11px] text-center text-gray-400 pt-2">
              Default credentials: <span className="font-bold text-gray-600">admin</span> / <span className="font-bold text-gray-600">admin123</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
