import "./globals.css";
import { Toaster, DefaultToastOptions } from "react-hot-toast";
import { RiErrorWarningLine } from "react-icons/ri";
import { FaRegCircleCheck } from "react-icons/fa6";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import QueryProvider from "@/components/provider/QueryProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { LiffProvider } from "@/components/provider/LiffProvider";
import TokenSynchronizer from "@/components/provider/TokenSynchronizer";
import { LockProvider } from "@/components/context/LockContext";

const toastIconClass = "h-12 w-auto animate-pulse";
const toastWaiting = "animate-spin text-primary-pink";

export const toastOptions: DefaultToastOptions = {
  style: {
    background: "linear-gradient(45deg, #259B24, #57C785, #BCED53)",
    color: "#fff",
    fontWeight: "bold",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    padding: "8px 24px",
    fontSize: "14px",
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
  duration: 5000,
};

import type { Metadata } from "next";

// ... existing imports

// ... existing toastOptions

export const metadata: Metadata = {
  title: "1 Wallet Premium+",
  icons: {
    icon: [{ url: "/favicon.ico" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`bg-bg-dark antialiased`}>
        <QueryProvider>
          <LiffProvider>
            <LockProvider>
              <TokenSynchronizer />
              {children}
              <ReactQueryDevtools />
              <Toaster
                position="top-center"
                containerClassName="mx-auto z-[9999] w-[90%]"
                toastOptions={toastOptions}
              />
            </LockProvider>
          </LiffProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
