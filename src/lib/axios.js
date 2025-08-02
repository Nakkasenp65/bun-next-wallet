import axios from "axios";
import { getAuthToken } from "./tokenManager";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- This interceptor is now permanent and much simpler ---
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the latest token from the token manager
    const token = getAuthToken();

    // If the token exists, attach it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // This part handles errors on the request, like network issues.
    return Promise.reject(error);
  },
);

export default axiosInstance;
