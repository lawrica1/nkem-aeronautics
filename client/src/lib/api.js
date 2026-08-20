// Same-origin by default — the API routes live in this same Next.js app
// under src/app/api/. Only set NEXT_PUBLIC_API_URL to point elsewhere.
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

const TOKEN_KEY = "nkem_token";
const ACCOUNT_KEY = "nkem_has_account";

// These all guard on `window` because Next.js server-renders every page
// (including "use client" components) on the initial request, and
// localStorage doesn't exist in that environment.
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

// Tracks, per-browser, whether this visitor has ever completed signup/login
// here — lets the homepage default to "Sign Up" for first-time visitors and
// "Log In" for returning ones without needing a backend session check.
export function hasAccount() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ACCOUNT_KEY) === "true";
}

export function markHasAccount() {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCOUNT_KEY, "true");
}

export async function apiRequest(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message ?? `Request failed with status ${res.status}`);
  }

  return data;
}
