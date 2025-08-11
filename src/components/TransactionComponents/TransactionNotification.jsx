"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // For smooth expansion
import clsx from "clsx"; // For cleaner class names

export default function TransactionNotification({ notification, onClick }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // This function now correctly handles the click event
  const handleItemClick = () => {
    // Always call the mark as read function on any click
    onClick();
    // Only toggle expansion if there are details to show
    if (notification.transaction) {
      setIsExpanded(!isExpanded);
    }
  };

  // --- 1. Correctly access the nested transaction object ---
  const transactionDetails = notification.transaction;

  // --- 2. Determine the icon and color based on the TRANSACTION's type ---
  //    Default to a neutral state if type is missing
  const isIncome =
    transactionDetails?.type === "INCOME" ||
    transactionDetails?.type === "REWARD";
  const icon = isIncome ? faArrowDown : faArrowUp;
  const iconColor = isIncome
    ? "text-green-500 bg-green-100"
    : "text-red-500 bg-red-100";

  // --- 3. Use the NOTIFICATION's data for the main display ---
  const title = notification.title;
  const body = notification.body;
  const isRead = notification.isRead;
  const createdAt = notification.createdAt;

  return (
    <li
      onClick={handleItemClick}
      className={clsx(
        "relative cursor-pointer overflow-hidden rounded-lg p-3 transition-colors hover:bg-gray-100",
        !isRead && "bg-pink-50",
      )}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={clsx(
            "mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-base",
            iconColor,
          )}
        >
          <FontAwesomeIcon icon={icon} />
        </div>

        {/* Main Content */}
        <div className="flex-grow">
          <p className="font-bold text-gray-800">{title}</p>
          <p className="text-sm text-gray-600">{body}</p>
          <p className="mt-1 text-xs text-gray-400">
            {new Date(createdAt).toLocaleString("th-TH", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </p>
        </div>

        {/* Unread Dot & Chevron */}
        <div className="flex flex-col items-center gap-2 pt-1">
          {!isRead && (
            <div className="bg-primary-pink h-2.5 w-2.5 rounded-full" />
          )}
          {/* Show chevron only if there are details to expand */}
          {transactionDetails && (
            <FontAwesomeIcon
              icon={faChevronDown}
              className={clsx(
                "text-gray-400 transition-transform",
                isExpanded && "rotate-180",
              )}
            />
          )}
        </div>
      </div>

      {/* Expanded Details using Framer Motion */}
      <AnimatePresence>
        {isExpanded && transactionDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: "12px" }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden border-t pt-3 pl-12 text-sm text-gray-700"
          >
            <h4 className="mb-2 font-bold text-gray-500">รายละเอียดธุรกรรม:</h4>
            <div className="space-y-1">
              <p>
                <strong>สถานะ:</strong> {transactionDetails.status}
              </p>
              <p>
                <strong>จำนวนเงิน:</strong>{" "}
                {transactionDetails.amount?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}{" "}
                บาท
              </p>
              <p>
                <strong>จาก:</strong> {transactionDetails.from}
              </p>
              <p>
                <strong>ถึง:</strong> {transactionDetails.to}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
