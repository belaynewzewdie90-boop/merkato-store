import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import { createOrder } from "../api/api";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "";

const saveOrderToLocalStorage = (order, orderId) => {
  try {
    const existing = JSON.parse(localStorage.getItem("merkato_orders") || "[]");
    const currentUser = (() => { try { return JSON.parse(localStorage.getItem("merkato_current_user")); } catch { return null; } })();
    const newEntry = {
      ...order,
      id: orderId,
      backendId: orderId,
      userEmail: currentUser?.email || null,
      status: "Placed",
      paidAt: null,
      createdAt: new Date().toISOString(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    const exists = existing.some((o) => o.id === orderId || o.backendId === orderId);
    if (!exists) {
      localStorage.setItem("merkato_orders", JSON.stringify([newEntry, ...existing]));
    }
  } catch (err) {
    console.error("Failed to save order to localStorage backup:", err);
  }
};

export default function Checkout() {
  const navigate = useNavigate();
  const { addOrder } = useAdmin();
  const currentUser = JSON.parse(localStorage.getItem("merkato_current_user"));

  useEffect(() => {
    if (!currentUser) {
      navigate("/login?redirect=/checkout");
    }
  }, [currentUser, navigate]);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedId, setGeneratedId] = useState("");

  const fullName = currentUser
    ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim()
    : "";

  const [formData, setFormData] = useState({
    fullName,
    phone: "",
    address: "",
    paymentMethod: "chapa",
    enteredCost: "",
    accountNumber: "",
    walletNumber: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.address ||
      !formData.enteredCost
    ) {
      alert("Please fill out all fields, including the product cost.");
      return;
    }
    if (formData.paymentMethod === "telebirr" && !formData.walletNumber) {
      alert("Please enter your Telebirr phone number.");
      return;
    }
    if (formData.paymentMethod === "cbe" && !formData.accountNumber) {
      alert("Please enter your CBE account number.");
      return;
    }

    setLoading(true);

    if (formData.paymentMethod === "chapa") {
      try {
        const cartItems = JSON.parse(localStorage.getItem("merkato_cart") || "[]");
        const res = await axios.post(`${API}/api/v1/payments/initialize`, {
          amount: parseFloat(formData.enteredCost),
          email: currentUser?.email || "customer@example.com",
          first_name: currentUser?.firstName || formData.fullName.split(" ")[0],
          last_name: currentUser?.lastName || formData.fullName.split(" ").slice(1).join(" "),
          phone_number: formData.phone,
          customerName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          items: cartItems.map((item) => ({
            name: item.title || item.name,
            price: item.price,
            qty: item.quantity || 1,
            image: item.image || item.thumbnail || "",
          })),
          totalPaid: parseFloat(formData.enteredCost),
        });
        if (res.data.success && res.data.checkoutUrl) {
          localStorage.removeItem("merkato_cart");
          window.location.href = res.data.checkoutUrl;
          return;
        }
      } catch (err) {
        console.error("Chapa init error:", err);
        alert("Failed to start Chapa payment. Please try again.");
        setLoading(false);
        return;
      }
    }

    setTimeout(async () => {
      const newOrder = {
        customerName: formData.fullName,
        email: currentUser?.email || "",
        phone: formData.phone,
        address: formData.address,
        totalPaid: parseFloat(formData.enteredCost),
        paymentMethod:
          formData.paymentMethod === "telebirr"
            ? "Telebirr Wallet"
            : "CBE Bank",
        paymentDetails:
          formData.paymentMethod === "telebirr"
            ? formData.walletNumber
            : formData.accountNumber,
        paymentStatus: "Received",
        amountPaid: parseFloat(formData.enteredCost),
      };

      try {
        const backendOrder = await createOrder(newOrder);
        const backendId = backendOrder._id || backendOrder.id;
        addOrder(newOrder, backendId);
        setGeneratedId(backendId);
        // Backup: directly save to localStorage
        saveOrderToLocalStorage(newOrder, backendId);
      } catch (err) {
        console.error("Failed to save order to backend:", err);
        const localId = addOrder(newOrder);
        setGeneratedId(localId);
        saveOrderToLocalStorage(newOrder, localId);
      }
      setLoading(false);
      setIsSuccess(true);
      localStorage.removeItem("merkato_cart");
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto my-10 p-8 bg-white border border-gray-200 rounded-lg shadow-sm text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl mb-4">
          ✓
        </div>
        <h2 className="text-2xl font-bold text-gray-950">
          Order Complete!
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Thank you, Customer. We will deliver to your address.
        </p>

        <div className="bg-gray-50 p-5 rounded-lg my-6 text-left border border-gray-100 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Generated Order ID:</span>
            <span className="font-mono font-bold text-gray-900">
              {generatedId}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Amount Paid:</span>
            <span className="font-bold text-orange-500">
              {formData.enteredCost} ETB
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate("/tracking")}
          className="w-full bg-orange-500 text-white font-bold py-3 rounded hover:bg-orange-600 transition-all"
        >
          Go to My Orders
        </button>
        <button
          onClick={() => navigate(`/order/${generatedId}`)}
          className="w-full bg-white text-orange-500 font-bold py-3 rounded border border-orange-300 hover:bg-orange-50 transition-all mt-3"
        >
          View Order Details
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto my-10 p-6 bg-white border rounded-lg shadow-sm">
      {loading && (
        <div className="fixed inset-0 bg-black/40 z-50 flex flex-col items-center justify-center text-white space-y-2">
          <div className="w-10 h-10 border-4 border-t-orange-500 border-white/20 rounded-full animate-spin"></div>
          <p className="text-sm font-medium">Processing payment...</p>
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-950 mb-6 border-b pb-2">
        💳 Order Payment Method
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
            Customer Name
          </label>
          <input
            type="text"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full border p-2.5 rounded text-sm outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
            Phone Number
          </label>
          <input
            type="text"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="w-full border p-2.5 rounded text-sm outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
            Delivery Address
          </label>
          <input
            type="text"
            name="address"
            required
            value={formData.address}
            onChange={handleChange}
            placeholder="Bahir Dar, Kebele 11"
            className="w-full border p-2.5 rounded text-sm outline-none focus:border-orange-500"
          />
        </div>

        {/* Dynamic Cost input section */}
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
            Enter Cost of Product (ETB)
          </label>
          <input
            type="number"
            name="enteredCost"
            required
            value={formData.enteredCost}
            onChange={handleChange}
            placeholder="e.g. 2500"
            className="w-full border p-2.5 rounded font-bold text-sm text-orange-600 outline-none focus:border-orange-500 bg-orange-50/20"
          />
        </div>

        <div className="pt-2">
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Select Payment Option
          </label>
          <div className="grid grid-cols-3 gap-3">
            <label
              className={`border p-3 rounded-lg cursor-pointer text-center block ${formData.paymentMethod === "chapa" ? "border-orange-500 bg-orange-50/50 text-orange-600 font-bold" : "bg-white text-gray-700"}`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="chapa"
                checked={formData.paymentMethod === "chapa"}
                onChange={handleChange}
                className="hidden"
              />
              Chapa
            </label>
            <label
              className={`border p-3 rounded-lg cursor-pointer text-center block ${formData.paymentMethod === "telebirr" ? "border-blue-500 bg-blue-50/50 text-blue-600 font-bold" : "bg-white text-gray-700"}`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="telebirr"
                checked={formData.paymentMethod === "telebirr"}
                onChange={handleChange}
                className="hidden"
              />
              Telebirr
            </label>
            <label
              className={`border p-3 rounded-lg cursor-pointer text-center block ${formData.paymentMethod === "cbe" ? "border-green-500 bg-green-50/50 text-green-600 font-bold" : "bg-white text-gray-700"}`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="cbe"
                checked={formData.paymentMethod === "cbe"}
                onChange={handleChange}
                className="hidden"
              />
              CBE Bank
            </label>
          </div>
        </div>

        {formData.paymentMethod === "telebirr" && (
          <div className="bg-blue-50 border border-blue-100 p-3 rounded space-y-1">
            <label className="block text-xs font-bold text-blue-800">
              Telebirr Mobile Number
            </label>
            <input
              type="text"
              name="walletNumber"
              value={formData.walletNumber}
              onChange={handleChange}
              placeholder="09xxxxxxxx"
              className="w-full border p-2 rounded text-sm bg-white outline-none focus:border-blue-500"
            />
          </div>
        )}

        {formData.paymentMethod === "cbe" && (
          <div className="bg-green-50 border border-green-100 p-3 rounded space-y-1">
            <label className="block text-xs font-bold text-green-800">
              CBE Account Number
            </label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              placeholder="1000xxxxxxxxxx"
              className="w-full border p-2 rounded text-sm bg-white outline-none focus:border-green-500"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded shadow-sm mt-4 transition-all"
        >
          Submit & Finish Payment
        </button>
      </form>
    </div>
  );
}
