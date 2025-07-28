"use client";
import React, { useState } from "react";
import { FaChevronDown, FaRegCopy } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import toast from "react-hot-toast";

// It only needs the amount for display purposes
export default function TransferContent({ amount }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("209-3-12208-1");
    toast.success("คัดลอกไปยังคลิปบอร์ดแล้ว!");
  };

  // The amount to display, defaulting to 0.00 if none is entered yet
  const displayAmount = parseFloat(amount) > 0 ? parseFloat(amount).toFixed(2) : "0.00";

  return (
    <div className="py-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
          <Image src={"/kbank-logo.png"} alt="KBank" width={40} height={40} />
          <div>
            <h3 className="font-bold text-gray-800">ธนาคารกสิกรไทย</h3>
            <p className="text-sm text-gray-700">ชื่อบัญชี: นัมเบอร์วันมันนี่</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-gray-100 p-2">
          <span className="font-bold tracking-wider text-bg-dark">209-3-12208-1</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-lg bg-primary-pink px-2 py-2 text-xs text-white transition hover:bg-pink-700"
          >
            <FaRegCopy />
            คัดลอก
          </button>
        </div>
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-4 flex w-full items-center justify-center gap-2 text-sm font-semibold text-gray-600"
      >
        <FaChevronDown className={`transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
        <span>แสดงขั้นตอน</span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div /* ... */ className="overflow-hidden">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
              <ol className="list-inside list-decimal space-y-2 pl-2">
                <li>เปิดแอปพลิเคชันธนาคาร</li>
                <li>เลือกเมนู "โอนเงิน"</li>
                <li>เลือกธนาคารปลายทาง "กสิกรไทย"</li>
                <li>กรอกเลขที่บัญชี: 209-3-12208-1</li>
                <li>ระบุจำนวนเงิน: 1,770.00 บาท</li>
                <li>ตรวจสอบข้อมูลผู้รับ และยืนยันการโอน</li>
                <li>บันทึกสลิปการโอนเงิน</li>
                <li>กลับมาที่หน้านี้เพื่อแนบหลักฐาน</li>
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
