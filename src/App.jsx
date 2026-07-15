import { createContext, useContext, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { socket } from "./services/socket"; // 🔌 Centralized Socket.io client instance
import Header from "./components/Header";
import Login from "./pages/Login";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import Services from "./pages/Services";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Settings from "./pages/Settings";
import Tracking from "./pages/Tracking";
import OrderDetails from "./pages/OrderDetails";
import Address from "./pages/Address";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Chatbot from "./components/Chatbot"; 

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function App() {
  // 🔐 Global Persistent State Layer
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("merkato_current_user");
    return stored ? JSON.parse(stored) : null;
  });

  // 💾 Sync session to LocalStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("merkato_current_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("merkato_current_user");
    }
  }, [user]);

  // 🔌 Manage Active Real-Time WebSocket Session Lifecycle
  useEffect(() => {
    if (user) {
      socket.connect(); // Connect dynamically on explicit session activation

      socket.on("system_audit_alert", (data) => {
        console.log(`[Security Flag Triggered]: Admin active: ${data.email}`);
      });
    }

    return () => {
      socket.off("system_audit_alert");
      socket.disconnect(); // Tear down instantly on logout or window termination
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <div className="min-h-screen flex flex-col">
        {/* 
          🛡️ UI Layout Isolation Rule:
          Hides the standard public header completely if an admin is authenticated.
        */}
        <Header />

        <div className="flex-1">
          <Routes>
            {/* 🛍️ Customer Ecosystem Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/services" element={<Services />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/tracking" element={<Tracking />} />
            <Route path="/tracking/:orderId" element={<OrderDetails />} />
            <Route path="/order/:orderId" element={<OrderDetails />} />
            <Route path="/address" element={<Address />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            {/* 🔒 Protected Administrative Workspace Terminal */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Admin />} />
              <Route path="orders" element={<Admin />} />
            </Route>

            {/* 🔄 Fallback Catch-all Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Chatbot />
      </div>
    </AuthContext.Provider>
  );
}

export default App;
