// Frontend runtime configuration.
// For hosting, set API_BASE_URL to your deployed backend URL, e.g.:
// window.APP_CONFIG = { API_BASE_URL: "https://your-backend-host/api" };
window.APP_CONFIG = window.APP_CONFIG || {};
const isLocalHost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

window.APP_CONFIG.API_BASE_URL =
  window.APP_CONFIG.API_BASE_URL ||
  (isLocalHost
    ? "http://localhost:8000/api"
    : "https://internal-ticketing-system-qoyb.onrender.com/api");
