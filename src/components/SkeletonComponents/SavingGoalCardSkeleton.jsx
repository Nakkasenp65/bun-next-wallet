"use client";
import React from "react";

// ⬇️ add this alongside your existing SavingsGoalCard component
export default function SavingsGoalCardSkeleton() {
  return (
    <div
      className="flex animate-pulse items-center gap-4 rounded-2xl bg-white/25 p-4 shadow-lg backdrop-blur-sm"
      aria-busy="true"
    >
      {/* Image placeholder */}
      <div className="bg-gray-300/ h-16 w-16 shrink-0 rounded-xl" />

      {/* Text / progress placeholders */}
      <div className="flex-1 space-y-2">
        <div className="h-3 w-24 rounded bg-gray-200/25" />
        <div className="h-4 w-40 rounded bg-gray-200/25" />
        <div className="h-3 w-28 rounded bg-gray-200/25" />

        {/* Progress bar placeholder */}
        <div className="mt-3 h-2 w-full rounded-full bg-gray-200/25" />

        {/* CTA row placeholder */}
        <div className="mt-3 flex items-center gap-2">
          <div className="h-9 w-24 rounded-xl bg-gray-200/25" />
          <div className="h-9 w-20 rounded-xl bg-gray-200/25" />
        </div>
      </div>
    </div>
  );
}
