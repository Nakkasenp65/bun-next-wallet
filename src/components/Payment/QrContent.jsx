"use client";
import React from "react";
import { FaDownload, FaFolderOpen, FaMobileAlt, FaImage } from "react-icons/fa";

export default function QrContent() {
  return (
    <div className="p-4 pt-6 text-center">
      <div className="mx-auto flex w-max items-center gap-2 rounded-lg bg-blue-800 px-4 py-2 text-white">
        <img
          src="https://www.thaqrcode.com/assets/images/logo/thai-qr-payment.png"
          alt="Thai QR Payment"
          className="h-6"
        />
        <span className="font-bold">THAI QR PAYMENT</span>
      </div>

      <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        <p className="font-bold">
          <i className="fa-solid fa-triangle-exclamation mr-2"></i>คำเตือน:
          กรุณาโอนเงินตามยอดที่แสดงและแนบสลิปเพื่อยืนยันการชำระ
        </p>
        <p>หลีกเลี่ยงการชำระช่วงเวลา 23:00 - 01:00</p>
      </div>

      <div className="relative mt-6 inline-block rounded-lg border-4 border-white p-2 shadow-2xl">
        <img
          src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=PROMPTPAY_1234567890_1770.00"
          alt="QR Code"
          className="h-64 w-64"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-2xl font-bold text-white shadow-lg">
            1+
          </div>
        </div>
      </div>

      <p className="mt-6 font-bold text-gray-800">ขั้นตอนการชำระด้วย QR CODE</p>
      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
        <div className="flex flex-col items-center gap-1">
          <FaDownload className="text-2xl" />
          <span>บันทึกรูป</span>
        </div>
        <span>›</span>
        <div className="flex flex-col items-center gap-1">
          <FaFolderOpen className="text-2xl" />
          <span>เปิดแอปจ่ายเงิน</span>
        </div>
        <span>›</span>
        <div className="flex flex-col items-center gap-1">
          <FaMobileAlt className="text-2xl" />
          <span>กดเมนูสแกน</span>
        </div>
        <span>›</span>
        <div className="flex flex-col items-center gap-1">
          <FaImage className="text-2xl" />
          <span>เลือกรูป QR</span>
        </div>
      </div>
    </div>
  );
}
