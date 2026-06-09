import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();

  const getRedirect = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("redirect") || "/products";
  };
  const [isLogin, setIsLogin] = useState(true); // Toggle between Sign In and Sign Up views
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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

    // If a user is already logged in, redirect them out automatically
    const sessionActive = localStorage.getItem("merkato_current_user");
    if (sessionActive) {
      const user = JSON.parse(sessionActive);
      user.role === "admin" ? navigate("/admin") : navigate(getRedirect());
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(""); // Instantly remove warnings while typing
  };

  // 📝 NEW USER REGISTRATION WORKFLOW
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const existingUsers =
      JSON.parse(localStorage.getItem("merkato_users_db")) || [];

    // Security Rule 1: Block general signups using the master admin address
    if (formData.email.toLowerCase() === "admin@merkato.com") {
      setError(
        "This specific email address is strictly reserved for store systems.",
      );
      setLoading(false);
      return;
    }

    // Security Rule 2: Password Check
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please verify your typing.");
      setLoading(false);
      return;
    }

    // Security Rule 3: Account Duplication Check
    const emailExists = existingUsers.some(
      (u) => u.email.toLowerCase() === formData.email.toLowerCase(),
    );
    if (emailExists) {
      setError("An account with this email address is already registered.");
      setLoading(false);
      return;
    }

    // Create unique client profile object
    const newCustomer = {
      id: `USR-${Date.now()}`,
      name: formData.name,
      email: formData.email.toLowerCase(),
      password: formData.password,
      role: "customer",
    };

    // Commit safely to database alongside the admin
    localStorage.setItem(
      "merkato_users_db",
      JSON.stringify([...existingUsers, newCustomer]),
    );
    localStorage.setItem("merkato_current_user", JSON.stringify(newCustomer));

    setTimeout(() => {
      setLoading(false);
      navigate(getRedirect());
    }, 800);
  };

  // 🔑 SESSION LOGIN WORKFLOW
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const existingUsers =
      JSON.parse(localStorage.getItem("merkato_users_db")) || [];

    const foundUser = existingUsers.find(
      (u) =>
        u.email.toLowerCase() === formData.email.toLowerCase() &&
        u.password === formData.password,
    );

    if (!foundUser) {
      setError("Invalid credential combination. Check email or password.");
      setLoading(false);
      return;
    }

    // Save current active user token mapping
    localStorage.setItem("merkato_current_user", JSON.stringify(foundUser));

    setTimeout(() => {
      setLoading(false);
      if (
        foundUser.role === "admin" ||
        foundUser.email.toLowerCase() === "admin@merkato.com"
      ) {
        navigate("/admin");
      } else {
        navigate(getRedirect());
      }
    }, 800);
  };

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

        {/* Unified Application Form Control */}
        <form
          onSubmit={isLogin ? handleLoginSubmit : handleRegisterSubmit}
          className="space-y-4"
        >
          {!isLogin && (
            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-sm text-gray-900 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-gray-50/50"
                placeholder="Jhon Kebede"
              />
            </div>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 text-sm font-bold text-white bg-orange-500 rounded-2xl hover:bg-orange-600 transition-all shadow-md shadow-orange-500/10 active:scale-[0.99] disabled:opacity-50 cursor-pointer flex justify-center items-center"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isLogin ? (
              "Login In Account"
            ) : (
              "Complete Register"
            )}
          </button>
        </form>

        {/* Interface Panel Navigation Toggle Link */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-sm text-center text-gray-600">
          {isLogin ? "New customer to Merkato?" : "Already possess a profile?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
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
