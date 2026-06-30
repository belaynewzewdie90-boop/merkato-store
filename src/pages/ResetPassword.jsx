import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify your typing.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/reset-password/${token}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        },
      );

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        setLoading(false);
        return;
      }

      setSuccess(data.message);
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError("Connection error. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-12 bg-gradient-to-b from-white to-gray-50">
        <div className="w-full max-w-md p-8 bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-100/70 text-center">
          <div className="p-4 mb-5 text-xs font-semibold text-red-700 bg-red-50 border border-red-100 rounded-2xl">
            Invalid reset link. No token provided.
          </div>
          <Link
            to="/forgot-password"
            className="font-bold text-orange-500 hover:text-orange-600 hover:underline text-sm"
          >
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="w-full max-w-md p-8 bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-100/70">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black tracking-tight text-gray-900">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Enter your new password below
          </p>
        </div>

        {error && (
          <div className="p-4 mb-5 text-xs font-semibold text-red-700 bg-red-50 border border-red-100 rounded-2xl">
            {error}
          </div>
        )}

        {success ? (
          <>
            <div className="p-4 mb-5 text-xs font-semibold text-green-700 bg-green-50 border border-green-100 rounded-2xl">
              {success}
            </div>
            <div className="text-center">
              <Link
                to="/login"
                className="inline-block w-full py-3.5 text-sm font-bold text-white bg-orange-500 rounded-2xl hover:bg-orange-600 transition-all shadow-md shadow-orange-500/10"
              >
                Go to Login
              </Link>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-700">
                New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                className="w-full px-4 py-3 text-sm text-gray-900 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-gray-50/50"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError("");
                }}
                className="w-full px-4 py-3 text-sm text-gray-900 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-gray-50/50"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 text-sm font-bold text-white bg-orange-500 rounded-2xl hover:bg-orange-600 transition-all shadow-md shadow-orange-500/10 active:scale-[0.99] disabled:opacity-50 cursor-pointer flex justify-center items-center"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        )}

        {!success && (
          <div className="mt-8 pt-6 border-t border-gray-100 text-sm text-center text-gray-600">
            <Link
              to="/login"
              className="font-bold text-orange-500 hover:text-orange-600 hover:underline"
            >
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
