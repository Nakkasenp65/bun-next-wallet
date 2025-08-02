import "./globals.css";
import { Toaster } from "react-hot-toast";
import { RiErrorWarningLine } from "react-icons/ri";
import { FaRegCircleCheck } from "react-icons/fa6";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import QueryProvider from "@/components/provider/QueryProvider";
import { LiffProvider, useLiff } from "@/components/provider/LiffProvider";
import { Suspense } from "react";
import ErrorBoundary from "@/components/StatusComponents/ErrorBoundary";
import Loading from "@/components/StatusComponents/Loading";
import ErrorComponent from "@/components/Ui/ErrorComponent";
import TokenSynchronizer from "@/components/provider/TokenSynchronizer";

const toastIconClass = "mr-4 h-8 w-auto animate-pulse";
const toastWaiting = "animate-spin text-primary-pink";

export const toastOptions = {
  style: {
    background: "linear-gradient(45deg, #259B24, #57C785, #BCED53)",
    color: "#fff",
    fontWeight: "bold",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    padding: "8px 32px",
    marginTop: "24px",
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
  loading: {
    style: { color: "black", background: "white" },
    icon: <AiOutlineLoading3Quarters className={toastWaiting} />,
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
            <TokenSynchronizer />
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
