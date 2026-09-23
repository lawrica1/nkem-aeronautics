const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

const TOKEN_KEY = "nkem_token";
const ADMIN_TOKEN_KEY = "nkem_admin_token";
const ACCOUNT_KEY = "nkem_has_account";

export function getApiBaseUrl() {
  return BASE_URL;
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

export function getAdminToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

// Admin tokens expire after 12h; send the admin back to sign in instead of showing errors.
function handleExpiredAdmin(res, admin) {
  if (admin && res.status === 401 && typeof window !== "undefined") {
    clearAdminToken();
    window.location.assign("/admin/login");
  }
}

export function hasAccount() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ACCOUNT_KEY) === "true";
}

export function markHasAccount() {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCOUNT_KEY, "true");
}

export async function apiRequest(path, { method = "GET", body, auth = false, admin = false } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth || admin) {
    const token = admin ? getAdminToken() : getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    handleExpiredAdmin(res, admin);
    throw new Error(data?.message ?? `Request failed with status ${res.status}`);
  }

  return data;
}

// Ends the session server-side (on every device), then clears it here even if that call fails.
export async function signOut({ admin = false } = {}) {
  await apiRequest(admin ? "/admin/logout" : "/auth/logout", { method: "POST", auth: !admin, admin }).catch(() => {});
  if (admin) clearAdminToken();
  else clearToken();
}

export async function apiUpload(path, formData, { admin = false } = {}) {
  const headers = {};
  const token = admin ? getAdminToken() : getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers,
    credentials: "include",
    body: formData,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    handleExpiredAdmin(res, admin);
    throw new Error(data?.message ?? `Upload failed with status ${res.status}`);
  }

  return data;
}
