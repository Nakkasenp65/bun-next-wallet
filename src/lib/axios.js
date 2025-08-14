import axios from "axios";
import { getAuthToken } from "./tokenManager";

const serverOption = process.env.NEXT_PUBLIC_SERVER_OPTION;
const productionApiUrl = process.env.NEXT_PUBLIC_API_URL;
const devApiUrl = process.env.NEXT_PUBLIC_DEV_API_URL;

const apiUrl = serverOption === "dev" ? devApiUrl : productionApiUrl;
console.log("CHECK API URL", apiUrl);

const axiosInstance = axios.create({
  baseURL: productionApiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
