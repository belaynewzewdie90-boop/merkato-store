import { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("merkato_current_user") || "null");
  } catch {
    return null;
  }
}

function getCartKey(user) {
  return user?.email ? `merkato_cart_${user.email}` : null;
}

export function CartProvider({ children }) {
  const currentUser = getCurrentUser();

  const [cart, setCart] = useState(() => {
    const key = getCartKey(currentUser);
    if (key) {
      const saved = localStorage.getItem(key);
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return [];
  });

  // persist to localStorage whenever cart changes
  useEffect(() => {
    const key = getCartKey(getCurrentUser());
    if (key) {
      localStorage.setItem(key, JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, amount) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + amount } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
