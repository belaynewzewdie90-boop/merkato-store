import { Routes, Route, ServerRouter } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Tracking from "./pages/Tracking";
import Checkout from "./pages/Checkout"; // Make sure Checkout is imported if you or your team added it
import Services from "./pages/Services";

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

          {/* Keep both your custom tracking routes */}
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/tracking/:orderId" element={<Tracking />} />
           <Route path="/services" element={<Services />} /> 
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
