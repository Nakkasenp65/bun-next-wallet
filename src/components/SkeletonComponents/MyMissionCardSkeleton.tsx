import React from "react";
import clsx from "clsx";

export default function MyMissionCardSkeleton() {
  return (
    <div
      // ใช้ animate-pulse เพื่อสร้าง effect การ "กระพริบ" ที่บ่งบอกว่ากำลังโหลด
      className={clsx(
        `to-gay-500 flex w-full flex-shrink-0 animate-pulse snap-start flex-col gap-1 rounded-4xl bg-gradient-to-br from-gray-300 p-4 px-6 text-white`,
      )}
    >
      {/* Header Skeleton */}
      <div className="flex items-center gap-3">
        {/* Placeholder for Icon */}
        <div className="h-10 w-10 rounded-full bg-gray-200/50"></div>
        {/* Placeholder for Title */}
        <div className="h-5 w-3/4 rounded-md bg-gray-200/50"></div>
      </div>

      {/* Progress Bar & Status Skeleton */}
      <div className="my-2">
        <div className="flex justify-between">
          {/* Placeholder for "ความคืบหน้า" text */}
          <div className="h-3 w-16 rounded-md bg-gray-200/50"></div>
          {/* Placeholder for progress numbers */}
          <div className="h-3 w-12 rounded-md bg-gray-200/50"></div>
        </div>
        {/* Placeholder for Progress Bar */}
        <div className="mt-1 h-2 w-full rounded-full bg-gray-300/50"></div>
      </div>

      {/* Time Left Skeleton */}
      <div className="flex items-center gap-2">
        {/* Placeholder for Timer Icon */}
        <div className="h-3 w-3 rounded-full bg-gray-200/50"></div>
        {/* Placeholder for Timer Text */}
        <div className="h-3 w-1/2 rounded-md bg-gray-200/50"></div>
      </div>

      {/* Footer: Reward & CTA Skeleton */}
      <div className="mt-auto flex items-end justify-between gap-4 pt-2">
        <div className="flex flex-col items-start gap-1">
          {/* Placeholder for "รางวัล" text */}
          <div className="h-3 w-10 rounded-md bg-gray-200/50"></div>
          {/* Placeholder for Reward Amount */}
          <div className="h-6 w-14 rounded-md bg-gray-200/50"></div>
        </div>
        {/* Placeholder for CTA Button */}
        <div className="h-10 w-32 rounded-xl bg-gray-200/50"></div>
      </div>
    </div>
  );
}
