"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faPhone, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FaPhone } from "react-icons/fa";
import { FaLine } from "react-icons/fa";
// import { useLiff } from "../provider/LiffProvider";

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);
  // const { isInLiffClient, openWindow } = useLiff();

  const handleLineClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const lineUrl = "https://line.me/R/oaMessage/@okmobile/ติดต่อสอบถามการชำระเงิน";

    //   if (isInLiffClient && openWindow) {
    //     try {
    //       openWindow(lineUrl, false);
    //     } catch (error) {
    //       window.open(lineUrl, "_blank");
    //     }
    //   } else {
    //     window.open(lineUrl, "_blank");
    //   }
    //   setIsOpen(false);
  };

  const handleMainButtonClick = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed right-4 bottom-20 z-[9999] sm:right-6 sm:bottom-8">
      {/* Options */}
      <div
        className={`absolute right-0 bottom-16 flex flex-col gap-3 transition-all duration-200 sm:bottom-20 ${
          isOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        {/* LINE Option */}
        <button
          onClick={handleLineClick}
          className="flex min-w-[140px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 px-4 py-3 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:from-green-600 hover:to-green-700 hover:shadow-xl sm:min-w-24 sm:py-2"
        >
          <FaLine className="p-1 text-lg" />
          <span>LINE</span>
        </button>

        {/* Phone Option */}
        <a
          href="tel:0627766774"
          className="flex min-w-[140px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 px-4 py-3 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:from-gray-600 hover:to-gray-700 hover:shadow-xl sm:min-w-24 sm:py-2"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }}
        >
          <FaPhone className="p-1 text-lg" />
          <span>โทร</span>
        </a>
      </div>

      {/* Main Button */}
      <button
        onClick={handleMainButtonClick}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[var(--color-theme-primary)] to-[var(--color-theme-secondary)] text-white shadow-lg transition-all duration-200 hover:shadow-lg sm:h-12 sm:w-12"
        aria-label={isOpen ? "ปิดเมนูติดต่อ" : "เปิดเมนูติดต่อ"}
      >
        <FontAwesomeIcon icon={isOpen ? faTimes : faCommentDots} className="fa-icon p-2 text-xl sm:text-2xl" />
        {!isOpen && <span className="bg-opacity-20 absolute inset-0 animate-ping rounded-full bg-white opacity-0 hover:opacity-100"></span>}
      </button>
    </div>
  );
}
