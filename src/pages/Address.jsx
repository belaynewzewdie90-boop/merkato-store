import React, { useState } from "react";

export default function Address() {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Home",
      details: "Addis Ababa, Bole, Ethiopia",
    },
    {
      id: 2,
      name: "Office",
      details: "Addis Ababa, Kazanchis, Ethiopia",
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    details: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addAddress = (e) => {
    e.preventDefault();

    if (!form.name || !form.details) return;

    const newAddress = {
      id: Date.now(),
      ...form,
    };

    setAddresses([newAddress, ...addresses]);
    setForm({ name: "", details: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Address Book</h1>

      {/* Add Address Form */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Address</h2>

        <form onSubmit={addAddress} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Address Name (e.g. Home)"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <textarea
            name="details"
            placeholder="Full Address"
            value={form.details}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Save Address
          </button>
        </form>
      </div>

      {/* Recent / Saved Addresses */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Saved Addresses</h2>

        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-md transition"
            >
              <h3 className="font-bold text-lg">{addr.name}</h3>
              <p className="text-gray-600 mt-2">{addr.details}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}