import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import { fetchOrders as fetchOrdersApi, cancelOrderApi } from "../api/api";
import TrackingMap from "../components/TrackingMap";

const isObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(String(id));

const STEPS = [
  { num: 1, label: "Placed" },
  { num: 2, label: "Processing" },
  { num: 3, label: "Shipped" },
  { num: 4, label: "Delivered" },
];

export default function OrderDetails() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { orders, refreshOrders, mergeApiOrders, deleteOrder } = useAdmin();
  const [loadingApi, setLoadingApi] = useState(true);

  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem("merkato_current_user")); } catch { return null; }
  })();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login?redirect=/tracking");
    }
  }, [navigate, currentUser]);

  useEffect(() => {
    const syncFromBackend = async () => {
      try {
        const data = await fetchOrdersApi();
        if (data && data.length > 0) {
          mergeApiOrders(data);
        }
      } catch (err) {
        console.error("Failed to sync order from backend:", err);
      }
      setLoadingApi(false);
    };
    syncFromBackend();
    const interval = setInterval(syncFromBackend, 3000);
    return () => clearInterval(interval);
  }, []);

  const localOrder = orderId
    ? orders.find((o) => String(o.id) === String(orderId) || String(o.backendId) === String(orderId) || String(o._id) === String(orderId))
    : null;

  const activeOrder = localOrder;

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

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    if (isObjectId(orderId)) {
      try { await cancelOrderApi(orderId); } catch (err) { console.error("Failed to cancel:", err); }
    }
    deleteOrder(orderId);
    navigate("/tracking", { replace: true });
  };

  if (loadingApi) {
    return (
      <div className="max-w-2xl mx-auto my-10 p-6 bg-white border rounded-lg shadow-sm text-center">
        <div className="w-8 h-8 border-4 border-t-orange-500 border-gray-200 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Loading order details...</p>
      </div>
    );
  }

  if (!activeOrder) {
    return (
      <div className="max-w-2xl mx-auto my-10 p-6 bg-white border rounded-lg shadow-sm text-center">
        <p className="text-gray-500 mb-4">Order not found.</p>
        <Link to="/tracking" className="text-orange-500 hover:underline text-sm font-medium">
          ← Back to My Orders
        </Link>
      </div>
    );
  }

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
        <div className="flex items-center gap-2">
          {activeOrder.emailSent && (
            <span className="text-[10px] font-semibold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded">
              Email Sent ({activeOrder.lastEmailStatus || activeOrder.status})
            </span>
          )}
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded border ${isCanceled ? "bg-red-50 text-red-600 border-red-100" : "bg-gray-100 text-gray-800"}`}
          >
            {activeOrder.status || "Placed"}
          </span>
        </div>
      </div>

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
                  {currentStep > step.num ? "\u2713" : step.num}
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
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-100">
            <div
              className="h-full bg-orange-400 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-md text-red-700 text-sm font-medium flex items-center gap-2">
          <span>&#x1F6D1;</span> This order was canceled.
        </div>
      )}

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
          {activeOrder.paymentMethod || "Pending"} ({activeOrder.paymentDetails || "\u2014"})
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

      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          Delivery Location
        </h3>
        <div className="rounded-xl overflow-hidden border border-gray-200">
          <TrackingMap />
        </div>
        <p className="text-[10px] text-gray-400 mt-1 text-center">
          Destination: {activeOrder.address || "Address not specified"}
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
