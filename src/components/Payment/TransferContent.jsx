"use client";
import React, { useState } from "react";
import { FaChevronDown, FaRegCopy } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

export default function TransferContent() {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("209-3-12208-1");
    alert("คัดลอกเลขบัญชีแล้ว!"); // In a real app, use a toast notification
  };

  return (
    <div className="flex flex-col gap-2 p-4 pt-6">
      <h2 className="text-xl font-bold text-gray-800">
        <span className="text-red-500">โอนเงิน</span>ผ่านบัญชีธนาคาร
      </h2>
      <p className="mt-1 text-sm text-gray-500">โอนเงินเข้าบัญชีธนาคารที่ระบุ และแนบหลักฐานการโอนเงิน</p>

      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
        <div className="mb-3 sm:mb-4">
          <div className="flex items-center gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-gray-200">
            <Image
              src={"/kbank-logo.png"}
              alt="KBank"
              width={100}
              height={100}
              className="rounded-full border border-gray-200 p-1 bg-white w-10 h-10 sm:w-12 sm:h-12"
            />
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">ธนาคารกสิกรไทย</h3>
              <p className="mt-1 text-lg text-gray-800">
                <span className="font-semibold">ชื่อบัญชี:</span> นัมเบอร์วันมันนี่
              </p>
            </div>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-gray-100 border border-gray-200 rounded-lg p-3 sm:p-4 flex flex-row items-center justify-center gap-3">
            <span className="text-md sm:text-2xl font-bold text-bg-dark">209-3-12208-1</span>
            <button className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm transition-all flex items-center gap-1 sm:gap-2 bg-primary-pink text-white">
              <FaRegCopy />
              คัดลอกเลขบัญชี
            </button>
          </div>
        </div>
      </div>

      {/* Accordion Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-4 flex w-full items-center justify-center gap-2 text-sm font-semibold text-gray-600"
      >
        <FaChevronDown className={`transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
        <span>แสดงขั้นตอน</span>
      </button>

      {/* Accordion Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 text-xs sm:text-sm text-gray-600">
              <ol className="list-decimal list-inside space-y-1 sm:space-y-2 pl-2">
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

      <div className="border-t border-gray-200 pt-4 sm:pt-6">
        <p className="text-center text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 flex items-center justify-center gap-1 sm:gap-2">
          หากชำระเงินเรียบร้อยแล้ว โปรดแนบสลิปเพื่อยืนยัน
        </p>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 sm:p-6 text-center cursor-pointer hover:border-[var(--color-theme-primary)] hover:bg-rose-50 transition-all">
          <p className="text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
            คลิก หรือ ลากไฟล์สลิปมาวางที่นี่
          </p>
          <p className="text-xs sm:text-sm text-gray-500">รองรับ: JPG, PNG, GIF (สูงสุด 5MB)</p>
          <input accept="image/jpeg,image/png,image/gif" className="hidden" type="file" />
        </div>
        <button
          disabled=""
          className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-[var(--color-theme-primary)] to-[var(--color-theme-secondary)] text-white px-4 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base shadow hover:shadow-lg transition-all disabled:from-gray-400 disabled:to-gray-400 disabled:shadow-none disabled:cursor-not-allowed disabled:text-bg-dark"
        >
          ยืนยันการชำระเงิน
        </button>
      </div>
    </div>
  );
}
