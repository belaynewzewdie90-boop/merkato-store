import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock, FiShield } from "react-icons/fi";
import { useAuth } from "../App";

const ADMIN_SECRET_KEY = "ADMIN-KEY-2024";

export default function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (isAdminMode) {
      if (secretCode !== ADMIN_SECRET_KEY) {
        setError("Invalid Admin Secret Passcode. Access denied.");
        return;
      }
      setUser({ firstName: "Admin", role: "admin" });
      navigate("/admin/dashboard", { replace: true });
    } else {
      if (!email || !password) {
        setError("Please enter your email and password.");
        return;
      }
      setUser({ firstName: "Customer", role: "user" });
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-block text-3xl font-black tracking-tight"
          >
            <span className="text-gray-900">Merkato</span>
            <span className="text-orange-500 ml-1">Store</span>
          </Link>
          <p className="text-gray-500 text-sm mt-2">
            {isAdminMode
              ? "Administrator authentication required"
              : "Sign in to your account"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">
                Email Address
              </label>
              <div className="flex items-center border border-gray-200 rounded-xl px-3 focus-within:ring-2 focus-within:ring-orange-500 transition-all bg-gray-50/50">
                <FiMail className="text-gray-400 shrink-0" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full p-3 text-sm outline-none bg-transparent"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">
                Password
              </label>
              <div className="flex items-center border border-gray-200 rounded-xl px-3 focus-within:ring-2 focus-within:ring-orange-500 transition-all bg-gray-50/50">
                <FiLock className="text-gray-400 shrink-0" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3 text-sm outline-none bg-transparent"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Admin Access
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsAdminMode((prev) => !prev);
                  setError("");
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                  isAdminMode ? "bg-orange-500" : "bg-gray-200"
                }`}
                role="switch"
                aria-checked={isAdminMode}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition-transform ${
                    isAdminMode ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            {isAdminMode && (
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">
                  Admin Secret Passcode (Key)
                </label>
                <div className="flex items-center border border-gray-200 rounded-xl px-3 focus-within:ring-2 focus-within:ring-orange-500 transition-all bg-gray-50/50">
                  <FiShield className="text-gray-400 shrink-0" />
                  <input
                    type="password"
                    value={secretCode}
                    onChange={(e) => setSecretCode(e.target.value)}
                    placeholder="Enter admin secret key"
                    className="w-full p-3 text-sm outline-none bg-transparent"
                  />
                </div>
              </div>
            )}

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 font-semibold">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all text-sm shadow-lg shadow-orange-500/20 active:scale-[0.98] cursor-pointer"
            >
              {isAdminMode ? "Sign In as Administrator" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Don't have an account?{" "}
            <Link
              to="/login"
              className="text-orange-500 font-bold hover:underline"
            >
              Register
            </Link>
          </p>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="bg-orange-50 rounded-xl px-4 py-3">
              <p className="text-[10px] font-bold text-orange-700 uppercase tracking-wider">
                {isAdminMode
                  ? "Requires valid secret passcode"
                  : "Standard customer login"}
              </p>
              <p className="text-[10px] text-orange-600 mt-0.5">
                {isAdminMode
                  ? "Enter the correct Admin Secret Key to access the dashboard"
                  : "No account needed — sign in as a guest to browse"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
