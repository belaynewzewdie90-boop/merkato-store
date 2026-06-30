import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

function normalizeOrder(o) {
  if (o.customerName) return o;
  return {
    ...o,
    customerName: o.customer?.fullName || "Unknown",
    phone: o.customer?.phone || o.phone || "",
    address: o.customer?.location || o.address || "",
    totalPaid: o.totalPaid || o.total || 0,
    paymentMethod: o.paymentMethod || "Cash on Delivery",
    paymentDetails: o.paymentDetails || "N/A",
    date: o.date || (o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""),
  };
}

const STEPS = [
  { num: 1, label: "Placed" },
  { num: 2, label: "Processing" },
  { num: 3, label: "Shipped" },
  { num: 4, label: "Delivered" },
];

export default function Tracking() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { updateOrderStatus } = useAdmin();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("merkato_current_user")) {
      navigate("/login?redirect=/tracking");
    }
  }, [navigate]);

  // poll localStorage for admin status changes
  useEffect(() => {
    const load = () => {
      const saved = JSON.parse(localStorage.getItem("merkato_orders")) || [];
      setOrders(saved.map(normalizeOrder));
    };
    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, [orderId]);

  const activeOrder = orders.find((o) => o.id == orderId);

  const getStatusStep = (status) => {
    switch (status) {
      case "Placed": return 1;
      case "Processing": return 2;
      case "Shipped": return 3;
      case "Delivered": return 4;
      case "Canceled": return 0;
      default: return 1;
    }
  };

  const handleCancelOrder = () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    const updatedOrders = orders.map((order) => {
      if (order.id == orderId) {
        return { ...order, status: "Canceled" };
      }
      return order;
    });

    localStorage.setItem("merkato_orders", JSON.stringify(updatedOrders));
    updateOrderStatus(Number(orderId), "Canceled");
    setOrders(updatedOrders.map(normalizeOrder));
  };

  if (orderId && activeOrder) {
    const currentStep = getStatusStep(activeOrder.status || "Placed");
    const isCanceled = activeOrder.status === "Canceled";

    return (
      <div className="max-w-2xl mx-auto my-10 p-6 bg-white border rounded-lg shadow-sm">
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <div>
            <Link
              to="/tracking"
              className="text-xs text-orange-500 hover:underline"
            >
              ← All Orders
            </Link>
            <h2 className="text-xl font-bold text-gray-900 mt-1">
              Order Details ID:{" "}
              <span className="font-mono text-orange-500">
                #{activeOrder.id}
              </span>
            </h2>
          </div>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded border ${isCanceled ? "bg-red-50 text-red-600 border-red-100" : "bg-gray-100 text-gray-800"}`}
          >
            {activeOrder.status || "Placed"}
          </span>
        </div>

        {/* Tracking Stepper */}
        {!isCanceled ? (
          <div className="mb-8 relative px-2">
            <div className="flex justify-between items-center relative z-10">
              {STEPS.map((step) => (
                <div key={step.num} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      currentStep >= step.num
                        ? "bg-orange-500 text-white ring-4 ring-orange-100"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {currentStep > step.num ? "✓" : step.num}
                  </div>
                  <span
                    className={`text-xs mt-1 font-medium ${
                      currentStep >= step.num ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-100 -z-0">
              <div
                className="h-full bg-orange-400 transition-all duration-500"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-md text-red-700 text-sm font-medium flex items-center gap-2">
            <span>🛑</span> This order was canceled.
          </div>
        )}

        {/* Order details */}
        <div className="bg-gray-50 border p-4 rounded-md text-sm space-y-2 text-gray-700 mb-6">
          <p>
            <strong>Customer Name:</strong> {activeOrder.customerName}
          </p>
          <p>
            <strong>Contact Phone:</strong> {activeOrder.phone}
          </p>
          <p>
            <strong>Destination:</strong> {activeOrder.address}
          </p>
          <p>
            <strong>Payment:</strong>{" "}
            {activeOrder.paymentMethod || "Pending"} ({activeOrder.paymentDetails || "—"})
          </p>
          <p>
            <strong>Payment Status:</strong>{" "}
            <span className={`font-bold ${
              activeOrder.paymentStatus === "Verified"
                ? "text-green-600"
                : activeOrder.paymentStatus === "Received"
                  ? "text-blue-600"
                  : "text-gray-500"
            }`}>
              {activeOrder.paymentStatus || "Pending"}
            </span>
          </p>
          <p className="text-base text-gray-900 font-bold border-t pt-2 mt-2">
            Total:{" "}
            <span className="text-orange-500">
              {(activeOrder.totalPaid || 0).toLocaleString()} ETB
            </span>
          </p>
        </div>

        {activeOrder.status === "Placed" && (
          <div className="border-t pt-4 flex justify-end">
            <button
              onClick={handleCancelOrder}
              className="bg-white hover:bg-red-50 text-red-600 border border-red-200 font-semibold py-2 px-4 rounded text-xs transition-colors shadow-sm cursor-pointer"
            >
              Cancel This Order
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 bg-white border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        My Orders Tracker Registry
      </h2>
      {orders.length === 0 ? (
        <p className="text-gray-400 text-sm py-4 text-center">
          No orders have been submitted yet.
        </p>
      ) : (
        <div className="divide-y border-t mt-2">
          {orders.map((order) => (
            <div
              key={order.id}
              className="py-3 flex justify-between items-center text-sm"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-gray-900">
                  #{order.id}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    order.status === "Canceled"
                      ? "bg-red-50 text-red-600"
                      : order.status === "Delivered"
                        ? "bg-green-50 text-green-700"
                        : order.status === "Shipped"
                          ? "bg-purple-50 text-purple-700"
                          : order.status === "Processing"
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {order.status || "Placed"}
                </span>
                <span className="text-[10px] text-gray-400">{order.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-900 text-xs">
                  {(order.totalPaid || 0).toLocaleString()} ETB
                </span>
                <Link
                  to={`/tracking/${order.id}`}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-1.5 px-3 rounded transition-colors"
                >
                  Track
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
