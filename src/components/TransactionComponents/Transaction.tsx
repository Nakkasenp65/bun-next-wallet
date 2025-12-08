"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Ban,
  CheckCircle,
  ChevronDown,
  Gift,
  Info,
  Receipt,
} from "lucide-react";
import StatusBadge from "./StatusBadge"; // Make sure this path is correct
import SlipModal from "./SlipModal";

// --- UTILITY: Formats date string into a relative time like "5 นาทีที่แล้ว" ---
const formatRelativeTime = (dateString) => {
  if (!dateString) return "";
  const timestamp = new Date(dateString).getTime();
  if (isNaN(timestamp)) return "";

  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 1) return "เมื่อสักครู่";
  if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
  const days = Math.floor(hours / 24);
  return `${days} วันที่แล้ว`;
};

// --- UTILITY: Masks sensitive bank account numbers in a specific format ---
const getMaskedDisplayValue = (transaction, field) => {
  const { type, status, fromWallet } = transaction;
  const rawValue = transaction[field];

  const applyMask = (accountNumber) => {
    const digitsOnly = String(accountNumber).replace(/\D/g, "");
    if (digitsOnly.length < 5) return "xxxx";
    const revealedPart = digitsOnly.slice(-5, -1);
    const prefixLength = Math.max(0, digitsOnly.length - 5);
    const maskedPrefix = "x".repeat(prefixLength);
    return `${maskedPrefix}(${revealedPart}-)x`;
  };

  if (type === "WITHDRAW" && field === "to") {
    if (!rawValue || !rawValue.includes(" - ")) return rawValue;
    const [bankName, accountNumber] = rawValue.split(" - ", 2);
    return `${bankName} - ${applyMask(accountNumber)}`;
  }

  if (type === "DEPOSIT" && field === "from") {
    if (status === "SUCCESS") {
      if (!rawValue || !rawValue.includes(" - ")) return rawValue;
      const [bankName, accountNumber] = rawValue.split(" - ", 2);
      return `${bankName} - ${applyMask(accountNumber)}`;
    }
    return fromWallet?.user?.line_display_name || rawValue || "ไม่ระบุ";
  }

  return rawValue;
};

// --- CORE LOGIC: The Contextual Transaction Storyteller ---
// Determines the display context (income/outcome, name, appearance) from the user's perspective.
const getTransactionContext = (transaction, currentWalletId) => {
  const { type, status, fromWalletId, toWalletId, name, from, to } =
    transaction;

  let isIncome = false;
  let displayName = name;
  let baseAppearance;

  // Handle TRANSFER type first, as it's the most contextual
  if (type === "TRANSFER") {
    if (toWalletId === currentWalletId) {
      isIncome = true;
      displayName = `จาก: ${from}`;
      baseAppearance = {
        icon: <ArrowDownCircle size={20} />,
        bg: "bg-green-50",
        text: "text-green-600",
      };
    } else {
      isIncome = false;
      displayName = `ถึง: ${to}`;
      baseAppearance = {
        icon: <ArrowUpCircle size={20} />,
        bg: "bg-red-50",
        text: "text-red-600",
      };
    }
  } else {
    // Handle all other standard types
    const standardIncomeTypes = ["INCOME", "REWARD", "DEPOSIT"];
    isIncome = standardIncomeTypes.includes(type);

    const appearanceMap = {
      INCOME: {
        icon: <ArrowDownCircle size={20} />,
        bg: "bg-green-50",
        text: "text-green-600",
      },
      REWARD: {
        icon: <Gift size={20} />,
        bg: "bg-violet-50",
        text: "text-violet-600",
      },
      REDEEMED: {
        icon: <CheckCircle size={20} />,
        bg: "bg-yellow-50",
        text: "text-yellow-600",
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
    baseAppearance = appearanceMap[type] || appearanceMap.OUTCOME;
  }

  // Apply status overrides at the end
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

  const finalAppearance = statusOverrides[status] || baseAppearance;

  return { isIncome, displayName, appearance: finalAppearance };
};

  // --- COMPONENT: The main Transaction item UI ---
export default function Transaction({ transaction, currentWalletId }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSlipModalOpen, setIsSlipModalOpen] = useState(false);

  // All display logic is now derived from our new "brain"
  const { isIncome, displayName, appearance } = getTransactionContext(
    transaction,
    currentWalletId,
  );

  // Masking is still needed for the detail view
  const toDisplay = getMaskedDisplayValue(transaction, "to");
  const fromDisplay = getMaskedDisplayValue(transaction, "from");

  const renderAmount = () => {
    const amount =
      transaction.status === "PENDING"
        ? transaction.verifiedAmount
        : transaction.amount;
    const amountToDisplay = amount ?? transaction.verifiedAmount;

    if (["REJECTED", "CANCELLED"].includes(transaction.status)) {
      return (
        <span className="text-sm font-bold text-red-500">ถูกปฏิเสธ/ยกเลิก</span>
      );
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
    <>
      <motion.div
        layout="position"
        className="list-none border-b border-gray-100 last:border-b-0"
        transition={{
          layout: { duration: 0.2, ease: "easeOut" },
        }}
      >
        <motion.div
          className="flex cursor-pointer items-center gap-1 py-4 transition-colors"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          <div
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${appearance.bg} ${appearance.text}`}
          >
            {appearance.icon}
          </div>
          <div className="flex-grow">
            <p className="text-sm font-semibold text-gray-800">{displayName}</p>
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
        </motion.div>

        <AnimatePresence mode="sync">
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{
                opacity: 1,
                height: "auto",
                marginBottom: 16,
                transition: {
                  height: { duration: 0.2, ease: "easeOut" },
                  opacity: { duration: 0.15, delay: 0.05 },
                },
              }}
              exit={{
                opacity: 0,
                height: 0,
                marginBottom: 0,
                transition: {
                  height: { duration: 0.2, ease: "easeIn" },
                  opacity: { duration: 0.1 },
                },
              }}
              className="overflow-hidden px-2"
            >
              <div className="space-y-3 rounded-lg bg-slate-50 p-4 text-sm ring-1 ring-slate-200/50">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">ประเภท</span>
                  <span className="font-semibold">{transaction.name}</span>
                </div>
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsSlipModalOpen(true);
                    }}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-white py-2 font-semibold text-blue-600 shadow-sm ring-1 ring-gray-200 transition-all ring-inset hover:bg-blue-50 hover:shadow"
                  >
                    <Receipt size={16} />
                    <span>ดูสลิป</span>
                  </button>
                )}

                <div className="border-t border-gray-200 pt-2 text-center text-xs text-gray-400">
                  ID: {transaction.id}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <SlipModal
        isOpen={isSlipModalOpen}
        onClose={() => setIsSlipModalOpen(false)}
        imageUrl={transaction.slipImageUrl}
      />
    </>
  );
}
