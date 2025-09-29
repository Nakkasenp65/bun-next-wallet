"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function QueryProvider({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        // 2. ตั้งค่า Default ให้กับทุก Query ในแอป
        defaultOptions: {
          queries: {
            // ทำให้ข้อมูลทุกอย่างมี staleTime พื้นฐาน 1 นาที
            // เพื่อลดการ refetch ที่ไม่จำเป็น
            staleTime: 1000 * 60 * 1, // 1 minute
            // ปิดการ refetch อัตโนมัติเมื่อ focus ที่หน้าต่าง (ถ้าต้องการ)
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {/* 1. เพิ่ม Devtools สำหรับช่วยดีบักในตอน Development */}
      {/* เครื่องมือนี้จะไม่ถูกรวมเข้าไปใน Production build โดยอัตโนมัติ */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
