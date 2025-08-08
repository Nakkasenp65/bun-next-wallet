"use client";

import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Loading({ message }) {
  return (
    <div className="flex h-dvh flex-col items-center justify-center">
      <span className="animate-shining drop-shadow-primary-pink/50 from-primary-pink overflow-hidden bg-gradient-to-l via-purple-700 to-[#ff0073] bg-[length:200%_100%] bg-clip-text text-5xl font-bold whitespace-nowrap text-transparent drop-shadow-md">
        NO1Money+
      </span>
      {message && (
        <div className="animate-shining drop-shadow-primary-pink/50 from-primary-pink flex items-center gap-2 overflow-hidden bg-gradient-to-l via-purple-700 to-[#ff0073] bg-[length:200%_100%] bg-clip-text text-lg font-bold whitespace-nowrap text-transparent drop-shadow-md">
          {message}
          <AiOutlineLoading3Quarters className="text-primary-pink h-5 w-auto animate-spin" />
        </div>
      )}
    </div>
  );
}
