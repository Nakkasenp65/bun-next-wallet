"use client";

import clsx from "clsx";
import React from "react";

export default function PromoNotification({
  promo,
  displayIcon: IconComponent,
  onClick,
}) {
  // ตรวจสอบให้แน่ใจว่า promo object มีอยู่จริงก่อนที่จะ render
  if (!promo) {
    return null;
  }

  // แปลง createdAt (ISO string) ให้เป็นเวลาที่อ่านง่าย
  // ในแอปจริง อาจจะใช้ library อย่าง date-fns เพื่อความสามารถที่มากขึ้น
  const formattedTime = new Date(promo.createdAt).toLocaleString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <li
      onClick={onClick}
      className={clsx(
        "relative flex cursor-pointer items-start gap-4 rounded-lg p-3 transition-colors hover:bg-gray-100",
        !promo.isRead && "bg-pink-50", // ใช้ isRead เพื่อกำหนดพื้นหลัง
      )}
    >
      {/* Icon */}
      <div className="bg-vibrant-purple/20 text-vibrant-purple mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xl">
        {/* Render ไอคอนที่ถูกส่งเข้ามาผ่าน props */}
        {IconComponent && <IconComponent />}
      </div>

      {/* Content */}
      <div className="flex-grow">
        <p className="font-bold text-gray-800">{promo.title}</p>
        <p className="text-sm text-gray-600">{promo.body}</p>
        <p className="mt-1 text-xs text-gray-400">{formattedTime}</p>
      </div>

      {/* Unread Indicator */}
      {!promo.isRead && (
        <div className="bg-primary-pink absolute top-3 right-3 h-2.5 w-2.5 rounded-full shadow-md"></div>
      )}
    </li>
  );
}
