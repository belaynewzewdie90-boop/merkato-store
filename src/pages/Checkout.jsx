import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedId, setGeneratedId] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    paymentMethod: "telebirr",
    enteredCost: "", // User enters the product cost manually here
    accountNumber: "",
    walletNumber: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
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

    // Simulate Payment Processing Gateway
    setTimeout(() => {
      // Order ID is generated right here during submission
      const uniqueOrderID =
        "MK-" + self.crypto.randomUUID().split("-")[0].toUpperCase();
      setGeneratedId(uniqueOrderID);
      setLoading(false);
      setIsSuccess(true);

      const newOrder = {
        id: uniqueOrderID,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        customerName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        totalPaid: parseFloat(formData.enteredCost), // Saved from user input
        paymentMethod:
          formData.paymentMethod === "telebirr"
            ? "Telebirr Wallet"
            : "CBE Bank",
        paymentDetails:
          formData.paymentMethod === "telebirr"
            ? formData.walletNumber
            : formData.accountNumber,
        status: "Placed", // This status field can be updated by an Admin Dashboard later
      };

      const existingOrders =
        JSON.parse(localStorage.getItem("merkato_orders")) || [];
      localStorage.setItem(
        "merkato_orders",
        JSON.stringify([newOrder, ...existingOrders]),
      );
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
          Payment Successful!
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Your order has been registered and is pending admin updates.
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
          onClick={() => navigate(`/tracking/${generatedId}`)}
          className="w-full bg-orange-500 text-white font-bold py-3 rounded hover:bg-orange-600 transition-all"
        >
          View Tracking Order Roadmap →
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
          <div className="grid grid-cols-2 gap-3">
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
