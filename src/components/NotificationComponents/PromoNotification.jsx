"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";

export default function PromoNotification({
  promo,
  displayIcon: IconComponent,
  onClick,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Ensure the promo object exists before rendering
  if (!promo) {
    return null;
  }

  // This handler marks the item as read and toggles the expansion
  const handleItemClick = () => {
    // Always call the provided onClick (likely to mark as read)
    if (onClick) {
      onClick();
    }
    // Only toggle expansion if there is a body to show
    if (promo.body) {
      setIsExpanded(!isExpanded);
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
    <li
      onClick={handleItemClick}
      className={clsx(
        "relative cursor-pointer overflow-hidden rounded-lg p-3 transition-colors hover:bg-gray-100",
        !promo.isRead && "bg-pink-50",
      )}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="bg-vibrant-purple/20 text-vibrant-purple mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xl">
          {IconComponent && <IconComponent />}
        </div>

        {/* Main Content (Title and Time) */}
        <div className="flex-grow">
          <p className="font-bold text-gray-800">{promo.title}</p>
          <p className="mt-1 text-xs text-gray-400">{formattedTime}</p>
        </div>

        {/* Unread Dot & Chevron */}
        <div className="flex flex-col items-center gap-2 pt-1">
          {!promo.isRead && (
            <div className="bg-primary-pink h-2.5 w-2.5 rounded-full" />
          )}
          {/* Show chevron only if there is a body to expand */}
          {promo.body && (
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

      {/* Expanded Details (The Promo Body) */}
      <AnimatePresence>
        {isExpanded && promo.body && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: "12px" }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden border-t pt-3 pl-12 text-sm text-gray-600"
          >
            {/* The whitespace-pre-wrap is great for respecting newlines in the promo body */}
            <p className="whitespace-pre-wrap">{promo.body}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
