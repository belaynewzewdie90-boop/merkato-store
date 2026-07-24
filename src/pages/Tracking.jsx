import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import { fetchOrders as fetchOrdersApi } from "../api/api";

export default function Tracking() {
  const navigate = useNavigate();
  const { orders, refreshOrders, mergeApiOrders } = useAdmin();
  const [synced, setSynced] = useState(false);

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
        console.error("Failed to sync orders from backend:", err);
      }
      setSynced(true);
    };
    syncFromBackend();
    const interval = setInterval(syncFromBackend, 3000);
    return () => clearInterval(interval);
  }, []);

  const fullName = currentUser
    ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim()
    : "";

  const myOrders = orders.filter((o) => {
    if (currentUser?.email && o.userEmail === currentUser.email) return true;
    if (fullName && o.customerName && o.customerName.toLowerCase() === fullName.toLowerCase()) return true;
    return false;
  });

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 bg-white border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        My Orders
      </h2>
      {!synced ? (
        <div className="py-8 text-center">
          <div className="w-8 h-8 border-4 border-t-orange-500 border-gray-200 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading your orders...</p>
        </div>
      ) : myOrders.length === 0 ? (
        <p className="text-gray-400 text-sm py-4 text-center">
          No orders have been submitted yet.
        </p>
      ) : (
        <div className="divide-y border-t mt-2">
          {myOrders.map((order) => (
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
                {order.emailSent && (
                  <span className="text-[9px] font-semibold text-green-600 bg-green-50 border border-green-100 px-1.5 py-0.5 rounded">
                    Email Sent ({order.lastEmailStatus || order.status})
                  </span>
                )}
                <span className="font-bold text-gray-900 text-xs">
                  {(order.totalPaid || 0).toLocaleString()} ETB
                </span>
                <Link
                  to={`/order/${order.id}`}
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
