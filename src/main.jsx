import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CartProvider } from "./context/CartContext";
import { AdminProvider } from "./context/AdminContext";
import { SocketProvider } from "./context/SocketContext";
import App from "./App";
import "./index.css";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <AdminProvider>
          <CartProvider>
            <SocketProvider>
              <App />
            </SocketProvider>
          </CartProvider>
        </AdminProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
