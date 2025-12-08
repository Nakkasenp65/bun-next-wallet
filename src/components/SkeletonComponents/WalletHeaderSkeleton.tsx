import Image from "next/image";

export default function WalletHeaderSkeleton() {
  return (
    <header
      className="relative z-10 flex items-center justify-between"
      aria-busy="true"
      aria-live="polite"
    >
      {/* Left: profile */}
      <div className="flex items-center justify-center gap-1.5">
        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200/25" />
        <div className="flex flex-col gap-1">
          <div className="h-3 w-10 animate-pulse rounded bg-gray-200/25" />
          <div className="h-3 w-20 animate-pulse rounded bg-gray-200/25" />
        </div>
      </div>

      {/* Center: app logo placeholder */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Image
          src="/okNumberOne.png"
          alt="1 Wallet Logo"
          className="h-12 w-12 shadow-sm"
          width={200}
          height={200}
          priority
        />
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 animate-pulse rounded bg-gray-200/25" />
        <div className="relative">
          <div className="h-7 w-7 animate-pulse rounded bg-gray-200/25" />
          <span className="absolute -top-1.5 -right-2 h-5 w-5 animate-pulse rounded-full bg-gray-300/25" />
        </div>
      </div>
    </header>
  );
}
