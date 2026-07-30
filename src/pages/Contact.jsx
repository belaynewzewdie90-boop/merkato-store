import { useState } from "react";
import { Link } from "react-router-dom";

const CONTACT_PHONE = "0954454027";
const CONTACT_EMAIL = "belaynewzewdie90@gmail.com";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        setLoading(false);
        return;
      }

      setSent(true);
      setLoading(false);
      setFormData({ name: "", email: "", message: "" });

      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      setError("Connection error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
          Contact Us
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Have questions about our products or delivery? Send us a message and
          we'll respond quickly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="bg-gray-50 p-6 rounded-xl border">
          <h2 className="text-lg font-bold mb-4 text-gray-800">
            Get in Touch
          </h2>

          <div className="space-y-3 text-sm text-gray-600">
            <p>
              Address: Merkato Area, Addis Ababa, Ethiopia
            </p>
            <p>
              Phone: {CONTACT_PHONE}
            </p>
            <p>
              Email: {CONTACT_EMAIL}
            </p>
            <p>
              Working Hours: Mon - Sat (8:00 AM - 6:00 PM)
            </p>
          </div>

          <div className="mt-6">
            <Link
              to="/products"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Browse Products
            </Link>
          </div>
        </div>

        {/* Contact Form */}
        <div className="border rounded-xl p-6 bg-white shadow-sm">
          <h2 className="text-lg font-bold mb-4 text-gray-800">
            Send a Message
          </h2>

          {sent ? (
            <div className="text-center py-10">
              <p className="text-green-600 font-bold text-lg">
                Message Sent Successfully!
              </p>
              <p className="text-sm text-gray-500 mt-2">
                We'll get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 font-semibold">
                  {error}
                </p>
              )}

              <div>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div>
                <input
                  type="email"
                  required
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div>
                <textarea
                  rows="4"
                  required
                  placeholder="Your Message..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-lg transition disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
