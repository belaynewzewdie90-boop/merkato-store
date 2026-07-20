import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAdmin } from "../context/AdminContext";
import { createOrder, updateOrderPayment } from "../api/api";
import { FiTrash2, FiCheckCircle, FiTruck, FiArrowLeft } from "react-icons/fi";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "";

const PAYMENT_METHODS = [
  { value: "chapa", label: "Chapa", icon: "💳" },
  { value: "cod", label: "Cash on Delivery", icon: "💵" },
  { value: "telebirr", label: "Telebirr", icon: "📱" },
  { value: "cbe", label: "CBE Bank", icon: "🏦" },
];

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { addOrder, recordPayment, markDelivered } = useAdmin();

  useEffect(() => {
    if (!localStorage.getItem("merkato_current_user")) {
      navigate("/login?redirect=/cart");
    }
  }, [navigate]);

  const currentUser = (() => { try { return JSON.parse(localStorage.getItem("merkato_current_user")); } catch { return null; } })();
  const initialFullName = currentUser
    ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim()
    : "";

  const [formData, setFormData] = useState({
    fullName: initialFullName,
    phone: "",
    location: "",
  });
  const [ordered, setOrdered] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [orderError, setOrderError] = useState("");

  // payment step
  const [showPayment, setShowPayment] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    paymentMethod: "cod",
    walletNumber: "",
    accountNumber: "",
    amountPaid: "",
  });

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalCost = subtotal + 150;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveOrderToLocalStorage = (order, orderId) => {
    try {
      const existing = JSON.parse(localStorage.getItem("merkato_orders") || "[]");
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

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    const newOrder = {
      customerName: formData.fullName,
      phone: formData.phone,
      address: formData.location,
      items: cart.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.quantity, image: i.image })),
      totalPaid: totalCost,
      paymentMethod: null,
      paymentDetails: null,
      amountPaid: null,
      paymentStatus: "Pending",
    };
    let id;
    try {
      const backendOrder = await createOrder(newOrder);
      id = backendOrder._id || backendOrder.id || Date.now();
      addOrder(newOrder, id);
    } catch (err) {
      console.error("Failed to save order to backend:", err);
      setOrderError("Order saved locally but failed to sync to server. Check your connection or login again.");
      id = addOrder(newOrder);
    }
    // Backup: directly save to localStorage in case React context useEffect hasn't flushed
    saveOrderToLocalStorage(newOrder, id);
    setOrderId(id);
    setPaymentForm((prev) => ({ ...prev, amountPaid: totalCost }));
    clearCart();
    setFormData({ fullName: "", phone: "", location: "" });
    setShowPayment(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (paymentForm.paymentMethod === "telebirr" && !paymentForm.walletNumber) {
      alert("Please enter your Telebirr phone number.");
      return;
    }
    if (paymentForm.paymentMethod === "cbe" && !paymentForm.accountNumber) {
      alert("Please enter your CBE account number.");
      return;
    }
    if (!paymentForm.amountPaid || Number(paymentForm.amountPaid) <= 0) {
      alert("Please enter the amount you paid.");
      return;
    }

    if (paymentForm.paymentMethod === "chapa") {
      try {
        const res = await axios.post(`${API}/api/v1/payments/initialize`, {
          amount: Number(paymentForm.amountPaid),
          email: currentUser?.email || "customer@example.com",
          first_name: currentUser?.firstName || formData.fullName.split(" ")[0],
          last_name: currentUser?.lastName || formData.fullName.split(" ").slice(1).join(" "),
          phone_number: formData.phone,
          customerName: formData.fullName,
          phone: formData.phone,
          address: formData.location,
          items: cart.map((i) => ({ name: i.name, price: i.price, qty: i.quantity, image: i.image })),
          totalPaid: Number(paymentForm.amountPaid),
          orderId,
        });
        if (res.data.success && res.data.checkoutUrl) {
          window.location.href = res.data.checkoutUrl;
          return;
        }
      } catch (err) {
        console.error("Chapa init error:", err);
        alert("Failed to start Chapa payment. Please try again.");
        return;
      }
    }

    const labels = { cod: "Cash on Delivery", telebirr: "Telebirr Wallet", cbe: "CBE Bank" };
    const detailsMap = { cod: "N/A", telebirr: paymentForm.walletNumber, cbe: paymentForm.accountNumber };

    recordPayment(
      orderId,
      labels[paymentForm.paymentMethod],
      detailsMap[paymentForm.paymentMethod],
      paymentForm.amountPaid,
    );
    try {
      await updateOrderPayment(orderId, {
        paymentStatus: "Received",
        paymentMethod: labels[paymentForm.paymentMethod],
        paymentDetails: detailsMap[paymentForm.paymentMethod],
        amountPaid: Number(paymentForm.amountPaid),
      });
    } catch (err) {
      console.error("Failed to sync payment to backend:", err);
    }
    setOrdered(true);
    setShowPayment(false);
  };

  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    if (ordered && orderId) {
      setCustomer({
        fullName: formData.fullName,
        location: formData.location,
      });
    }
  }, [ordered, orderId]);

  // payment step screen (shown right after order is placed)
  if (showPayment && orderId && !ordered) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg">
        <button
          onClick={() => {
            setShowPayment(false);
            setOrderId(null);
          }}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 mb-6 font-medium cursor-pointer"
        >
          <FiArrowLeft /> Back to cart
        </button>

        <div className="border rounded-2xl p-6 bg-white shadow-sm">
          <div className="text-center mb-6">
            <FiCheckCircle className="text-green-500 text-4xl mx-auto mb-3" />
            <h3 className="text-xl font-black text-gray-900">
              Order #{orderId} Placed!
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Now record your payment to complete the order.
            </p>
          </div>

          {orderError && (
            <div className="p-3 mb-4 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl">
              {orderError}
            </div>
          )}
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-700">
              Total invoice:{" "}
              <span className="font-black text-orange-600">{totalCost} ETB</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Enter the amount you paid below so the admin can verify.
            </p>
          </div>

          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">
                Amount You Paid (ETB)
              </label>
              <input
                type="number"
                value={paymentForm.amountPaid}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, amountPaid: e.target.value })
                }
                placeholder="Enter amount paid"
                className="w-full border border-gray-200 rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
                Payment Method
              </label>
              <div className="grid grid-cols-1 gap-2">
                {PAYMENT_METHODS.map((pm) => (
                  <label
                    key={pm.value}
                    className={`flex items-center gap-3 border rounded-xl p-3 cursor-pointer transition-all ${
                      paymentForm.paymentMethod === pm.value
                        ? "border-orange-500 bg-orange-50/50 ring-1 ring-orange-500"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={pm.value}
                      checked={paymentForm.paymentMethod === pm.value}
                      onChange={(e) =>
                        setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })
                      }
                      className="hidden"
                    />
                    <span className="text-lg">{pm.icon}</span>
                    <span className={`text-xs font-bold ${
                      paymentForm.paymentMethod === pm.value
                        ? "text-orange-600"
                        : "text-gray-700"
                    }`}>
                      {pm.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {paymentForm.paymentMethod === "telebirr" && (
              <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl space-y-1">
                <label className="block text-xs font-bold text-blue-800">
                  Telebirr Mobile Number
                </label>
                <input
                  type="text"
                  value={paymentForm.walletNumber}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, walletNumber: e.target.value })
                  }
                  placeholder="09xxxxxxxx"
                  className="w-full border p-2.5 rounded-lg text-sm bg-white outline-none focus:border-blue-500"
                />
              </div>
            )}

            {paymentForm.paymentMethod === "cbe" && (
              <div className="bg-green-50 border border-green-100 p-3 rounded-xl space-y-1">
                <label className="block text-xs font-bold text-green-800">
                  CBE Account Number
                </label>
                <input
                  type="text"
                  value={paymentForm.accountNumber}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, accountNumber: e.target.value })
                  }
                  placeholder="1000xxxxxxxxxx"
                  className="w-full border p-2.5 rounded-lg text-sm bg-white outline-none focus:border-green-500"
                />
              </div>
            )}

            {paymentForm.paymentMethod === "chapa" && (
              <div className="bg-orange-50 border border-orange-100 p-3 rounded-xl">
                <p className="text-xs font-bold text-orange-800">
                  You will be redirected to Chapa to complete your payment securely.
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all"
            >
              {paymentForm.paymentMethod === "chapa" ? "Pay with Chapa" : "Submit Payment"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // order placed + payment recorded → success
  if (ordered && orderId) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md text-center">
        <FiCheckCircle className="text-green-500 text-5xl mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Order Complete!
        </h3>
        <p className="text-gray-600 text-sm mb-2">
          Thank you, {formData.fullName || customer?.fullName || "Customer"}.
        </p>
        <p className="text-gray-500 text-xs mb-6">
          We will deliver to {formData.location || customer?.location || "your address"}.
        </p>
        <button
          onClick={() => {
            setOrdered(false);
            setOrderId(null);
            navigate("/tracking");
          }}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mx-auto"
        >
          <FiTruck /> Go to My Orders
        </button>
        <p className="text-xs text-gray-400 mt-4">
          Click to view your orders after delivery
        </p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 mb-4">Your basket is completely empty.</p>
        <Link to="/products" className="text-blue-600 font-medium hover:underline">
          Go back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h2 className="text-2xl font-extrabold mb-6">Your Shopping Cart</h2>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border p-4 rounded-xl bg-white"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                  <p className="text-xs text-orange-600 font-semibold">
                    {item.price} ETB
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded bg-gray-50">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1 px-2 text-gray-600 hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="px-2 font-bold text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1 px-2 text-gray-600 hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 border p-6 rounded-xl bg-gray-50 h-fit">
          <h3 className="font-bold text-base mb-3 border-b pb-2">Order Review</h3>
          <div className="space-y-1.5 text-xs text-gray-600 border-b pb-3 mb-4">
            <div className="flex justify-between">
              <span>Items subtotal:</span>
              <span>{subtotal} ETB</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee:</span>
              <span>150 ETB</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t">
              <span>Total Invoice:</span>
              <span>{totalCost} ETB</span>
            </div>
          </div>

          <form onSubmit={handleOrderSubmit} className="space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Delivery Information
            </h4>
            <div>
              <input
                type="text"
                name="fullName"
                required
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border rounded p-2 text-xs focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <div>
              <input
                type="tel"
                name="phone"
                required
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded p-2 text-xs focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <div>
              <input
                type="text"
                name="location"
                required
                placeholder="Drop-off Address (e.g. Bole)"
                value={formData.location}
                onChange={handleChange}
                className="w-full border rounded p-2 text-xs focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <p className="text-[10px] text-gray-400 pt-1">
              You will choose a payment method after placing the order.
            </p>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2.5 rounded-lg transition-colors"
            >
              Place Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
