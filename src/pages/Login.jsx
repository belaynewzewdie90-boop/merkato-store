import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import { useAuth } from "../App";
import { socket } from "../services/socket";

export default function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        setLoading(false);
        return;
      }

      setUser(data.user);
      localStorage.setItem("merkato_current_user", JSON.stringify(data.user));
      localStorage.setItem("merkato_access_token", data.accessToken);
      localStorage.setItem("merkato_refresh_token", data.refreshToken);

      setLoading(false);

      if (data.user.role === "admin") {
        socket.emit("admin_login_event", {
          email: data.user.email,
          timestamp: new Date(),
        });
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError("Connection error. Please check your network and try again.");
      setLoading(false);
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
            Sign in to your account
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

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 font-semibold">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all text-sm shadow-lg shadow-orange-500/20 active:scale-[0.98] cursor-pointer disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>

            <div className="text-right -mt-3">
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-orange-500 hover:text-orange-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Don't have an account?{" "}
            <Link
              to="/auth"
              className="text-orange-500 font-bold hover:underline"
            >
              Register
            </Link>
          </p>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="bg-orange-50 rounded-xl px-4 py-3">
              <p className="text-[10px] font-bold text-orange-700 uppercase tracking-wider">
                Secure customer login
              </p>
              <p className="text-[10px] text-orange-600 mt-0.5">
                Sign in with your email and password to access your account
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
