"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faArrowUpFromBracket, faArrowDown } from "@fortawesome/free-solid-svg-icons";

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

  const isReceived = transaction.type === "INCOME"; // true if received
  const amountColor = isReceived ? "text-success-green" : "text-danger-red";
  const amountSign = isReceived ? "+" : "-";
  const icon = isReceived ? faArrowDown : faArrowUpFromBracket;

  return (
    <li className="border-divider list-none border-b last:border-b-0">
      {/* Main Info Row */}
      <div className="flex gap-4 items-center py-4" onClick={() => setIsExpanded(!isExpanded)}>
        <FontAwesomeIcon
          icon={faChevronRight}
          className={` text-xs text-gray-400 transition-transform ${isExpanded ? "rotate-90" : ""}`}
        />

        {/* icon */}
        <div
          className={` flex h-11 w-11  items-center justify-center rounded-full bg-gray-100 text-xl drop-shadow-md drop-shadow-black/15 ${amountColor}`}
        >
          <FontAwesomeIcon icon={icon} />
        </div>

        {/* Time stamp */}
        <div className=" ">
          <div className="font-bold text-gray-800 w-32">{transaction.name}</div>
          <div className="text-sm text-gray-500">{formatRelativeTime(transaction.createdAt)}</div>
        </div>
        <div className={` w-max font-bold grow ${amountColor}`}>
          {amountSign}฿{transaction.amount.toLocaleString()}
        </div>
      </div>

      {/* Expanded Details */}
      <div
        className={`overflow-hidden px-4 pl-8 transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-96 pb-4 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="grid grid-cols-1 gap-1 rounded-lg bg-gray-50 p-3 text-sm">
          <li className="flex justify-between items-center">
            <span className="text-gray-600 font-bold">จาก:</span>
            <span className=" text-gray-800">{transaction.from}</span>
          </li>
          <li className="flex justify-between items-center">
            <span className="text-gray-600 font-bold">ไปยัง:</span>
            <span className=" text-gray-800">{transaction.to}</span>
          </li>
          <li className="flex justify-between items-center">
            <span className="text-gray-600 font-bold">สถานะ:</span>
            <span
              className={`text-xs font-bold ${transaction.status === "SUCCESS" ? "text-green-500" : "text-amber-500"}`}
            >
              {transaction.status}
            </span>
          </li>
          <li className="flex flex-col mt-2">
            <span className="text-gray-500 text-xs ">เลขที่รายการ: {transaction.id}</span>
          </li>
        </ul>
      </div>
    </li>
  );
}
