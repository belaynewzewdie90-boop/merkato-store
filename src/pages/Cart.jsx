import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FiTrash2, FiPlus, FiMinus } from "react-icons/fi";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    location: "",
  });
  const [ordered, setOrdered] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalCost = subtotal + 150; // 150 Birr sample delivery flat rate

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    setOrdered(true);
    setTimeout(() => {
      clearCart();
      setOrdered(false);
      setFormData({ fullName: "", phone: "", location: "" });
    }, 3000);
  };

  if (ordered) {
    return (
      <div className="text-center py-16 px-4">
        <h3 className="text-2xl font-bold text-green-600 mb-2">
          🎉 Order Placed Successfully!
        </h3>
        <p className="text-gray-600 text-sm">
          Thank you, {formData.fullName}. We will deliver to {formData.location}{" "}
          shortly.
        </p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 mb-4">Your basket is completely empty.</p>
        <Link
          to="/products"
          className="text-blue-600 font-medium hover:underline"
        >
          Go back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h2 className="text-2xl font-extrabold mb-6">Your Shopping Cart</h2>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Side: Product Editing Lists */}
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
                  <h4 className="font-bold text-gray-800 text-sm">
                    {item.name}
                  </h4>
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
                  <span className="px-2 font-bold text-sm">
                    {item.quantity}
                  </span>
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

        {/* Right Side: Total summary & Guest Delivery validation inputs form */}
        <div className="lg:col-span-2 border p-6 rounded-xl bg-gray-50 h-fit">
          <h3 className="font-bold text-base mb-3 border-b pb-2">
            Order Review
          </h3>
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
                required
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full border rounded p-2 text-xs focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <div>
              <input
                type="tel"
                required
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full border rounded p-2 text-xs focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <div>
              <input
                type="text"
                required
                placeholder="Drop-off Address (e.g. Bole)"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full border rounded p-2 text-xs focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2.5 rounded-lg transition-colors"
            >
              Place Cash on Delivery Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
