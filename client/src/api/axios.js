import axios from "axios";

const rawBaseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const baseURL = rawBaseURL.endsWith("/api")
  ? rawBaseURL
  : `${rawBaseURL.replace(/\/$/, "")}/api`;

const api = axios.create({
  baseURL
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("user");
  if (stored) {
    try {
      const { token } = JSON.parse(stored);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      localStorage.removeItem("user");
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      window.location.pathname !== "/login"
    ) {
      localStorage.removeItem("user");
      window.location.assign("/login");
    }

    return Promise.reject(error);
  }
);

export default api;
