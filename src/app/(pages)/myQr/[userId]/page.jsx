"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faDownload } from "@fortawesome/free-solid-svg-icons";
import { useParams, useRouter } from "next/navigation";
import QRCode from "qrcode";
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
    <div className="bg-bg-dark/80 fixed inset-0 z-40 flex flex-col backdrop-blur-sm">
      {/* Header */}
      <header className="flex items-center px-5 pt-10 pb-4">
        <button
          onClick={handleClose}
          className="text-secondary-text text-2xl transition-colors hover:text-white"
          aria-label="Back"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <h2 className="from-primary-pink to-primary-orange flex-grow bg-gradient-to-r bg-clip-text text-center text-xl font-bold text-transparent">
          QR ของฉัน
        </h2>
        <div className="w-6" />
      </header>

      {/* Content */}
      <div className="flex flex-grow flex-col items-center justify-center gap-5 overflow-y-auto rounded-t-[30px] bg-white p-6 text-center">
        <p className="text-base text-gray-500">รับเงินผ่าน QR Code</p>

        {/* QR image (local) */}
        <div className="rounded-lg border-8 border-white bg-white p-2 shadow-md">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="UserId QR"
              className="h-48 w-48 object-contain"
              width={200}
              height={200}
            />
          ) : (
            <div className="grid h-48 w-48 place-items-center text-gray-400">
              กำลังสร้าง QR…
            </div>
          )}
        </div>

        {/* Download button */}
        <button
          onClick={handleDownload}
          disabled={!qrDataUrl}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-5 font-medium text-white disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faDownload} />
          บันทึก QR
        </button>

        {/* Close */}
        <button
          onClick={handleClose}
          className="mt-auto w-full rounded-xl border px-4 py-3"
        >
          ปิด
        </button>
      </div>
    </div>
  );
}
