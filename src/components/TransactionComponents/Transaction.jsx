"use client";
import React, { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { MdArrowUpward, MdArrowDownward } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import StatusBadge from "./StatusBadge";
import { FaBan, FaReceipt } from "react-icons/fa6";
import { FaInfoCircle } from "react-icons/fa";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Ban,
  ChevronDown,
  Info,
  Receipt,
} from "lucide-react";

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

const getTransactionAppearance = (transaction) => {
  const baseStyles = {
    INCOME: {
      icon: <ArrowDownCircle size={20} />,
      bg: "bg-green-50",
      text: "text-green-600",
    },
    REWARD: {
      icon: <ArrowDownCircle size={20} />,
      bg: "bg-green-50",
      text: "text-green-600",
    },
    DEPOSIT: {
      icon: <ArrowDownCircle size={20} />,
      bg: "bg-green-50",
      text: "text-green-600",
    },
    OUTCOME: {
      icon: <ArrowUpCircle size={20} />,
      bg: "bg-red-50",
      text: "text-red-600",
    },
    WITHDRAW: {
      icon: <ArrowUpCircle size={20} />,
      bg: "bg-red-50",
      text: "text-red-600",
    },
  };

  const statusOverrides = {
    REJECTED: {
      icon: <Ban size={20} />,
      bg: "bg-gray-100",
      text: "text-gray-500",
    },
    CANCELLED: {
      icon: <Ban size={20} />,
      bg: "bg-gray-100",
      text: "text-gray-500",
    },
  };

  // ถ้ามี override สำหรับ status ปัจจุบัน, ให้ใช้ค่านั้น
  if (statusOverrides[transaction.status]) {
    return statusOverrides[transaction.status];
  }

  // มิเช่นนั้น, ใช้ style ตาม type ของ transaction
  return baseStyles[transaction.type] || baseStyles.OUTCOME;
};

const getMaskedAccountDisplay = (accountString) => {
  if (!accountString || !accountString.includes(" - ")) return accountString;
  const parts = accountString.split(" - ");
  const bankName = parts[0];
  const accountNumber = parts[1].trim();
  if (accountNumber.length <= 4) return accountString;
  const lastFourDigits = accountNumber.slice(-4);
  const maskedPart = "x".repeat(accountNumber.length - 4);
  return `${bankName} - ${maskedPart}${lastFourDigits}`;
};

export default function Transaction({ transaction }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isIncome = ["INCOME", "REWARD", "DEPOSIT"].includes(transaction.type);
  const appearance = getTransactionAppearance(transaction);

  const toDisplay = getMaskedAccountDisplay(transaction.to);
  const fromDisplay =
    transaction.fromWallet?.user?.line_display_name || transaction.from;

  const isPending = transaction.status === "PENDING";
  const isRejected = transaction.status === "REJECTED"; // <-- 2. เพิ่มตัวแปร isRejected

  const amount = isPending ? transaction.verifiedAmount : transaction.amount;
  const amountDisplay = amount ?? transaction.verifiedAmount;

  const getTransactionDisplayValue = (transaction) => {
    const formatableTypes = ["WITHDRAW", "DEPOSIT"];

    if (!formatableTypes.includes(transaction.type)) {
      return transaction.to;
    }

    const accountString = transaction.to;

    if (!accountString || !accountString.includes(" - ")) {
      return accountString;
    }

    const parts = accountString.split(" - ");
    const bankName = parts[0];
    const accountNumber = parts[1].trim();

    if (accountNumber.length <= 4) {
      return accountString;
    }

    const lastFourDigits = accountNumber.slice(-4);
    const maskedPart = "x".repeat(accountNumber.length - 4);

    return `${bankName} - ${maskedPart}${lastFourDigits}`;
  };

  const iconConfig = {
    INCOME: {
      icon: <MdArrowDownward />,
      bg: "bg-green-100",
      text: "text-green-600",
    },
    REWARD: {
      icon: <MdArrowDownward />,
      bg: "bg-green-100",
      text: "text-green-600",
    },
    OUTCOME: {
      icon: <MdArrowUpward />,
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
    const amount =
      transaction.status === "PENDING"
        ? transaction.verifiedAmount
        : transaction.amount;
    const amountToDisplay = amount ?? transaction.verifiedAmount;

    if (transaction.status === "REJECTED") {
      return <span className="text-sm font-bold text-red-500">ถูกปฏิเสธ</span>;
    }
    if (transaction.status === "PENDING") {
      return (
        <span className="text-sm font-medium text-gray-500">รอตรวจสอบ</span>
      );
    }
    if (amountToDisplay == null) {
      return <span className="text-sm font-medium text-gray-400">-</span>;
    }
    return (
      <span className={`font-bold ${appearance.text}`}>
        {isIncome ? "+" : "-"} ฿
        {amountToDisplay.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    );
  };

  return (
    <motion.li
      layout
      className="list-none border-b border-gray-100 last:border-b-0"
    >
      <div
        className="flex cursor-pointer items-center gap-4 px-2 py-4 transition-colors hover:bg-gray-50"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <div
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${appearance.bg} ${appearance.text}`}
        >
          {appearance.icon}
        </div>
        <div className="flex-grow">
          <p className="text-sm font-semibold text-gray-800">
            {transaction.name}
          </p>
          <p className="text-xs text-gray-500">
            {formatRelativeTime(transaction.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end">{renderAmount()}</div>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden px-4 pb-4"
          >
            <div className="space-y-3 rounded-lg bg-slate-50 p-4 text-sm ring-1 ring-slate-200/50">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">สถานะ</span>
                <StatusBadge status={transaction.status} />
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">จาก</span>
                <span className="text-right font-mono text-gray-800">
                  {fromDisplay}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">ไปยัง</span>
                <span className="text-right font-mono text-gray-800">
                  {toDisplay}
                </span>
              </div>

              {transaction.description && (
                <div className="flex items-start gap-2.5 rounded-md bg-blue-50/70 p-3 text-blue-800">
                  <Info size={16} className="mt-0.5 flex-shrink-0" />
                  <p className="text-xs whitespace-pre-wrap">
                    {transaction.description}
                  </p>
                </div>
              )}

              {transaction.slipImageUrl && (
                <a
                  href={transaction.slipImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-white py-2 font-semibold text-blue-600 shadow-sm ring-1 ring-gray-200 transition-all ring-inset hover:bg-blue-50 hover:shadow"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Receipt size={16} />
                  <span>ดูสลิป</span>
                </a>
              )}

              <div className="border-t border-gray-200 pt-2 text-center text-xs text-gray-400">
                ID: {transaction.id}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}
