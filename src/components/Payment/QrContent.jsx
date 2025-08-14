"use client";
import Image from "next/image";
import React, { useState } from "react";
import { IoIosWarning } from "react-icons/io";
import { FaDownload } from "react-icons/fa";
import { useLiff } from "../provider/LiffProvider";

export default function QrContent({ amount = 0 }) {
  const qrCodeUrl = `https://no-1-genqrcodepromptpay.vercel.app/api/?amount=${encodeURIComponent(
    amount,
  )}`;
  const [saving, setSaving] = useState(false);
  const { actions } = useLiff();
  const handleSave = async () => {
    try {
      actions.openWindow(
        "https://no-1-genqrcodepromptpay.vercel.app/api/?amount=0",
        true,
      );
      setSaving(true);
      // Try to fetch the image and download as a file
      const res = await fetch(qrCodeUrl, { cache: "no-store" });
      if (!res.ok) throw new Error("QR fetch failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `promptpay-qr-${amount || 0}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      // Fallback: open in new tab if cross-origin download is blocked
      window.open(qrCodeUrl, "_blank", "noopener,noreferrer");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="py-6 text-center">
      <div className="mx-auto flex w-full items-center justify-center gap-2 rounded-t-xl bg-[#0e3d67] px-4 py-3 text-white">
        <Image
          src="/PromptPay1.jpg"
          alt="Thai QR Payment"
          className="h-8 w-auto"
          width={100}
          height={100}
        />
      </div>

      <div>
        <div className="mx-4 mt-6 flex items-center gap-2 rounded-xl border border-red-300 bg-red-50 p-2 text-start text-xs text-red-700">
          <IoIosWarning size={150} className="h-6 text-red-500" />
          <p>
            <b>คำเตือน:</b> กรุณาโอนเงินตามยอดที่แสดงและ<b>แนบสลิป</b>{" "}
            เพื่อยืนยันการชำระ <b>หลีกเลี่ยง</b> การชำระช่วงเวลา 23:00 - 01:00
          </p>
        </div>

        <div className="relative mt-6 inline-block rounded-lg border-4 border-white p-2 shadow-xl">
          <img src={qrCodeUrl} alt="QR Code" className="h-64 w-64" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={"/okNumberOne.png"}
              alt="oknumberone logo"
              width={48}
              height={48}
              className="w-1/6"
            />
          </div>
        </div>

        {/* Save button */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary-pink mx-4 mt-2 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
          >
            {saving ? "กำลังบันทึก..." : "บันทึกรูป QR"}
            <FaDownload />
          </button>
        </div>
      </div>
    </div>
  );
}
