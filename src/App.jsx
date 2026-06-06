import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Service from "./pages/Service";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white w-full">
      <Header />
      <div className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/service" element={<Service/>}/>
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
