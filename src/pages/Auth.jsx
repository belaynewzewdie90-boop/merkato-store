import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../App";
import { socket } from "../services/socket"; // 🔌 Import your live socket instance

export default function Auth() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const getRedirect = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("redirect") || "/products";
  };
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const toggleAdminMode = () => {
    const next = !isAdminMode;
    setIsAdminMode(next);
    setError("");
    if (next) {
      setFormData((prev) => ({ ...prev, email: "admin@merkato.com" }));
    }
  };

  // 🔐 BACKUP SEEDER: Double check that the admin exists whenever this page mounts
  useEffect(() => {
    const existingUsers =
      JSON.parse(localStorage.getItem("merkato_users_db")) || [];
    const adminExists = existingUsers.some(
      (user) => user.email.toLowerCase() === "admin@merkato.com",
    );

    if (!adminExists) {
      const defaultAdmin = {
        id: "USR-ADMIN-MASTER",
        name: "Store Manager",
        email: "admin@merkato.com",
        password: "admin123",
        role: "admin",
      };
      localStorage.setItem(
        "merkato_users_db",
        JSON.stringify([...existingUsers, defaultAdmin]),
      );
    }

    const sessionActive = localStorage.getItem("merkato_current_user");
    if (sessionActive) {
      const user = JSON.parse(sessionActive);
      user.role === "admin" ? navigate("/admin") : navigate(getRedirect());
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  // 📝 NEW USER REGISTRATION WORKFLOW
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please verify your typing.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            acceptTerms: formData.acceptTerms,
          }),
        },
      );

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      setSuccess(data.message);
      setError("");
      setIsLogin(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
      });
    } catch (err) {
      setError("Connection error. Please check your network and try again.");
      setLoading(false);
    }
  };

  // 🔑 SESSION LOGIN WORKFLOW
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (isAdminMode) {
      setError("");
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
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

      // ⚡ Emit real-time live alert over WebSockets if user logs in as Admin
      if (data.user.role === "admin") {
        socket.emit("admin_login_event", {
          email: data.user.email,
          timestamp: new Date(),
        });
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate(getRedirect());
      }
    } catch (err) {
      setError("Connection error. Please check your network and try again.");
      setLoading(false);
    }
  };

  // 🌐 GOOGLE AUTHENTICATION WORKFLOW
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/auth/google`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accessToken: tokenResponse.access_token }),
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

        // ⚡ Emit live WebSocket transmission layer for Google Admin profile match
        if (data.user.role === "admin") {
          socket.emit("admin_login_event", {
            email: data.user.email,
            timestamp: new Date(),
          });
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate(getRedirect());
        }
      } catch {
        setError("Google sign-in failed. Please try again.");
        setLoading(false);
      }
    },
    onError: () => {
      setError("Google sign-in failed. Please try again.");
    },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="w-full max-w-md p-8 bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-100/70">
        {/* Header Heading Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black tracking-tight text-gray-900">
            {isLogin ? "Welcome Back" : "Get Started"}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {isLogin
              ? "Sign in to manage your orders and cart"
              : "Create an account to unlock full benefits"}
          </p>
        </div>

        {/* Dynamic Alerts */}
        {error && (
          <div className="p-4 mb-5 text-xs font-semibold text-red-700 bg-red-50 border border-red-100 rounded-2xl animate-shake">
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 mb-5 text-xs font-semibold text-green-700 bg-green-50 border border-green-100 rounded-2xl">
            {success}
          </div>
        )}

        {/* Unified Application Form Control */}
        <form
          onSubmit={isLogin ? handleLoginSubmit : handleRegisterSubmit}
          className="space-y-4"
        >
          {!isLogin && (
            <>
              <div>
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-sm text-gray-900 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-gray-50/50"
                  placeholder="Jhon"
                />
              </div>
              <div>
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-sm text-gray-900 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-gray-50/50"
                  placeholder="Kebede"
                />
              </div>
            </>
          )}

          <div>
            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 text-sm text-gray-900 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-gray-50/50"
              placeholder="jhon@mail.com"
            />
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 text-sm text-gray-900 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-gray-50/50"
              placeholder="••••••••"
            />
          </div>

          {isLogin && (
            <div className="text-right -mt-2">
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-orange-500 hover:text-orange-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          )}

          {isLogin && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Admin Access
              </span>
              <button
                type="button"
                onClick={toggleAdminMode}
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
          )}

          {!isLogin && (
            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-sm text-gray-900 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-gray-50/50"
                placeholder="••••••••"
              />
            </div>
          )}

          {!isLogin && (
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={(e) =>
                  setFormData({ ...formData, acceptTerms: e.target.checked })
                }
                className="mt-0.5 w-4 h-4 accent-orange-500"
              />
              <span className="text-xs text-gray-500 leading-relaxed">
                I accept the{" "}
                <span className="text-orange-500 font-semibold">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="text-orange-500 font-semibold">
                  Privacy Policy
                </span>
              </span>
            </label>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 text-sm font-bold text-white bg-orange-500 rounded-2xl hover:bg-orange-600 transition-all shadow-md shadow-orange-500/10 active:scale-[0.99] disabled:opacity-50 cursor-pointer flex justify-center items-center"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isAdminMode ? (
              "Sign In as Administrator"
            ) : isLogin ? (
              "Login In Account"
            ) : (
              "Complete Register"
            )}
          </button>
        </form>

        {/* Divider */}
        {!isAdminMode && (
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-400 font-semibold">
                Or continue with
              </span>
            </div>
          </div>
        )}

        {/* Google Sign-In Button */}
        {!isAdminMode && (
          <button
            onClick={() => googleLogin()}
            className="w-full py-3 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center gap-3 cursor-pointer"
          >
            <FcGoogle className="text-xl" />
            {isLogin ? "Sign in with Google" : "Sign up with Google"}
          </button>
        )}

        {/* Interface Panel Navigation Toggle Link */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-sm text-center text-gray-600">
          {isLogin ? "New customer to Merkato?" : "Already possess a profile?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setIsAdminMode(false);
              setError("");
              setSuccess("");
              setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: "",
                acceptTerms: false,
              });
            }}
            className="font-bold text-orange-500 hover:text-orange-600 hover:underline focus:outline-none cursor-pointer"
          >
            {isLogin ? "Create account here" : "Sign in here"}
          </button>
        </div>
      </div>
    </div>
  );
}
