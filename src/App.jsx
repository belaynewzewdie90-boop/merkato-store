import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Tracking from "./pages/Tracking";
import Checkout from "./pages/Checkout";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import Address from "./pages/Address";
function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white w-full">
      <Header />

      <div className="flex-1 w-full">
        <Routes>
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
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
