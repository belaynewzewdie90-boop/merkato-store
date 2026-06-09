import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaHome,
} from "react-icons/fa";

export default function Address() {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Home",
      details: "Addis Ababa, Bole, Ethiopia",
      default: true,
    },
    {
      id: 2,
      name: "Office",
      details: "Addis Ababa, Kazanchis, Ethiopia",
      default: false,
    },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">
              Address Management
            </h1>
            <p className="text-slate-500 mt-2">
              Manage your saved delivery locations
            </p>
          </div>

          <button className="mt-4 md:mt-0 flex items-center gap-2 bg-orange-500 to-violet-600 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition">
            <FaPlus />
            Add Address
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="text-slate-500">Total Addresses</h3>
            <p className="text-3xl font-bold mt-2">
              {addresses.length}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="text-slate-500">Default Address</h3>
            <p className="text-xl font-semibold mt-2">
              Home
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="text-slate-500">Status</h3>
            <p className="text-green-600 font-semibold mt-2">
              Active
            </p>
          </div>
        </div>

        {/* Address Cards */}
        <div className="grid lg:grid-cols-2 gap-8">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="group relative bg-white rounded-3xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-100"
            >
              {/* Default Badge */}
              {address.default && (
                <span className="absolute top-5 right-5 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                  Default
                </span>
              )}

              <div className="flex items-start gap-5">
                <div className="bg-indigo-100 p-4 rounded-2xl">
                  <FaHome className="text-indigo-600 text-xl" />
                </div>

                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-800">
                    {address.name}
                  </h2>

                  <div className="flex items-center gap-2 mt-3 text-slate-500">
                    <FaMapMarkerAlt />
                    <p>{address.details}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-8">
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 transition">
                  <FaEdit />
                  Edit
                </button>

                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition">
                  <FaTrash />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Premium Empty State Example */}
        {addresses.length === 0 && (
          <div className="bg-white rounded-3xl p-16 text-center shadow-lg">
            <FaMapMarkerAlt className="mx-auto text-6xl text-slate-300 mb-4" />
            <h2 className="text-2xl font-bold text-slate-700">
              No Addresses Found
            </h2>
            <p className="text-slate-500 mt-2">
              Add your first delivery address to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}