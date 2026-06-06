import { useState } from "react";
import { Link } from "react-router-dom";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);

    // simulate sending message
    setTimeout(() => {
      setFormData({ name: "", email: "", message: "" });
      setSent(false);
    }, 2500);
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
          we’ll respond quickly.
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
              📍 Address: Merkato Area, Addis Ababa, Ethiopia
            </p>
            <p>
              📞 Phone: +251 911 000 000
            </p>
            <p>
              📧 Email: support@merkato-store.com
            </p>
            <p>
              ⏰ Working Hours: Mon - Sat (8:00 AM - 6:00 PM)
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
                ✅ Message Sent Successfully!
              </p>
              <p className="text-sm text-gray-500 mt-2">
                We’ll get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-lg transition"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}