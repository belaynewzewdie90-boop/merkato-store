import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "";

const SUGGESTED_QUESTIONS = [
  "Show me electronics under 5000 ETB",
  "What's your return policy?",
  "I need shoes for running",
  "Where is my order?",
  "Compare your best laptops",
  "Do you offer free shipping?",
];

function renderMarkdown(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, '<code style="background:#e5e7eb;padding:1px 4px;border-radius:3px;font-size:12px;">$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:#f97316;text-decoration:underline;">$1</a>')
    .replace(/\n/g, "<br/>");
}

function ProductCard({ product }) {
  const API_BASE = API || "";
  const imageUrl = product.image
    ? (product.image.startsWith("http") ? product.image : `${API_BASE}${product.image}`)
    : null;
  const discountedPrice = product.discount > 0
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;
  const inStock = product.stock > 0;

  return (
    <a
      href={`/products/${product._id}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        gap: "10px",
        padding: "10px",
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        textDecoration: "none",
        color: "inherit",
        transition: "box-shadow 0.2s",
        cursor: "pointer",
        maxWidth: "100%",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={product.name}
          style={{
            width: "64px",
            height: "64px",
            objectFit: "cover",
            borderRadius: "8px",
            background: "#f3f4f6",
            flexShrink: 0,
          }}
          onError={(e) => { e.target.style.display = "none"; }}
        />
      ) : (
        <div style={{
          width: "64px",
          height: "64px",
          borderRadius: "8px",
          background: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "22px",
          flexShrink: 0,
        }}>
          🛍️
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: "13px",
          fontWeight: "600",
          color: "#1f2937",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          lineHeight: "1.3",
        }}>
          {product.name}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "3px" }}>
          <span style={{ fontSize: "14px", fontWeight: "700", color: "#f97316" }}>
            {discountedPrice.toLocaleString()} ETB
          </span>
          {product.discount > 0 && (
            <span style={{ fontSize: "11px", color: "#9ca3af", textDecoration: "line-through" }}>
              {product.price.toLocaleString()} ETB
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "3px" }}>
          {product.rating > 0 && (
            <span style={{ fontSize: "11px", color: "#f59e0b" }}>
              {"★".repeat(Math.round(product.rating))} {product.rating}/5
            </span>
          )}
          <span style={{
            fontSize: "10px",
            padding: "1px 6px",
            borderRadius: "10px",
            background: inStock ? "#dcfce7" : "#fee2e2",
            color: inStock ? "#16a34a" : "#dc2626",
            fontWeight: "500",
          }}>
            {inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
        {product.brand && (
          <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>
            {product.brand}{product.color ? ` · ${product.color}` : ""}
          </div>
        )}
      </div>
    </a>
  );
}

function ComparisonTable({ products }) {
  if (!products || products.length < 2) return null;
  const attributes = ["Price", "Category", "Brand", "Rating", "Stock", "Color"];
  return (
    <div style={{
      overflowX: "auto",
      margin: "6px 0",
      borderRadius: "8px",
      border: "1px solid #e5e7eb",
    }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
        <thead>
          <tr style={{ background: "#f97316", color: "#fff" }}>
            <th style={{ padding: "6px 8px", textAlign: "left" }}>Feature</th>
            {products.map((p) => (
              <th key={p._id} style={{ padding: "6px 8px", textAlign: "left", maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {p.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {attributes.map((attr, i) => (
            <tr key={attr} style={{ background: i % 2 === 0 ? "#f9fafb" : "#fff" }}>
              <td style={{ padding: "5px 8px", fontWeight: "600", color: "#374151" }}>{attr}</td>
              {products.map((p) => (
                <td key={p._id} style={{ padding: "5px 8px", color: "#4b5563" }}>
                  {attr === "Price" ? `${p.price.toLocaleString()} ETB` :
                   attr === "Rating" ? (p.rating ? `${p.rating}/5` : "N/A") :
                   attr === "Stock" ? (p.stock > 0 ? `${p.stock} available` : "Out of stock") :
                   p[attr.toLowerCase()] || "N/A"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "10px 14px", alignSelf: "flex-start" }}>
      <div style={{ display: "flex", gap: "3px" }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#9ca3af",
              animation: `typingBounce 1.4s infinite ${i * 0.2}s`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const chatBottom = useRef(null);

  const [userId] = useState(() => {
    const stored = sessionStorage.getItem("chat_user_id");
    if (stored) return stored;
    const newId = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem("chat_user_id", newId);
    return newId;
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("merkato_current_user") || "null");
    setMessages([
      {
        role: "assistant",
        content: user
          ? `Welcome back, ${user.firstName}! I'm your Merkato Shopping Assistant. How can I help you today?`
          : "Welcome to Merkato Store! I'm your AI Shopping Assistant. Ask me about products, orders, shipping, or anything else!",
        products: [],
      },
    ]);
  }, []);

  useEffect(() => {
    chatBottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isLoading) return;

    const userMsg = text.trim();
    setInput("");
    setShowSuggestions(false);

    setMessages((prev) => [...prev, { role: "user", content: userMsg, products: [] }]);
    setIsLoading(true);

    try {
      const token = localStorage.getItem("merkato_access_token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await axios.post(
        `${API}/api/v1/chat`,
        { message: userMsg, userId },
        { headers }
      );

      const data = res.data;

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
          products: data.products || [],
          comparison: data.comparison || false,
          intent: data.intent,
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      const reply = err.response?.data?.reply || "I'm having trouble connecting right now. Please try again.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply, products: [] },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [userId, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearChat = () => {
    const user = JSON.parse(localStorage.getItem("merkato_current_user") || "null");
    setMessages([
      {
        role: "assistant",
        content: user
          ? `Chat cleared. How can I help you, ${user.firstName}?`
          : "Chat cleared. How can I help you today?",
        products: [],
      },
    ]);
    setShowSuggestions(true);
    axios.delete(`${API}/api/v1/chat/history/${userId}`).catch(() => {});
  };

  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(249,115,22,0.4)",
            fontSize: "26px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(249,115,22,0.5)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(249,115,22,0.4)"; }}
        >
          💬
        </button>
      )}

      {isOpen && (
        <div style={{
          width: "400px",
          height: "600px",
          maxHeight: "85vh",
          backgroundColor: "#fff",
          borderRadius: "16px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid #e5e7eb",
        }}>
          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
            padding: "14px 16px",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
              }}>
                🛒
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "15px", fontWeight: "700" }}>Merkato Assistant</h4>
                <span style={{ fontSize: "11px", opacity: 0.9 }}>AI Shopping Helper</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                onClick={clearChat}
                title="Clear chat"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  color: "#fff",
                  width: "28px",
                  height: "28px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                🗑️
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  color: "#fff",
                  width: "28px",
                  height: "28px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            padding: "12px",
            overflowY: "auto",
            backgroundColor: "#f9fafb",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}>
            {messages.map((msg, idx) => {
              const isUser = msg.role === "user";
              return (
                <div key={idx} style={{ display: "flex", flexDirection: "column", alignSelf: isUser ? "flex-end" : "flex-start", maxWidth: "88%" }}>
                  {/* Message bubble */}
                  <div
                    style={{
                      backgroundColor: isUser ? "#f97316" : "#fff",
                      color: isUser ? "#fff" : "#1f2937",
                      padding: "10px 14px",
                      borderRadius: isUser ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                      fontSize: "13px",
                      lineHeight: "1.5",
                      boxShadow: isUser ? "none" : "0 1px 3px rgba(0,0,0,0.06)",
                      border: isUser ? "none" : "1px solid #e5e7eb",
                      wordBreak: "break-word",
                    }}
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                  />

                  {/* Product cards */}
                  {msg.products && msg.products.length > 0 && !msg.comparison && (
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                      marginTop: "6px",
                      padding: "6px",
                      background: "#f3f4f6",
                      borderRadius: "10px",
                      border: "1px solid #e5e7eb",
                    }}>
                      <div style={{ fontSize: "10px", fontWeight: "600", color: "#6b7280", padding: "0 4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        📦 Products Found
                      </div>
                      {msg.products.slice(0, 4).map((p) => (
                        <ProductCard key={p._id} product={p} />
                      ))}
                      {msg.products.length > 4 && (
                        <div style={{ fontSize: "11px", color: "#6b7280", textAlign: "center", padding: "2px" }}>
                          +{msg.products.length - 4} more products
                        </div>
                      )}
                    </div>
                  )}

                  {/* Comparison table */}
                  {msg.comparison && msg.products && msg.products.length > 0 && (
                    <ComparisonTable products={msg.products} />
                  )}
                </div>
              );
            })}

            {isLoading && <TypingIndicator />}

            {showSuggestions && messages.length <= 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
                <div style={{ fontSize: "11px", color: "#9ca3af", fontWeight: "500", padding: "0 4px" }}>
                  Try asking:
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      style={{
                        background: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "16px",
                        padding: "6px 12px",
                        fontSize: "12px",
                        color: "#374151",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#f97316"; e.currentTarget.style.color = "#f97316"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#374151"; }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={chatBottom} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              padding: "10px 12px",
              borderTop: "1px solid #e5e7eb",
              backgroundColor: "#fff",
              gap: "8px",
              flexShrink: 0,
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products, orders, policies..."
              disabled={isLoading}
              style={{
                flex: 1,
                border: "1px solid #d1d5db",
                borderRadius: "10px",
                padding: "10px 14px",
                fontSize: "13px",
                outline: "none",
                backgroundColor: isLoading ? "#f9fafb" : "#fff",
                color: "#1f2937",
              }}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) handleSubmit(e); }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              style={{
                backgroundColor: input.trim() && !isLoading ? "#f97316" : "#d1d5db",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "0 18px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
                transition: "background 0.15s",
              }}
            >
              {isLoading ? "..." : "→"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
