"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faDownload } from "@fortawesome/free-solid-svg-icons";
import { useParams, useRouter } from "next/navigation";
import QRCode from "qrcode";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Download, Info, Share2 } from "lucide-react";
// (optional) keep your other imports if you still need them:
// import { useUser } from "@/hooks/useUser";
// import CtaButton from "@/components/Ui/CtaButton";
// import Loading from "@/components/StatusComponents/Loading";

export default function MyQr() {
  const router = useRouter();
  const params = useParams();

  // normalize param (handles catch-all routes)
  const userIdParam = Array.isArray(params.userId)
    ? params.userId[0]
    : params.userId;

  // Hooks first (avoid hook-order warnings)
  const [qrDataUrl, setQrDataUrl] = useState("");

  // Generate QR locally (PNG data URL) using ONLY userId
  useEffect(() => {
    let cancelled = false;
    if (!userIdParam) return;
    QRCode.toDataURL(String(userIdParam), { width: 600, margin: 1 })
      .then((url) => !cancelled && setQrDataUrl(url))
      .catch(() => setQrDataUrl(""));
    return () => {
      cancelled = true;
    };
  }, [userIdParam]);

  const handleClose = () => router.push("/");

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `qr-${userIdParam}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <AnimatePresence>
      <motion.div
        // SECTION 1: The Backdrop & Container
        // ใช้ Framer Motion สร้างการเปิดตัวที่นุ่มนวล
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 flex flex-col bg-black/60 backdrop-blur-lg"
      >
        {/* Header */}
        <header className="flex items-center px-4 pt-12 pb-4">
          <button
            onClick={handleClose}
            className="z-10 rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Back"
          >
            <ChevronLeft size={28} />
          </button>
          <motion.h2
            // เพิ่ม Animation ให้ Header มีชีวิตชีวา
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
            className="from-primary-pink to-primary-orange flex-grow bg-gradient-to-r bg-clip-text text-center text-xl font-bold text-transparent"
          >
            QR ของฉัน
          </motion.h2>
          <div className="w-10" /> {/* Spacer to balance the header */}
        </header>

        {/* SECTION 2: The Main Content Panel */}
        {/* Panel ที่สไลด์ขึ้นมาจากด้านล่างด้วย spring animation */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{
            y: "0%",
            transition: { type: "spring", stiffness: 40, damping: 15 },
          }}
          exit={{ y: "100%" }}
          className="flex flex-grow flex-col items-center overflow-y-auto rounded-t-[32px] bg-gray-50 p-6"
        >
          <p className="mt-4 text-base text-gray-500">
            แสดง QR Code เพื่อรับเงิน
          </p>

          {/* SECTION 3: The Hero QR Code */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: { delay: 0.3, duration: 0.5 },
            }}
            className="relative mt-6"
          >
            {/* The "Aura" Effect: แสงสะท้อนนุ่มๆ ด้านหลัง */}
            <div className="from-primary-pink to-primary-orange absolute inset-0 -m-2 rounded-3xl bg-gradient-to-r opacity-50 blur-2xl" />

            <div className="relative rounded-2xl border-8 border-white bg-white p-2 shadow-xl shadow-black/10">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="UserId QR"
                  className="h-52 w-52 object-contain"
                  width={208}
                  height={208}
                />
              ) : (
                // Skeleton Loader ที่สวยงามพร้อม Shimmer Effect
                <div className="h-52 w-52 animate-pulse rounded-lg bg-gray-200" />
              )}
            </div>
          </motion.div>

          {/* SECTION 4: Redesigned Guidance Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
            className="mt-8 flex items-center gap-3 rounded-xl bg-blue-50 p-4 text-sm text-blue-700"
          >
            <Info size={20} className="shrink-0" />
            <p>ใช้สำหรับรับเงินจากผู้ใช้อื่นภายในแอปพลิเคชันเท่านั้น</p>
          </motion.div>

          {/* SECTION 5: Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.6 } }}
            className="mt-auto flex w-full gap-4 pt-6"
          >
            <button className="flex h-14 flex-grow items-center justify-center gap-2 rounded-xl bg-gray-200 text-gray-700 transition-transform active:scale-95">
              <Share2 size={20} />
              <span>แชร์</span>
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
