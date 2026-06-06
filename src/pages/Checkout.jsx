import React from "react";
// 1. Import useNavigate to allow redirecting after submission
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();

  // 2. Function to generate a random alphanumeric tracking ID when ordering
  const generateOrderId = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `MS-${result}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Generate the unique ID for this specific order
    const newOrderId = generateOrderId();

    alert(`Order Placed Successfully! Your Order ID is: #${newOrderId}`);

    // 3. Send the user to the tracking page with their brand new ID
    navigate(`/tracking/${newOrderId}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg my-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Checkout Details
      </h2>

      {/* 4. Attach the handleSubmit handler to the form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Shipping Form */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Shipping Information
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Abebe Bikila"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Phone Number
            </label>
            <input
              type="tel"
              className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="+251 9..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              City / Location
            </label>
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., Addis Ababa / Bahir Dar"
              required
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-4 rounded-lg border h-fit">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Order Summary
          </h3>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Items Subtotal:</span>
            <span>1,200.00 ETB</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-4">
            <span>Delivery Fee:</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between font-bold text-gray-800 border-t pt-2 text-lg">
            <span>Total:</span>
            <span>1,200.00 ETB</span>
          </div>

          {/* Form submits when this button is clicked */}
          <button
            type="submit"
            className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Confirm Order
          </button>
        </div>
      </form>
    </div>
  );
}
