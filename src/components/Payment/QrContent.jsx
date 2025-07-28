"use client";
import Image from "next/image";
import React from "react";
import { IoIosWarning } from "react-icons/io";
import { FaDownload, FaFolderOpen, FaMobileAlt, FaImage } from "react-icons/fa";

export default function QrContent({ amount }) {
  const displayAmount = parseFloat(amount) > 0 ? parseFloat(amount).toFixed(2) : "0.00";
  const qrCodeUrl = `https://no-1-genqrcodepromptpay.vercel.app/api/?amount=${displayAmount}`;
  return (
    <div className="p-4 text-center">
      <div className="mx-auto flex w-full items-center justify-center gap-2 rounded-t-xl bg-[#0e3d67] px-4 py-3 text-white">
        <Image src="/PromptPay1.jpg" alt="Thai QR Payment" className="w-auto h-8" width={100} height={100} />
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 rounded-xl border border-red-300 bg-red-50 p-2 text-xs text-start  text-red-700">
          <IoIosWarning size={150} className="text-red-500 h-6" />
          <p>
            <b>คำเตือน:</b> กรุณาโอนเงินตามยอดที่แสดงและ<b>แนบสลิป</b>เพื่อยืนยันการชำระ <b>หลีกเลี่ยง</b>
            การชำระช่วงเวลา 23:00 - 01:00
          </p>
        </div>

        <div className="relative mt-6 inline-block rounded-lg border-4 border-white p-2 shadow-2xl">
          <img src={qrCodeUrl} alt="QR Code" className="h-64 w-64" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Image src={"/okNumberOne.png"} alt="oknumberone logo" width={48} height={48} className="w-1/6" />
          </div>
        </div>
      </div>
    </div>
  );
}
