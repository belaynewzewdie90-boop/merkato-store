import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Checkout({ cart, clearCart }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);

  const totalCost =
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 150;

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate order submission timeline
    setTimeout(() => {
      clearCart();
      alert(
        `Thank you, ${formData.fullName}! Your Cash-on-Delivery order has been placed.`,
      );
      setLoading(false);
      navigate("/"); // Automatically redirects users back home
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Delivery Checkout
      </h2>
      <form onSubmit={handleOrderSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Delivery Drop-off Location
          </label>
          <input
            type="text"
            required
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>

        <div className="bg-gray-50 p-3 rounded-lg text-sm my-4 font-medium text-gray-700">
          Total to Pay (with delivery):{" "}
          <span className="font-bold text-gray-900">{totalCost} ETB</span>
        </div>

        <button
          type="submit"
          disabled={loading || cart.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-lg transition-all shadow"
        >
          {loading ? "Processing Order..." : "Place Cash on Delivery Order"}
        </button>
      </form>
    </div>
  );
}
