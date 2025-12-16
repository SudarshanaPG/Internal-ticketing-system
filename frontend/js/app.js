const DEFAULT_API_BASE_URL =
  (window.APP_CONFIG && window.APP_CONFIG.API_BASE_URL) || "http://localhost:8000/api";

export const API_BASE_URL = localStorage.getItem("API_BASE_URL") || DEFAULT_API_BASE_URL;

export const CATEGORIES = ["Technical", "Financial", "Product"];
export const STATUSES = ["New", "Under Review", "Resolved"];

const TOKEN_KEY = "ticketing_tokens";
const USER_KEY = "ticketing_user";

export function setTokens(access, refresh) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify({ access, refresh }));
}

export function getTokens() {
  const raw = localStorage.getItem(TOKEN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

export function setUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.location.href = "index.html";
}

async function refreshToken(refresh) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) {
      clearAuth();
      return null;
    }
    const data = await res.json();
    setTokens(data.access, refresh);
    return data.access;
  } catch (err) {
    clearAuth();
    return null;
  }
}

export async function apiFetch(path, options = {}) {
  const tokens = getTokens();
  const init = { ...options };
  const headers = new Headers(options.headers || {});

  if (tokens?.access) {
    headers.set("Authorization", `Bearer ${tokens.access}`);
  }

  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
    init.body = JSON.stringify(init.body);
  }

  init.headers = headers;

  let response = await fetch(`${API_BASE_URL}${path}`, init);

  if (response.status === 401 && tokens?.refresh && path !== "/auth/refresh") {
    const newAccess = await refreshToken(tokens.refresh);
    if (newAccess) {
      headers.set("Authorization", `Bearer ${newAccess}`);
      response = await fetch(`${API_BASE_URL}${path}`, init);
    }
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const data = await response.json();
      if (data.detail) {
        message = data.detail;
      } else {
        message = JSON.stringify(data);
      }
    } catch (err) {
      // ignore JSON parse issues
    }
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

export function guardAuth() {
  const tokens = getTokens();
  if (!tokens?.access) {
    window.location.href = "index.html";
  }
}

export function renderUserBadge() {
  const user = getUser();
  const badge = document.getElementById("user-badge");
  const logoutBtn = document.getElementById("logout-btn");
  if (!badge) return;
  if (user) {
    badge.textContent = `${user.username} ${user.is_staff ? "(Admin)" : "(User)"}`;
  } else {
    badge.textContent = "Guest";
  }
  if (logoutBtn) {
    logoutBtn.addEventListener("click", clearAuth);
  }
}

export function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleString();
}

export function statusClass(value) {
  return value.toLowerCase().replace(/\s+/g, "-");
}
