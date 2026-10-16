import axios from "axios";

// Same-origin by default (backend serves the built frontend, dev uses the Vite proxy).
// Set VITE_API_URL only if the API is deployed on a different domain.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  withCredentials: true,
});

export const getErrorMessage = (error, fallback = "Something went wrong") =>
  error?.response?.data?.message || error?.message || fallback;

export default api;
