"use client";
import React from "react";
import { MdLock } from "react-icons/md";
import { FiBell } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { useLockApp } from "@/hooks/useUser";
import { motion } from "framer-motion";

export function WalletHeaderSkeleton() {
  return (
    <header
      className="relative z-10 flex items-center justify-between"
      aria-busy="true"
      aria-live="polite"
    >
      {/* Left: profile */}
      <div className="flex items-center justify-center gap-1.5">
        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
        <div className="flex flex-col gap-1">
          <div className="h-3 w-10 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
        </div>
      </div>

      {/* Center: app logo placeholder */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-12 w-12 animate-pulse rounded-xl bg-gray-200 shadow-sm" />
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 animate-pulse rounded bg-gray-200" />
        <div className="relative">
          <div className="h-7 w-7 animate-pulse rounded bg-gray-200" />
          <span className="absolute -top-1.5 -right-2 h-5 w-5 animate-pulse rounded-full bg-gray-300" />
        </div>
      </div>
    </header>
  );
}

export default function WalletHeader({
  userLineId,
  userName,
  setShowNotifications,
  profileUrl,
  notifications,
}) {
  const unreadNotifications =
    notifications?.filter((n) => !n.isRead).length || 0;

  const { mutate: lock, isPending } = useLockApp(userLineId);

  const handleLockClick = () => {
    if (userLineId && !isPending) {
      lock(userLineId);
    }
  };

  return (
    <motion.header
      className="relative z-10 flex items-center justify-between"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Welcome Text */}
      <Link href={`/profile/${userLineId}`}>
        <div className="flex items-center justify-center gap-1.5">
          <Image
            src={profileUrl}
            width={50}
            height={50}
            alt="profile image"
            className="border-primary-pink shadow-neon-pink-sm h-10 w-auto rounded-full border-2 object-cover"
          />
          <div className="flex flex-col">
            <div className="text-secondary-text text-xs">สวัสดี</div>
            <div className="text-[10px]">{userName}</div>
          </div>
        </div>
      </Link>

      {/* App Logo (Centered) */}
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

      {/* Header Actions */}
      <div className="flex items-center gap-2">
        {/* Lock Icon */}
        <button
          id="lock-btn"
          onClick={handleLockClick}
          className="text-secondary-text cursor-pointer text-2xl transition"
          aria-label="Lock app"
        >
          <MdLock className="h-auto w-7" />
        </button>

        {/* Bell Icon: Notification */}
        <button
          onClick={() => setShowNotifications(true)}
          id="notification-bell-btn"
          className="text-secondary-text hover:text-primary-pink relative cursor-pointer text-2xl transition"
          aria-label="Open notifications"
        >
          <FiBell className="h-auto w-7" />
          {unreadNotifications > 0 && (
            <>
              <span className="bg-danger-red animate-pulseUp absolute -top-1.5 -right-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-none text-[12px] font-bold text-white shadow-lg" />
              <span className="bg-danger-red absolute -top-1.5 -right-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-none text-[12px] font-bold text-white shadow-lg">
                <p className="absolute">{unreadNotifications}</p>
              </span>
            </>
          )}
        </button>
      </div>
    </motion.header>
  );
}
