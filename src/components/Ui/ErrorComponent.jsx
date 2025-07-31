"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

export default function ErrorComponent({
  title = "เกิดข้อผิดพลาด",
  message = "ไม่สามารถโหลดข้อมูลได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง",
  showRetryButton = true,
}) {
  const router = useRouter();

  // Function to refresh the page
  const handleRetry = () => {
    router.refresh();
  };

  return (
    // Main container with the same theme as your app's dark background
    <div className="gradient-background flex h-dvh w-full flex-col items-center justify-center p-6 text-center">
      {/* Icon: Using a vibrant, attention-grabbing color from your theme */}
      <div className="mb-6">
        <FontAwesomeIcon
          icon={faTriangleExclamation}
          className="text-danger-red text-6xl opacity-80 drop-shadow-[0_0_15px_rgba(255,77,109,0.5)]"
        />
      </div>

      {/* Title Text: Styled to stand out but fit the theme */}
      <h1 className="text-light-text text-2xl font-bold drop-shadow-md">{title}</h1>

      {/* Message Text: A softer, secondary color for the description */}
      <p className="text-secondary-text mt-2 max-w-sm">{message}</p>

      {/* Retry Button: Conditionally rendered */}
      {showRetryButton && (
        <div className="mt-8 w-full max-w-xs">
          {/* We reuse the CtaButton but can override its style for an error-specific look if needed */}
          <button
            onClick={handleRetry}
            className="border-secondary-text/50 text-bg-dark hover:border-light-text hover:text-light-text bg-secondary-text flex w-full items-center justify-center gap-2 rounded-xl border-2 p-3 font-bold transition-all hover:bg-white/10"
          >
            <FontAwesomeIcon icon={faRotateRight} />
            <span>ลองใหม่อีกครั้ง</span>
          </button>
        </div>
      )}
    </div>
  );
}
