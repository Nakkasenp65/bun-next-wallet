"use client";

export default function Loading({ message }) {
  return (
    <div className="absolute flex flex-col items-center">
      <span className="animate-shining drop-shadow-primary-pink/50 from-primary-pink overflow-hidden bg-gradient-to-l via-purple-700 to-[#ff0073] bg-[length:200%_100%] bg-clip-text text-4xl font-bold whitespace-nowrap text-transparent drop-shadow-md">
        NO1Money+
      </span>
      {message && (
        <div className="animate-shining drop-shadow-primary-pink/50 from-primary-pink overflow-hidden bg-gradient-to-l via-purple-700 to-[#ff0073] bg-[length:200%_100%] bg-clip-text text-lg font-bold whitespace-nowrap text-transparent drop-shadow-md">
          {message}
        </div>
      )}
    </div>
  );
}
