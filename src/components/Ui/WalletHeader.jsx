"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MdLock } from "react-icons/md";
import { FiBell } from "react-icons/fi";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import Image from "next/image";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "สวัสดีตอนเช้า,";
  if (hour >= 12 && hour < 18) return "สวัสดีตอนบ่าย,";
  return "สวัสดีตอนเย็น,";
};

export default function WalletHeader({
  userName,
  setShowNotifications,
  profileUrl,
  notifications,
}) {
  const greeting = getGreeting();
  const unreadNotifications =
    notifications?.filter((notification) => !notification.isRead).length || 0;
  // const unreadNotifications = 9;

  return (
    <header className="relative z-10 flex items-center justify-between">
      {/* Welcome Text */}
      <div className="flex items-center justify-center gap-2">
        <img
          src={profileUrl}
          width={50}
          height={50}
          alt="profile image"
          className="border-primary-pink shadow-neon-pink-sm h-8 w-8 rounded-full border-2 object-cover"
        />
        <div className="flex flex-col">
          <div className="text-secondary-text text-x -mb-1">สวัสดี</div>
          <div className="from-vibrant-purple to-primary-pink inline-block bg-gradient-to-r bg-clip-text text-sm font-bold text-transparent text-shadow-lg">
            {userName}
          </div>
        </div>
      </div>

      {/* App Logo (Centered) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Image
          src="/okNumberOne.png"
          alt="1 Wallet Logo"
          className="h-9 w-9 shadow-sm"
          width={100}
          height={100}
        />
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-1">
        {/* Lock Icon: Notification */}
        <div
          id="lock-btn"
          className="text-secondary-text hover:text-primary-pink cursor-pointer text-2xl transition"
        >
          <MdLock className="h-auto w-6" />
        </div>
        {/* Bell Icon: Notification */}
        <div
          onClick={() => setShowNotifications(true)}
          href={"/notification"}
          id="notification-bell-btn"
          className="text-secondary-text hover:text-primary-pink relative cursor-pointer text-2xl transition"
        >
          <FiBell className="h-auto w-6" />
          {unreadNotifications > 0 && (
            <>
              <span className="bg-danger-red animate-pulseUp absolute -top-1.5 -right-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-none text-[12px] font-bold text-white shadow-lg" />
              <span className="bg-danger-red absolute -top-1.5 -right-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-none text-[12px] font-bold text-white shadow-lg">
                <p className="absolute">{unreadNotifications}</p>
              </span>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
