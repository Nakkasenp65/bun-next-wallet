"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // For smooth expansion
import { Trash2 } from "lucide-react";
import clsx from "clsx"; // For cleaner class names

export default function TransactionNotification({
  notification,
  onClick,
  onDelete,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [swipeX, setSwipeX] = useState(0);

  // This function now correctly handles the click event
  const handleItemClick = () => {
    // Only handle read/expand if not swiped
    if (swipeX === 0) {
      // Always call the mark as read function on any click
      onClick();
      // Only toggle expansion if there are details to show
      if (notification.transaction) {
        setIsExpanded(!isExpanded);
      }
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete();
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
  const iconColorUnread = isIncome
    ? "text-green-600 bg-green-200 ring-2 ring-green-300/50"
    : "text-red-600 bg-red-200 ring-2 ring-red-300/50";

  // --- 3. Use the NOTIFICATION's data for the main display ---
  const title = notification.title;
  const body = notification.body;
  const isRead = notification.isRead;
  const createdAt = notification.createdAt;

  return (
    <li className="relative overflow-hidden rounded-lg">
      {/* Delete Button Background (Revealed on Swipe) */}
      <div className="absolute inset-y-0 right-0 flex w-20 items-center justify-center bg-red-500">
        <Trash2 className="h-5 w-5 text-white" />
      </div>

      {/* Swipeable Content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -80, right: 0 }}
        dragElastic={0.1}
        onDragEnd={(e, { offset }) => {
          if (offset.x < -40) {
            setSwipeX(-80);
          } else {
            setSwipeX(0);
          }
        }}
        animate={{ x: swipeX }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={handleItemClick}
        className={clsx(
          "relative cursor-pointer rounded-lg p-3 transition-colors",
          !isRead ? "bg-pink-50" : "bg-white hover:bg-gray-50",
        )}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={clsx(
              "mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-base transition-all",
              !isRead ? iconColorUnread : iconColor,
            )}
          >
            <FontAwesomeIcon icon={icon} />
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            <p
              className={clsx(
                "transition-all",
                !isRead
                  ? "font-bold text-gray-900"
                  : "font-semibold text-gray-600",
              )}
            >
              {title}
            </p>
            <p
              className={clsx(
                "text-sm transition-all",
                !isRead ? "text-gray-700" : "text-gray-500",
              )}
            >
              {body}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              {new Date(createdAt).toLocaleString("th-TH", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </p>
          </div>

          {/* Right Side: Unread Dot, Chevron, Delete Button */}
          <div className="flex flex-shrink-0 items-center gap-3">
            {/* Unread Indicator */}
            {!isRead && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-primary-pink h-2.5 w-2.5 rounded-full shadow-sm"
              />
            )}

            {/* Chevron (only if there are transaction details) */}
            {transactionDetails && (
              <FontAwesomeIcon
                icon={faChevronDown}
                className={clsx(
                  "text-sm text-gray-400 transition-transform",
                  isExpanded && "rotate-180",
                )}
              />
            )}

            {/* Delete Button */}
            <button
              onClick={handleDelete}
              className="group rounded-full p-1.5 transition-all hover:bg-red-50 md:opacity-0 md:group-hover:opacity-100"
              aria-label="ลบการแจ้งเตือน"
            >
              <Trash2 className="h-4 w-4 text-gray-400 transition-colors group-hover:text-red-600" />
            </button>
          </div>
        </div>

        {/* Expanded Details using Framer Motion */}
        <AnimatePresence>
          {isExpanded && transactionDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: "12px" }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="overflow-hidden border-t border-gray-200 pt-3 pl-14 text-sm text-gray-700"
            >
              <h4 className="mb-2 font-bold text-gray-500">
                รายละเอียดธุรกรรม:
              </h4>
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
      </motion.div>
    </li>
  );
}
