import { Toaster } from "react-hot-toast";
import "./globals.css";
import QueryProvider from "@/components/provider/QueryProvider";
import { LiffProvider } from "@/components/provider/LiffProvider";

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
        <QueryProvider>
          {/* <LiffProvider> */}
          {children}
          <Toaster position="top-center" containerClassName="z-[9999]" toastOptions={toastOptions} />
          {/* </LiffProvider> */}
        </QueryProvider>
      </body>
    </html>
  );
}
