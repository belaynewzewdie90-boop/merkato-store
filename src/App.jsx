import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminNavbar from "./components/AdminNavbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Tracking from "./pages/Tracking";
import Checkout from "./pages/Checkout";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Address from "./pages/Address";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth"; 

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isLoginRoute = location.pathname === "/admin/login";

  // 🔐 ADMINISTRATIVE DATABASE SEEDER
  // Automatically establishes the default master administrator profile on launch
  useEffect(() => {
    const existingUsers =
      JSON.parse(localStorage.getItem("merkato_users_db")) || [];
    const adminExists = existingUsers.some(
      (user) => user.email.toLowerCase() === "admin@merkato.com",
    );

    if (!adminExists) {
      const defaultAdmin = {
        id: "USR-ADMIN-MASTER",
        name: "Store Manager",
        email: "admin@merkato.com",
        password: "admin123",
        role: "admin",
      };
      localStorage.setItem(
        "merkato_users_db",
        JSON.stringify([...existingUsers, defaultAdmin]),
      );
      console.log("System Status: Administrative data state verified.");
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col fluid-bg w-full">
      {/* Layout Controllers */}
      {isAdminRoute && !isLoginRoute && <AdminNavbar />}
      {!isAdminRoute && <Header />}

      <div className="flex-1 w-full">
        <Routes>
          {/* Marketplace Customer Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/tracking/:orderId" element={<Tracking />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/address" element={<Address />} />
          <Route path="/about" element={<About />} />

          {/* Customer Authentication Gateway */}
          <Route path="/login" element={<Auth />} />

          {/* Management Administrative Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
