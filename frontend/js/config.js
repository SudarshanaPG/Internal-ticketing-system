// Frontend runtime configuration.
// For hosting, set API_BASE_URL to your deployed backend URL, e.g.:
// window.APP_CONFIG = { API_BASE_URL: "https://your-backend-host/api" };
window.APP_CONFIG = window.APP_CONFIG || {};
window.APP_CONFIG.API_BASE_URL =
  window.APP_CONFIG.API_BASE_URL || "http://localhost:8000/api";
