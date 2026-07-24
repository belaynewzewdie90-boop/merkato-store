import { createContext, useContext, useEffect, useState } from "react";

const AdminContext = createContext();

const SEED_PRODUCTS = [
  {
    id: 1,
    name: "Premium Ethiopian Leather Shoes",
    price: 3400,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80",
    description:
      "100% genuine handcrafted local leather with exceptional durable sole structures.",
    stock: 12,
  },
  {
    id: 2,
    name: "Traditional Handcrafted Coffee Set",
    price: 1850,
    category: "Home & Living",
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
    description:
      "Classic ceramic jebena and coordinate cups setup for genuine cultural brewing.",
    stock: 8,
  },
  {
    id: 3,
    name: "Premium Woven Cotton Scarf (Netela)",
    price: 1200,
    category: "Traditional Textiles",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80",
    description:
      "Elegant, lightweight pure cotton hand-woven by local masters with golden tilet boundaries.",
    stock: 0,
  },
  {
    id: 4,
    name: "Organic Harar Coffee Beans (1KG)",
    price: 950,
    category: "Food & Beverage",
    image:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&auto=format&fit=crop&q=80",
    description:
      "Sun-dried single-origin medium roast Arabica beans with distinctive fruity notes.",
    stock: 25,
  },
];

const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

export function AdminProvider({ children }) {
  const [isAuthed, setIsAuthed] = useState(() => {
    return localStorage.getItem("merkato_admin_authed") === "true";
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("merkato_products");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return SEED_PRODUCTS;
      }
    }
    return SEED_PRODUCTS;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("merkato_orders");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("merkato_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("merkato_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (isAuthed && !localStorage.getItem("merkato_access_token")) {
      const BASE = (import.meta.env.VITE_API_URL || "") + "/api/v1";
      fetch(`${BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "admin@merkato.com", password: "Admin123" }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.accessToken) {
            localStorage.setItem("merkato_access_token", data.accessToken);
          }
        })
        .catch(() => {});
    }
  }, [isAuthed]);

  // force re-sync orders from localStorage (for cross-tab / polling)
  const refreshOrders = () => {
    const saved = localStorage.getItem("merkato_orders");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setOrders(parsed);
      } catch {}
    }
  };

  const login = async (username, password) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthed(true);
      localStorage.setItem("merkato_admin_authed", "true");
      try {
        const BASE = (import.meta.env.VITE_API_URL || "") + "/api/v1";
        const res = await fetch(`${BASE}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "admin@merkato.com", password: "Admin123" }),
        });
        const data = await res.json();
        if (data.accessToken) {
          localStorage.setItem("merkato_access_token", data.accessToken);
        }
      } catch (err) {
        console.error("Backend admin login failed:", err.message);
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthed(false);
    localStorage.removeItem("merkato_admin_authed");
  };

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      stock: Number(product.stock) || 0,
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id, updates) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleStock = (id) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, stock: p.stock > 0 ? 0 : 10 } : p,
      ),
    );
  };

  const releaseProduct = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: p.stock > 0 ? p.stock : 10 } : p)),
    );
  };

  // add new order from customer
  const addOrder = (order, backendId) => {
    const localId = Date.now();
    const currentUser = (() => {
      try { return JSON.parse(localStorage.getItem("merkato_current_user")); } catch { return null; }
    })();
    const newOrder = {
      ...order,
      id: backendId || localId,
      backendId: backendId || null,
      userEmail: currentUser?.email || null,
      status: "Placed",
      paymentStatus: "Pending",
      amountPaid: null,
      paidAt: null,
      createdAt: new Date().toISOString(),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
    setOrders((prev) => [newOrder, ...prev]);
    return backendId || localId;
  };

  // update local order to use backend _id after API creation succeeds
  const updateOrderId = (oldId, newId) => {
    setOrders((prev) => {
      const updated = prev.map((o) => (o.id === oldId || o.backendId === oldId ? { ...o, id: newId, _id: newId, backendId: newId } : o));
      localStorage.setItem("merkato_orders", JSON.stringify(updated));
      return updated;
    });
  };

  const updateOrderStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id == id || o.backendId == id ? { ...o, status: newStatus } : o)),
    );
  };

  // customer clicks "Order Arrived"
  const markDelivered = (id) => {
    setOrders((prev) => {
      const updated = prev.map((o) =>
        o.id == id || o.backendId == id ? { ...o, status: "Delivered" } : o
      );
      localStorage.setItem("merkato_orders", JSON.stringify(updated));
      return updated;
    });
  };

  // user records payment after placing order
  const recordPayment = (id, method, details, amount) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id == id || o.backendId == id
          ? {
              ...o,
              paymentMethod: method,
              paymentDetails: details,
              amountPaid: Number(amount),
              paidAt: new Date().toISOString(),
              paymentStatus: "Received",
            }
          : o,
      ),
    );
  };
  
  // admin verifies or flags payment
  const updatePaymentStatus = (id, newPaymentStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id == id || o.backendId == id ? { ...o, paymentStatus: newPaymentStatus } : o)),
    );
  };

  const deleteOrder = (id) => {
    setOrders((prev) => prev.filter((o) => o.id != id && o.backendId != id));
  };

  const clearOrders = () => {
    setOrders([]);
  };

  const mergeApiOrders = (apiOrders) => {
    if (!apiOrders || apiOrders.length === 0) return;
    const mapped = apiOrders.map((o) => ({ ...o, id: o._id || o.id }));
    setOrders((prev) => {
      const merged = mapped.map((apiOrder) => {
        const match = prev.find((lo) => lo.id === apiOrder.id || lo._id === apiOrder.id);
        if (match) {
          return {
            ...apiOrder,
            userEmail: match.userEmail || apiOrder.userEmail,
            date: match.date || apiOrder.date,
          };
        }
        return apiOrder;
      });
      for (const localOrder of prev) {
        const exists = merged.some((o) => o.id === localOrder.id || o.id === localOrder._id);
        if (!exists) {
          merged.push(localOrder);
        }
      }
      localStorage.setItem("merkato_orders", JSON.stringify(merged));
      return merged;
    });
  };

  return (
    <AdminContext.Provider
      value={{
        isAuthed,
        login,
        logout,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleStock,
        releaseProduct,
        orders,
        addOrder,
        updateOrderId,
        updateOrderStatus,
        markDelivered,
        deleteOrder,
        clearOrders,
        refreshOrders,
        recordPayment,
        updatePaymentStatus,
        mergeApiOrders,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);