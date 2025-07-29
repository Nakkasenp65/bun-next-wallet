import { Toaster } from "react-hot-toast";

import "./globals.css";
import QueryProvider from "@/components/provider/QueryProvider";
import { LiffProvider } from "@/components/provider/LiffProvider";
import { Suspense } from "react";
import ErrorBoundary from "@/components/Ui/ErrorBoundary";
import Loading from "@/components/Loading";

export const toastOptions = {
  style: {
    background: "linear-gradient(45deg, #ec4899, #f97316, #a855f7)",
    color: "#fff",
    fontWeight: "bold",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    padding: "16px 32px",
  },
  success: {
    iconTheme: {
      primary: "#fff",
      secondary: "#a855f7",
    },
  },
  error: {
    style: {
      background: "linear-gradient(45deg, #ef4444, #dc2626)",
    },
  },
  position: "top-center",
  duration: 4000,
};

export const metadata = {
  title: "NO1Money+",
  description: "app.no1.mobi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <ErrorBoundary
          fallback={
            <div className="bg-bg-dark flex h-dvh w-full items-center justify-center">
              <p className="text-white">เกิดข้อผิดพลาด กรุณารีเฟรช</p>
            </div>
          }
        >
          <Suspense
            fallback={
              <div className="bg-bg-dark flex h-dvh w-full items-center justify-center">
                <Loading />
              </div>
            }
          >
            <QueryProvider>
              <LiffProvider>
                <Toaster position="top-center" containerClassName="z-[9999]" toastOptions={toastOptions} />
                {children}
              </LiffProvider>
            </QueryProvider>
          </Suspense>
        </ErrorBoundary>
      </body>
    </html>
  );
}
