import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const tx_ref = searchParams.get("tx_ref");
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    if (!tx_ref) {
      setStatus("missing");
      return;
    }
    axios
      .get(`${API}/api/v1/payments/verify/${tx_ref}`)
      .then((res) => {
        if (res.data.success) setStatus("success");
        else setStatus("failed");
      })
      .catch(() => setStatus("failed"));
  }, [tx_ref]);

  if (status === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-orange-500 border-gray-200 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border rounded-lg shadow-sm p-8 text-center">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto text-3xl mb-4 ${
            status === "success"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {status === "success" ? "\u2713" : "\u2715"}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {status === "success" ? "Payment Successful!" : "Payment Failed"}
        </h2>
        <p className="text-gray-500 text-sm mb-1">
          {status === "success"
            ? "Your payment has been confirmed."
            : "We could not verify your payment."}
        </p>
        {tx_ref && (
          <p className="text-xs text-gray-400 font-mono mb-6">
            Ref: {tx_ref}
          </p>
        )}

        {status === "success" ? (
          <div className="space-y-3">
            <button
              onClick={() => navigate("/tracking")}
              className="w-full bg-orange-500 text-white font-bold py-3 rounded hover:bg-orange-600 transition"
            >
              Go to My Orders
            </button>
            <Link
              to="/"
              className="block w-full bg-white text-orange-500 font-bold py-3 rounded border border-orange-300 hover:bg-orange-50 transition"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <Link
              to="/checkout"
              className="block w-full bg-orange-500 text-white font-bold py-3 rounded hover:bg-orange-600 transition"
            >
              Try Again
            </Link>
            <Link
              to="/"
              className="block w-full bg-white text-gray-600 font-bold py-3 rounded border border-gray-200 hover:bg-gray-50 transition"
            >
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
