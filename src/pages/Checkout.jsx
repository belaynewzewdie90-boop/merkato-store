import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    paymentMethod: "telebirr", // default method
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert("እባክዎ ሁሉንም መረጃዎች በትክክል ይሙሉ (Please fill out all fields)");
      return;
    }

    setLoading(true);

    // Simulate Payment Gateway Authorization Processing (2 seconds delay)
    setTimeout(() => {
      // 1. Generate a unique Order/Transaction ID without a backend
      const uniqueTxRef =
        "MT-" + self.crypto.randomUUID().split("-")[0].toUpperCase();

      // 2. Build the new order structure matching your team's tracking logic
      const newOrder = {
        id: uniqueTxRef,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        customerName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        productName: "Merkato Premium Order Pack", // Replace with real cart context items later
        paymentMethod: formData.paymentMethod.toUpperCase(),
        status: "Placed", // Initial tracking status
      };

      // 3. Save it to localStorage so your tracking dashboard can find it
      const existingOrders =
        JSON.parse(localStorage.getItem("merkato_orders")) || [];
      localStorage.setItem(
        "merkato_orders",
        JSON.stringify([newOrder, ...existingOrders]),
      );

      setLoading(false);

      // 4. Redirect immediately to your dynamic tracking route
      navigate(`/tracking/${uniqueTxRef}`);
    }, 2000);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg my-10 border">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        💳 Checkout & Payment
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Shipping details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name (ስም)
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:outline-none focus:border-orange-500"
            placeholder="Abebe Kebede"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number (ስልክ ቁጥር)
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:outline-none focus:border-orange-500"
            placeholder="0911223344"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Address (አድራሻ)
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:outline-none focus:border-orange-500"
            placeholder="Bahir Dar, Kebele 10"
          />
        </div>

        {/* Payment Selection */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <label className="block text-sm font-bold text-gray-800 mb-3">
            Select Payment Method (የክፍያ አማራጭ)
          </label>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer p-2 bg-white rounded border hover:border-blue-400 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="telebirr"
                checked={formData.paymentMethod === "telebirr"}
                onChange={handleChange}
                className="text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-bold text-blue-600">Telebirr</span>
                <p className="text-xs text-gray-500">
                  Pay securely via your Telebirr mobile wallet.
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer p-2 bg-white rounded border hover:border-green-400 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="cbe_birr"
                checked={formData.paymentMethod === "cbe_birr"}
                onChange={handleChange}
                className="text-green-600 focus:ring-green-500"
              />
              <div>
                <span className="font-bold text-green-600">
                  CBE Birr / Transfer
                </span>
                <p className="text-xs text-gray-500">
                  Pay using Commercial Bank of Ethiopia.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white font-bold py-3 px-4 rounded transition-colors ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"}`}
        >
          {loading
            ? "🔗 Processing Payment Securely..."
            : "🔒 Confirm & Pay Now"}
        </button>
      </form>
    </div>
  );
}
