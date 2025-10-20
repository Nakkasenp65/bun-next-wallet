"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { Trash2 } from "lucide-react";
import clsx from "clsx";

export default function PromoNotification({
  promo,
  displayIcon: IconComponent,
  onClick,
  onDelete,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [swipeX, setSwipeX] = useState(0);

  // Ensure the promo object exists before rendering
  if (!promo) {
    return null;
  }

  // This handler marks the item as read and toggles the expansion
  const handleItemClick = () => {
    // Only handle read/expand if not swiped
    if (swipeX === 0) {
      // Always call the provided onClick (likely to mark as read)
      if (onClick) {
        onClick();
      }
      // Only toggle expansion if there is a body to show
      if (promo.body) {
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

  const formattedTime = new Date(promo.createdAt).toLocaleString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

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
          !promo.isRead ? "bg-pink-50" : "bg-white hover:bg-gray-50",
        )}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={clsx(
              "mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xl transition-all",
              !promo.isRead
                ? "bg-vibrant-purple/30 text-vibrant-purple ring-vibrant-purple/20 ring-2"
                : "bg-vibrant-purple/10 text-vibrant-purple/60",
            )}
          >
            {IconComponent && <IconComponent />}
          </div>

          {/* Main Content (Title and Time) */}
          <div className="flex-grow">
            <p
              className={clsx(
                "transition-all",
                !promo.isRead
                  ? "font-bold text-gray-900"
                  : "font-semibold text-gray-600",
              )}
            >
              {promo.title}
            </p>
            <p className="mt-1 text-xs text-gray-400">{formattedTime}</p>
          </div>

          {/* Right Side: Unread Dot, Chevron, Delete Button */}
          <div className="flex flex-shrink-0 items-center gap-3">
            {/* Unread Indicator */}
            {!promo.isRead && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-primary-pink h-2.5 w-2.5 rounded-full shadow-sm"
              />
            )}

            {/* Chevron (only if there's body content) */}
            {promo.body && (
              <FontAwesomeIcon
                icon={faChevronDown}
                className={clsx(
                  "text-sm text-gray-400 transition-transform",
                  isExpanded && "rotate-180",
                )}
              />
            )}

            {/* Delete Button (visible on desktop hover or always on mobile) */}
            <button
              onClick={handleDelete}
              className="group rounded-full p-1.5 transition-all hover:bg-red-50 md:opacity-0 md:group-hover:opacity-100"
              aria-label="ลบการแจ้งเตือน"
            >
              <Trash2 className="h-4 w-4 text-gray-400 transition-colors group-hover:text-red-600" />
            </button>
          </div>
        </div>

        {/* Expanded Details (The Promo Body) */}
        <AnimatePresence>
          {isExpanded && promo.body && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: "12px" }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="overflow-hidden border-t border-gray-200 pt-3 pl-14 text-sm text-gray-700"
            >
              <p className="whitespace-pre-wrap">{promo.body}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </li>
  );
}
