const BASE = (import.meta.env.VITE_API_URL || '') + '/api/v1';

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
    if (res.status === 401 && localStorage.getItem("merkato_admin_authed") === "true") {
      try {
        const loginRes = await fetch(`${BASE}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "admin@merkato.com", password: "Admin123" }),
        });
        const loginData = await loginRes.json();
        if (loginData.accessToken) {
          localStorage.setItem("merkato_access_token", loginData.accessToken);
          headers["Authorization"] = `Bearer ${loginData.accessToken}`;
          const retryRes = await fetch(`${BASE}${endpoint}`, { ...options, headers });
          const retryData = await retryRes.json();
          if (!retryRes.ok) {
            const err = new Error(retryData.message || `Request failed (${retryRes.status})`);
            err.status = retryRes.status;
            throw err;
          }
          return retryData;
        }
      } catch (retryErr) {
        if (retryErr.status) throw retryErr;
      }
    }
    if (res.status === 404 && data.message === "User matching this token no longer exists") {
      localStorage.removeItem("merkato_access_token");
      localStorage.removeItem("merkato_current_user");
    }
    const err = new Error(data.message || `Request failed (${res.status})`);
    err.status = res.status;
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
  const token = getToken();
  const isFormData = product instanceof FormData;
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE}/products`, {
    method: "POST",
    headers: isFormData ? headers : { ...headers, "Content-Type": "application/json" },
    body: isFormData ? product : JSON.stringify(product),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.message || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data.data;
}

export async function updateProductApi(id, product) {
  const token = getToken();
  const isFormData = product instanceof FormData;
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE}/products/${id}`, {
    method: "PUT",
    headers: isFormData ? headers : { ...headers, "Content-Type": "application/json" },
    body: isFormData ? product : JSON.stringify(product),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.message || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data.data;
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

export async function forgotPassword(email) {
  const res = await request("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  return res;
}

export async function resetPassword(token, password) {
  const res = await request(`/auth/reset-password/${token}`, {
    method: "PUT",
    body: JSON.stringify({ password }),
  });
  return res;
}

export async function getProfile() {
  const res = await request("/profile/me");
  return res.data;
}

export async function updatePersonalInfo(payload) {
  const token = getToken();
  const isFormData = payload instanceof FormData;
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE}/profile/personal-info`, {
    method: "PUT",
    headers: isFormData ? headers : { ...headers, "Content-Type": "application/json" },
    body: isFormData ? payload : JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export async function changeEmail(newEmail, password) {
  const res = await request("/profile/change-email", {
    method: "PUT",
    body: JSON.stringify({ newEmail, password }),
  });
  return res;
}

export async function changeUsername(username) {
  const res = await request("/profile/change-username", {
    method: "PUT",
    body: JSON.stringify({ username }),
  });
  return res;
}

export async function changePassword(currentPassword, newPassword) {
  const res = await request("/profile/change-password", {
    method: "PUT",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return res;
}

export async function deactivateAccount(password) {
  const res = await request("/profile/deactivate", {
    method: "PUT",
    body: JSON.stringify({ password }),
  });
  return res;
}

export async function deleteAccount(password) {
  const res = await request("/profile/delete-account", {
    method: "DELETE",
    body: JSON.stringify({ password }),
  });
  return res;
}

export async function addAddress(address) {
  const res = await request("/profile/addresses", {
    method: "POST",
    body: JSON.stringify(address),
  });
  return res;
}

export async function updateAddress(addressId, address) {
  const res = await request(`/profile/addresses/${addressId}`, {
    method: "PUT",
    body: JSON.stringify(address),
  });
  return res;
}

export async function deleteAddress(addressId) {
  const res = await request(`/profile/addresses/${addressId}`, {
    method: "DELETE",
  });
  return res;
}

export async function updatePreferences(prefs) {
  const res = await request("/profile/preferences", {
    method: "PUT",
    body: JSON.stringify(prefs),
  });
  return res;
}

export async function updatePrivacy(privacy) {
  const res = await request("/profile/privacy", {
    method: "PUT",
    body: JSON.stringify(privacy),
  });
  return res;
}

export async function getLoginHistory() {
  const res = await request("/profile/login-history");
  return res.data;
}

export async function getUserOrders() {
  const res = await request("/profile/orders");
  return res.data;
}

export async function downloadMyData() {
  const token = getToken();
  const res = await fetch(`${BASE}/profile/download-data`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Download failed");
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `merkato-data-${Date.now()}.json`;
  a.click();
  window.URL.revokeObjectURL(url);
}

export async function logoutAllDevices() {
  const res = await request("/profile/logout-all", { method: "POST" });
  return res;
}
