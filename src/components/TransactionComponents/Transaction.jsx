"use client";
import React, { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { MdArrowUpward, MdArrowDownward } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import StatusBadge from "./StatusBadge";
import { FaBan, FaReceipt } from "react-icons/fa6";
import { FaInfoCircle } from "react-icons/fa";

const incomeIcon = "text-green-500 w-6 h-auto ";
const outcomeIcon = "text-red-500 w-6 h-auto ";

const formatRelativeTime = (dateString) => {
  const timestamp = new Date(dateString).getTime();

  if (isNaN(timestamp)) {
    return "";
  }

  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 1) return "เมื่อสักครู่";
  if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
  const days = Math.floor(hours / 24);
  return `${days} วันที่แล้ว`;
};

export default function Transaction({ transaction }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // --- 1. กำหนดค่าต่างๆ ตามประเภทและสถานะ ---
  const isIncome =
    transaction.type === "INCOME" || transaction.type === "REWARD";
  const isPending = transaction.status === "PENDING";
  const isRejected = transaction.status === "REJECTED"; // <-- 2. เพิ่มตัวแปร isRejected

  const amount = isPending ? transaction.verifiedAmount : transaction.amount;
  const amountDisplay = amount ?? transaction.verifiedAmount;

  const iconConfig = {
    INCOME: {
      icon: <MdArrowUpward />,
      bg: "bg-green-100",
      text: "text-green-600",
    },
    REWARD: {
      icon: <MdArrowUpward />,
      bg: "bg-green-100",
      text: "text-green-600",
    },
    OUTCOME: {
      icon: <MdArrowDownward />,
      bg: "bg-red-100",
      text: "text-red-600",
    },
  };

  // --- 3. สร้าง displayConfig เพื่อจัดการสถานะ REJECTED ---
  // เริ่มต้นด้วย config ปกติตามประเภท
  let displayConfig = iconConfig[transaction.type] || iconConfig.OUTCOME;

  // ถ้าสถานะเป็น REJECTED, ให้ override ค่า icon และสี
  if (isRejected) {
    displayConfig = {
      icon: <FaBan />, // ใช้ไอคอนกากบาท/แบน
      bg: "bg-gray-200", // ทำให้สีพื้นหลังดูจืดลง
      text: "text-gray-500", // ทำให้สีไอคอนดูจืดลง
    };
  }

  // --- 4. อัปเดตฟังก์ชันสำหรับแสดงผลจำนวนเงิน ---
  const renderAmount = () => {
    "";
    // ตรวจสอบสถานะ REJECTED ก่อนเป็นอันดับแรก
    if (isRejected) {
      return <span className="text-sm font-bold text-red-500">ถูกปฏิเสธ</span>;
    }
    if (isPending) {
      return (
        <span className="text-sm font-medium text-gray-500">รอตรวจสอบ</span>
      );
    }
    if (amountDisplay === null || amountDisplay === undefined) {
      return <span className="text-sm font-medium text-gray-400">-</span>;
    }
    return (
      <span className={`font-bold ${displayConfig.text}`}>
        {isIncome ? "+" : "-"} ฿
        {amountDisplay.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    );
  };

  return (
    <li className="list-none border-b border-gray-100 last:border-b-0">
      {/* ส่วนหลักที่คลิกได้ */}
      <div
        className="flex cursor-pointer items-center gap-4 p-4 transition-colors hover:bg-gray-50"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        {/* --- 5. ใช้ displayConfig ที่นี่ --- */}
        <div
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${displayConfig.bg} ${displayConfig.text}`}
        >
          {displayConfig.icon}
        </div>
        <div className="flex-grow">
          <p className="font-semibold text-gray-800">{transaction.name}</p>
          <p className="text-xs text-gray-500">
            {formatRelativeTime(transaction.createdAt)}
          </p>
        </div>
        <div className="flex flex-col items-end">
          {renderAmount()}
          <IoIosArrowForward
            className={`text-gray-400 transition-transform ${isExpanded ? "rotate-90" : ""}`}
          />
        </div>
      </div>

      {/* ส่วนรายละเอียดที่ขยายได้ (ใช้ AnimatePresence) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden px-4 pb-4"
          >
            <div className="space-y-3 rounded-lg bg-gray-100 p-4 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">สถานะ</span>
                <StatusBadge status={transaction.status} />
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">จาก</span>
                <span className="text-right font-mono text-gray-800">
                  {transaction.from}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">ไปยัง</span>
                <span className="text-right font-mono text-gray-800">
                  {transaction.to}
                </span>
              </div>

              {transaction.description && (
                <div className="flex items-start gap-2 rounded-md bg-blue-50 p-2 text-blue-800">
                  <FaInfoCircle className="mt-0.5 flex-shrink-0" />
                  <p className="text-xs">{transaction.description}</p>
                </div>
              )}

              {transaction.slipImageUrl && (
                <a
                  href={transaction.slipImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-white py-2 font-semibold text-blue-600 shadow-sm transition-all hover:bg-blue-50 hover:shadow-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaReceipt />
                  <span>ดูสลิปการโอนเงิน</span>
                </a>
              )}

              <div className="border-t border-gray-200 pt-2 text-center text-xs text-gray-400">
                ID: {transaction.id}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
