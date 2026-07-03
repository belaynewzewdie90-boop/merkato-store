// frontend/src/components/Chatbot.jsx
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const chatBottomAnchor = useRef(null);
  const mockupUser = "guest_user_123";

  useEffect(() => {
    const fetchSavedLogs = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/chat/history/${mockupUser}`,
        );
        if (response.data.messages && response.data.messages.length > 0) {
          setMessages(response.data.messages);
        } else {
          setMessages([
            {
              role: "assistant",
              content:
                "Welcome to Merkato Store! Type your query to start chatting.",
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to load historical database strings:", err);
      }
    };
    fetchSavedLogs();
  }, []);

  useEffect(() => {
    chatBottomAnchor.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const fireChatMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const currentPrompt = input.trim();
    setInput("");

    setMessages((prev) => [...prev, { role: "user", content: currentPrompt }]);
    setIsLoading(true);

    try {
      const serverResponse = await axios.post(
        "http://localhost:5000/api/v1/chat",
        {
          message: currentPrompt,
          userId: mockupUser,
        },
      );

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: serverResponse.data.reply },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Connection pipeline interface failed. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 🎯 Floating Wrapper Module Root anchored at Bottom Right
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        fontFamily: "sans-serif",
      }}
    >
      {/* 🟢 FLOATING ICON BUTTON (Shown when Chat is Closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            backgroundColor: "#f97316",
            color: "#fff",
            border: "none",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
            fontSize: "26px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.08)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          💬
        </button>
      )}

      {/* 🔵 CHAT TERMINAL INTERFACE BOX (Shown when Chat is Open) */}
      {isOpen && (
        <div
          style={{
            width: "350px",
            height: "480px",
            backgroundColor: "#fff",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: "1px solid #e5e7eb",
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#f97316",
              padding: "16px",
              color: "#fff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h4 style={{ margin: 0, fontSize: "15px", fontWeight: "700" }}>
                Merkato Assistant
              </h4>
              <span style={{ fontSize: "11px", opacity: 0.9 }}>
                ⚡ Active Chat Node
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: "18px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages Stream Container */}
          <div
            style={{
              flex: 1,
              padding: "16px",
              overflowY: "auto",
              backgroundColor: "#f9fafb",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {messages.map((msg, index) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={index}
                  style={{
                    alignSelf: isUser ? "flex-end" : "flex-start",
                    backgroundColor: isUser ? "#f97316" : "#e5e7eb",
                    color: isUser ? "#fff" : "#1f2937",
                    padding: "10px 14px",
                    borderRadius: isUser
                      ? "14px 14px 0 14px"
                      : "14px 14px 14px 0",
                    maxWidth: "80%",
                    fontSize: "13.5px",
                    lineHeight: "1.4",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  }}
                >
                  {msg.content}
                </div>
              );
            })}

            {isLoading && (
              <div
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: "#e5e7eb",
                  color: "#4b5563",
                  padding: "10px 14px",
                  borderRadius: "14px 14px 14px 0",
                  fontSize: "12px",
                  fontStyle: "italic",
                }}
              >
                Typing...
              </div>
            )}
            <div ref={chatBottomAnchor} />
          </div>

          {/* Input Submission Footer Form */}
          <form
            onSubmit={fireChatMessage}
            style={{
              display: "flex",
              padding: "12px",
              borderTop: "1px solid #e5e7eb",
              backgroundColor: "#fff",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              style={{
                flex: 1,
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                padding: "10px 12px",
                fontSize: "13.5px",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                marginLeft: "8px",
                backgroundColor: "#f97316",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "0 16px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
