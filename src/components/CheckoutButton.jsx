import React, { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "";

export default function CheckoutButton({ amount, orderId, customerData }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API}/api/v1/payments/initialize`, {
        amount,
        email: customerData?.email || "customer@example.com",
        first_name: customerData?.firstName || "Abebe",
        last_name: customerData?.lastName || "Beso",
        phone_number: customerData?.phone || "0912345678",
        orderId,
      });

      if (response.data.success && response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full py-3 px-6 text-white font-bold bg-orange-500 rounded-lg shadow hover:bg-orange-600 transition disabled:bg-gray-400"
    >
      {loading ? "Redirecting to Chapa..." : `Pay ${amount} ETB with Chapa`}
    </button>
  );
}
