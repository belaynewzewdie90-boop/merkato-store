import React, { useState } from "react";
import { useParams } from "react-router-dom";

export default function Tracking() {
  const { orderId } = useParams();

  // 1. Use React State to handle status dynamically so it can change to cancelled
  // 1 = Placed, 2 = Processing, 3 = Out for Delivery, 4 = Delivered, 0 = Cancelled
  const [orderStatus, setOrderStatus] = useState(2);

  const steps = [
    { id: 1, name: "Order Placed", desc: "We have received your order" },
    { id: 2, name: "Processing", desc: "Your items are being packed" },
    { id: 3, name: "Out for Delivery", desc: "Our courier is on the way" },
    { id: 4, name: "Delivered", desc: "Package handed over successfully" },
  ];

  // 2. Cancellation handler function
  const handleCancelOrder = () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?",
    );
    if (confirmCancel) {
      setOrderStatus(0); // Set status to 0 representing Cancelled
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg my-10">
      <div className="border-b pb-4 mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Track Your Order</h2>
          <p className="text-sm text-gray-500 mt-1">
            Order ID:{" "}
            <span className="font-mono text-orange-500">#{orderId}</span>
          </p>
        </div>

        {/* 3. Render CANCELLED tag if status is 0 */}
        {orderStatus === 0 && (
          <span className="bg-red-100 text-red-600 font-bold px-3 py-1 rounded-full text-sm animate-pulse">
            Cancelled
          </span>
        )}
      </div>

      {/* Estimated Delivery Banner OR Cancelled Banner */}
      {orderStatus === 0 ? (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-8">
          <p className="font-bold">This order has been cancelled.</p>
          <p className="text-sm mt-1">
            The refund processing system has been initialized if payment was
            made online.
          </p>
        </div>
      ) : (
        <div className="bg-orange-50 border border-orange-200 text-orange-800 p-4 rounded-lg mb-8 flex justify-between items-center">
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold">
              Estimated Delivery
            </p>
            <p className="text-lg font-bold">Today by 6:00 PM</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider font-semibold">
              Courier Partner
            </p>
            <p className="font-medium">Merkato Express</p>
          </div>
        </div>
      )}

      {/* Timeline Tracking Flow */}
      {orderStatus !== 0 && (
        <div className="relative pl-6 border-l-2 border-gray-200 ml-4 space-y-8">
          {steps.map((step) => {
            const isCompleted = orderStatus >= step.id;
            return (
              <div key={step.id} className="relative">
                <div
                  className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 bg-white transition-all duration-300 ${
                    isCompleted
                      ? "border-orange-500 bg-orange-500 shadow"
                      : "border-gray-300"
                  }`}
                />
                <div>
                  <h3
                    className={`font-semibold ${isCompleted ? "text-gray-900" : "text-gray-400"}`}
                  >
                    {step.name}
                  </h3>
                  <p
                    className={`text-sm ${isCompleted ? "text-gray-600" : "text-gray-300"}`}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Cancel Action Button (Only show if order is still at step 1 or 2) */}
      {orderStatus > 0 && orderStatus <= 2 && (
        <div className="mt-8 pt-6 border-t flex justify-end">
          <button
            onClick={handleCancelOrder}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded transition-colors text-sm"
          >
            Cancel Order
          </button>
        </div>
      )}
    </div>
  );
}
