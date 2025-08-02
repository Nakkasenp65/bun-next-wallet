"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IoIosArrowForward } from "react-icons/io";
import { MdAttachMoney, MdOutlineMoneyOffCsred } from "react-icons/md";

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
  const isReceived = transaction.type === "INCOME";
  const amountColor = isReceived ? "text-success-green" : "text-danger-red";
  const icon = isReceived ? (
    <MdAttachMoney className={incomeIcon} />
  ) : (
    <MdOutlineMoneyOffCsred className={outcomeIcon} />
  );

  return (
    <li className="border-divider list-none border-b last:border-b-0">
      {/* Transaction */}
      <div className="flex items-center py-4" onClick={() => setIsExpanded((prev) => !prev)}>
        {/* Details */}
        <div className="flex flex-shrink items-center gap-2">
          {/* Arrow Icon */}
          <IoIosArrowForward
            className={`text-gray-400 transition-transform ${isExpanded ? "rotate-90" : ""}`}
          />
          {/* Payment icon */}
          <div
            className={`flex items-center justify-center rounded-full bg-gray-100 p-2 drop-shadow-md drop-shadow-black/15 ${amountColor}`}
          >
            {icon}
          </div>
          {/* title and time */}
          <div className="flex w-24 flex-col">
            <div className="w-32 text-sm font-semibold text-gray-800">{transaction.name}</div>
            <div className="text-xs text-gray-500">{formatRelativeTime(transaction.createdAt)}</div>
          </div>
        </div>

        {/* Amount */}
        <div className="w-full grow text-right font-bold">
          {transaction.amount != null ? (
            <span className={amountColor}>฿{transaction.amount.toLocaleString()}</span>
          ) : (
            <span className="text-gray-500">กำลังตรวจสอบ</span>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-96 pb-4 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="grid grid-cols-1 gap-1 rounded-lg bg-gray-100 p-3 text-sm">
          <li className="flex items-center justify-between">
            <span className="font-bold text-gray-600">จาก</span>
            <span className="text-gray-800">{transaction.from}</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="font-bold text-gray-600">ไปยัง</span>
            <span className="text-gray-800">{transaction.to}</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="font-bold text-gray-600">สถานะ</span>
            <span
              className={`rounded-lg p-1 px-2 text-[12px] font-bold text-white ${transaction.status === "SUCCESS" ? "bg-green-500" : "bg-amber-500"}`}
            >
              {transaction.status}
            </span>
          </li>
          <li className="mt-2 flex flex-col">
            <span className="text-[12px] text-gray-500">เลขที่รายการ: {transaction.id}</span>
          </li>
        </ul>
      </div>
    </li>
  );
}
