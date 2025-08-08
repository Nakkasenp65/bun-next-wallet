import axios from "axios";
import { getAuthToken } from "./tokenManager";

const serverOption = NEXT_PUBLIC_SERVER_OPTION;
const productionApiUrl = NEXT_PUBLIC_API_URL;
const devApiUrl = NEXT_PUBLIC_DEV_API_URL;

const apiUrl = serverOption === "dev" ? devApiUrl : productionApiUrl;

const axiosInstance = axios.create({
  baseURL: productionApiUrl,
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
      // ถ้าใช่, ให้ลบ Content-Type ที่เราตั้งค่าไว้ตายตัว (application/json) ออก
      // เพื่อให้ Axios สามารถตั้งค่าเป็น 'multipart/form-data' พร้อม boundary ที่ถูกต้องได้เองโดยอัตโนมัติ
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
