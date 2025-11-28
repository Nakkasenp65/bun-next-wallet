import axios from "axios";
import { getAuthToken } from "./tokenManager"; // ตรวจสอบให้แน่ใจว่า path ถูกต้อง
import liff from "@line/liff"; // Import liff object

// --- การตั้งค่า URL ของ API Server ---
const serverOption = process.env.NEXT_PUBLIC_SERVER_OPTION;
const productionApiUrl = process.env.NEXT_PUBLIC_API_URL;
const devApiUrl = process.env.NEXT_PUBLIC_DEV_API_URL;
const apiUrl = serverOption === "dev" ? devApiUrl : productionApiUrl;

// --- สร้าง Axios Instance ---
const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- 1. Request Interceptor ---
// ทำงานก่อนที่ request จะถูกส่งออกไป
// หน้าที่: แนบ Access Token ไปกับทุก request โดยอัตโนมัติ
axiosInstance.interceptors.request.use(
  (config) => {
    // กรณีที่ส่ง FormData (เช่น อัปโหลดไฟล์) ไม่ต้องตั้ง Content-Type
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    // ดึง token ล่าสุดจากที่เก็บ (localStorage/state)
    const token = getAuthToken();
    if (token) {
      // ถ้ามี token ให้ใส่ใน Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // ถ้าเกิด error ก่อนจะส่ง request ก็ให้ reject ไป
    console.error(error);
    return Promise.reject(error);
  },
);

export default axiosInstance;
