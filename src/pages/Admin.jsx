import { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiSearch,
  FiPackage,
  FiCheckCircle,
  FiAlertCircle,
  FiZap,
  FiFileText,
  FiTruck,
  FiClock,
} from "react-icons/fi";
import { useAdmin } from "../context/AdminContext";

const EMPTY_FORM = {
  name: "",
  price: "",
  category: "",
  image: "",
  description: "",
  stock: 0,
};

export default function Admin() {
  const location = useLocation();
  const isOrders = location.pathname === "/admin/orders";

  const {
    products,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleStock,
    releaseProduct,
    addOrder,
    updateOrderStatus,
    markDelivered,
    deleteOrder,
    clearOrders,
    refreshOrders,
  } = useAdmin();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // poll localStorage every 3s for order changes (cross-tab / same tab)
  useEffect(() => {
    const interval = setInterval(refreshOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = useMemo(() => {
    const total = products.length;
    const outOfStock = products.filter((p) => p.stock === 0).length;
    const inStock = total - outOfStock;
    const totalUnits = products.reduce((s, p) => s + Number(p.stock || 0), 0);
    const value = products.reduce(
      (s, p) => s + Number(p.price || 0) * Number(p.stock || 0),
      0,
    );
    return { total, outOfStock, inStock, totalUnits, value };
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchFilter =
        filter === "all" ||
        (filter === "instock" && p.stock > 0) ||
        (filter === "outstock" && p.stock === 0);
      return matchSearch && matchFilter;
    });
  }, [products, search, filter]);

  const openAdd = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      description: product.description,
      stock: product.stock,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price) || 0,
      stock: Number(formData.stock) || 0,
    };
    if (editingId) {
      updateProduct(editingId, payload);
    } else {
      addProduct(payload);
    }
    closeForm();
  };

  const handleDelete = (id) => {
    if (confirm("Delete this product permanently?")) {
      deleteProduct(id);
    }
  };

  // orders view
  if (isOrders) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <span className="text-orange-500 font-bold tracking-wider text-xs uppercase bg-orange-50 px-3 py-1 rounded-full">
              Dashboard
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mt-2">
              Order Tracking
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              View and manage customer orders.
            </p>
          </div>
          {orders.length > 0 && (
            <button
              onClick={() => {
                if (confirm("Clear all order history?")) clearOrders();
              }}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-xl transition-all text-sm inline-flex items-center gap-2 cursor-pointer"
            >
              <FiTrash2 /> Clear All
            </button>
          )}
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-4 py-3 font-bold">Order #</th>
                  <th className="text-left px-4 py-3 font-bold">Customer</th>
                  <th className="text-left px-4 py-3 font-bold">Items</th>
                  <th className="text-left px-4 py-3 font-bold">Total</th>
                  <th className="text-left px-4 py-3 font-bold">Status</th>
                  <th className="text-left px-4 py-3 font-bold">Date</th>
                  <th className="text-right px-4 py-3 font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center text-gray-400 py-10 text-sm">
                      No orders yet.
                    </td>
                  </tr>
                )}
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-gray-100 hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-bold text-gray-900">#{o.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-gray-800">{o.customerName || "N/A"}</p>
                      <p className="text-xs text-gray-400">{o.phone || ""}</p>
                      <p className="text-xs text-gray-400">{o.address || ""}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {o.items ? o.items.map((i) => i.name + " x" + i.qty).join(", ") : "—"}
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900">
                      {(o.totalPaid || 0).toLocaleString()} ETB
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase inline-flex items-center gap-1 ${o.status === "Placed" ? "bg-blue-50 text-blue-700 border border-blue-100" : o.status === "Processing" ? "bg-yellow-50 text-yellow-700 border border-yellow-100" : o.status === "Shipped" ? "bg-purple-50 text-purple-700 border border-purple-100" : o.status === "Delivered" ? "bg-green-50 text-green-700 border border-green-100" : o.status === "Canceled" ? "bg-red-50 text-red-600 border border-red-100" : "bg-gray-100 text-gray-600"}`}>
                        {o.status === "Processing" && <FiClock className="w-3 h-3" />}
                        {o.status === "Delivered" && <FiTruck className="w-3 h-3" />}
                        {o.status || "Placed"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {o.date || ""}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {o.status !== "Canceled" && o.status !== "Delivered" && (
                          <select
                            value=""
                            onChange={(e) => {
                              if (e.target.value) updateOrderStatus(o.id, e.target.value);
                              e.target.value = "";
                            }}
                            className="text-[10px] border border-gray-200 rounded px-1 py-1 outline-none focus:border-orange-500 bg-white"
                          >
                            <option value="" disabled>Advance</option>
                            {["Placed", "Processing", "Shipped", "Delivered"]
                              .filter((s) => {
                                const order = ["Placed", "Processing", "Shipped", "Delivered"];
                                return order.indexOf(s) > order.indexOf(o.status);
                              })
                              .map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                          </select>
                        )}
                        <IconBtn
                          onClick={() => {
                            if (confirm("Delete this order?")) deleteOrder(o.id);
                          }}
                          color="hover:bg-red-50 text-red-500"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </IconBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // products view
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <span className="text-orange-500 font-bold tracking-wider text-xs uppercase bg-orange-50 px-3 py-1 rounded-full">
            Dashboard
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mt-2">
            Manage Products
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Add, edit, and release inventory across the store.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-gray-900 hover:bg-orange-600 text-white font-bold py-2.5 px-5 rounded-xl transition-all text-sm shadow-xs active:scale-[0.98] inline-flex items-center gap-2 cursor-pointer"
        >
          <FiPlus /> Add New Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<FiPackage />}
          label="Total Products"
          value={stats.total}
          color="bg-gray-900"
        />
        <StatCard
          icon={<FiCheckCircle />}
          label="In Stock"
          value={stats.inStock}
          color="bg-green-500"
        />
        <StatCard
          icon={<FiAlertCircle />}
          label="Out of Stock"
          value={stats.outOfStock}
          color="bg-red-500"
        />
        <StatCard
          icon={<FiZap />}
          label="Inventory Value"
          value={`${stats.value.toLocaleString()} ETB`}
          color="bg-orange-500"
        />
      </div>

      {/* Search + Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center border border-gray-200 rounded-xl px-3 bg-white focus-within:ring-2 focus-within:ring-orange-500">
          <FiSearch className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full p-2.5 text-sm outline-none bg-transparent"
          />
        </div>
        <div className="flex gap-2 bg-white border border-gray-200 rounded-xl p-1">
          {[
            { key: "all", label: "All" },
            { key: "instock", label: "In Stock" },
            { key: "outstock", label: "Out of Stock" },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setFilter(opt.key)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                filter === opt.key
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3 font-bold">Product</th>
                <th className="text-left px-4 py-3 font-bold">Category</th>
                <th className="text-left px-4 py-3 font-bold">Price</th>
                <th className="text-left px-4 py-3 font-bold">Stock</th>
                <th className="text-left px-4 py-3 font-bold">Status</th>
                <th className="text-right px-4 py-3 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center text-gray-400 py-10 text-sm"
                  >
                    No products match your filters.
                  </td>
                </tr>
              )}
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-gray-100 hover:bg-gray-50/50"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                      />
                      <div>
                        <p className="font-bold text-gray-800 line-clamp-1">
                          {p.name}
                        </p>
                        <p className="text-[11px] text-gray-400 line-clamp-1">
                          {p.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold text-gray-600">
                    {p.category}
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-900">
                    {p.price.toLocaleString()}{" "}
                    <span className="text-[10px] text-orange-600">ETB</span>
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-800">
                    {p.stock}
                  </td>
                  <td className="px-4 py-3">
                    {p.stock > 0 ? (
                      <span className="text-[10px] font-bold bg-green-50 text-green-700 border border-green-100 px-2 py-1 rounded-full uppercase">
                        In Stock
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-red-50 text-red-700 border border-red-100 px-2 py-1 rounded-full uppercase">
                        Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <IconBtn
                        onClick={() => openEdit(p)}
                        color="hover:bg-blue-50 text-blue-600"
                        title="Edit"
                      >
                        <FiEdit2 />
                      </IconBtn>
                      {p.stock === 0 ? (
                        <button
                          onClick={() => releaseProduct(p.id)}
                          className="text-[10px] font-bold bg-green-500 hover:bg-green-600 text-white px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1 cursor-pointer"
                        >
                          <FiZap /> Release
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleStock(p.id)}
                          className="text-[10px] font-bold bg-red-500 hover:bg-red-600 text-white px-2.5 py-1.5 rounded-lg cursor-pointer"
                        >
                          Mark OOS
                        </button>
                      )}
                      <IconBtn
                        onClick={() => handleDelete(p.id)}
                        color="hover:bg-red-50 text-red-500"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </IconBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
              <h3 className="text-lg font-black text-gray-900">
                {editingId ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={closeForm}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                <FiX size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-3">
              <Field
                label="Product Name"
                required
                value={formData.name}
                onChange={(v) => setFormData({ ...formData, name: v })}
              />
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Price (ETB)"
                  type="number"
                  required
                  value={formData.price}
                  onChange={(v) => setFormData({ ...formData, price: v })}
                />
                <Field
                  label="Stock"
                  type="number"
                  value={formData.stock}
                  onChange={(v) => setFormData({ ...formData, stock: v })}
                />
              </div>
              <Field
                label="Category"
                required
                value={formData.category}
                onChange={(v) => setFormData({ ...formData, category: v })}
              />
              <Field
                label="Image URL"
                value={formData.image}
                onChange={(v) => setFormData({ ...formData, image: v })}
                placeholder="https://..."
              />
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="mt-1 w-full border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Short product description..."
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gray-900 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
                >
                  {editingId ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-xl ${color} text-white flex items-center justify-center text-lg`}
      >
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">
          {label}
        </p>
        <p className="text-lg font-black text-gray-900 leading-tight">
          {value}
        </p>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required, placeholder }) {
  return (
    <div>
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500"
      />
    </div>
  );
}

function IconBtn({ children, onClick, color, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${color}`}
    >
      {children}
    </button>
  );
}
