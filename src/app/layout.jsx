import { Toaster } from "react-hot-toast";
import { RiErrorWarningLine } from "react-icons/ri";
import { FaRegCircleCheck } from "react-icons/fa6";
import "./globals.css";
import QueryProvider from "@/components/provider/QueryProvider";
import { LiffProvider } from "@/components/provider/LiffProvider";
import { Suspense } from "react";
import ErrorBoundary from "@/components/Ui/ErrorBoundary";
import Loading from "@/components/Loading";
import ErrorComponent from "@/components/Ui/ErrorComponent";

const toastIconClass = "mr-4 h-8 w-auto animate-pulse";

export const toastOptions = {
  style: {
    background: "linear-gradient(45deg, #259B24, #57C785, #BCED53)",
    color: "#fff",
    fontWeight: "bold",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    padding: "8px 32px",
    fontSize: "18px",
  },
  success: {
    icon: <FaRegCircleCheck className={toastIconClass} />,
  },
  error: {
    style: {
      background: "linear-gradient(45deg, #ff7b00, #dc2626)",
    },
    icon: <RiErrorWarningLine className={toastIconClass} />,
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
        <QueryProvider>
          <LiffProvider>
            {children}
            <Toaster
              position="top-center"
              containerClassName="mx-auto z-[9999] w-4/5"
              toastOptions={toastOptions}
            />
          </LiffProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
