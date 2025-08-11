import axios from "axios";
import { getAuthToken } from "./tokenManager";

const serverOption = process.env.NEXT_PUBLIC_SERVER_OPTION;
const productionApiUrl = process.env.NEXT_PUBLIC_API_URL;
const devApiUrl = process.env.NEXT_PUBLIC_DEV_API_URL;

const apiUrl = serverOption === "dev" ? devApiUrl : productionApiUrl;
console.log("CHECK API URL", apiUrl);

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// นี่คือส่วนที่สำคัญที่สุด: Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // --- ส่วนที่เพิ่มเข้ามาเพื่อจัดการ FormData ---
    // ตรวจสอบว่าข้อมูล (data) ที่จะส่งไปกับ request นี้เป็น FormData object หรือไม่
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    // --- สิ้นสุดส่วนที่เพิ่มเข้ามา ---

    // Logic การใส่ Token ยังคงทำงานเหมือนเดิมสำหรับทุก request
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
