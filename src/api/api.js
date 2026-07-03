const BASE = "http://localhost:5000/api/v1";

function getToken() {
  const accessToken = localStorage.getItem("merkato_access_token");
  if (accessToken) return accessToken;
  const legacyToken = localStorage.getItem("merkato_token");
  if (legacyToken) {
    // migrate legacy token to new key
    localStorage.setItem("merkato_access_token", legacyToken);
    localStorage.removeItem("merkato_token");
    return legacyToken;
  }
  return null;
}

function setToken(token) {
  if (token) {
    localStorage.setItem("merkato_access_token", token);
  } else {
    localStorage.removeItem("merkato_access_token");
  }
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.message || `Request failed (${res.status})`);
    err.status = res.status;
    if (res.status === 404 && data.message === "User matching this token no longer exists") {
      localStorage.removeItem("merkato_access_token");
      localStorage.removeItem("merkato_current_user");
    }
    throw err;
  }
  return data;
}

export { setToken, getToken };

export async function fetchProducts() {
  const res = await request("/products");
  return res.data;
}

export async function fetchProduct(id) {
  const res = await request(`/products/${id}`);
  return res.data;
}

export async function createProductApi(product) {
  const res = await request("/products", {
    method: "POST",
    body: JSON.stringify(product),
  });
  return res.data;
}

export async function updateProductApi(id, updates) {
  const res = await request(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  return res.data;
}

export async function deleteProductApi(id) {
  const res = await request(`/products/${id}`, { method: "DELETE" });
  return res;
}

export async function registerUser(data) {
  const res = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res;
}

export async function loginUser(email, password) {
  const res = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (res.accessToken) {
    setToken(res.accessToken);
  }
  return res;
}

export async function getMe() {
  const res = await request("/auth/me");
  return res.user;
}

export async function createOrder(orderData) {
  const res = await request("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
  return res.data;
}

export async function fetchOrders() {
  const res = await request("/orders");
  return res.data;
}

export async function fetchOrder(id) {
  const res = await request(`/orders/${id}`);
  return res.data;
}

export async function updateOrderStatus(id, status) {
  const res = await request(`/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return res.data;
}

export async function cancelOrderApi(id) {
  const res = await request(`/orders/${id}/cancel`, { method: "PATCH" });
  return res.data;
}

export async function updateOrderPayment(id, paymentData) {
  const res = await request(`/orders/${id}/payment`, {
    method: "PATCH",
    body: JSON.stringify(paymentData),
  });
  return res.data;
}

export async function deleteOrderApi(id) {
  const res = await request(`/orders/${id}`, { method: "DELETE" });
  return res;
}

export async function fetchUsers() {
  const res = await request("/admin/users");
  return res;
}

export async function fetchAuditLogs() {
  const res = await request("/admin/audit-logs");
  return res.data;
}
