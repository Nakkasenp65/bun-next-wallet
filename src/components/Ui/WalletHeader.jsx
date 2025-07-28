"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import Image from "next/image";
import Link from "next/link";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "สวัสดีตอนเช้า,";
  if (hour >= 12 && hour < 18) return "สวัสดีตอนบ่าย,";
  return "สวัสดีตอนเย็น,";
};

export default function WalletHeader({ userName, setShowNotifications, profileUrl, notifications }) {
  const greeting = getGreeting();
  const unreadNotifications = notifications?.filter((notification) => !notification.isRead).length || 0;

  return (
    <header className="relative z-10 flex items-center justify-between">
      {/* Welcome Text */}
      <div>
        <div className="text-secondary-text text-[0.9rem]">{greeting}</div>
        <div className="from-vibrant-purple to-primary-pink inline-block bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent text-shadow-lg">
          {userName}
        </div>
      </div>

      {/* App Logo (Centered) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Image src="/okNumberOne.png" alt="1 Wallet Logo" className="h-11 w-11  shadow-sm" width={100} height={100} />
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-1">
        <div id="lock-btn" className="text-secondary-text hover:text-primary-pink  cursor-pointer text-2xl transition">
          <FontAwesomeIcon icon={faLock} />
        </div>
        <div
          onClick={() => setShowNotifications(true)}
          href={"/notification"}
          id="notification-bell-btn"
          className="text-secondary-text hover:text-primary-pink relative cursor-pointer text-2xl transition mr-2"
        >
          <FontAwesomeIcon icon={faBell} />
          {unreadNotifications > 0 && (
            <>
              <span className="border-bg-dark bg-danger-red animate-pulseUp absolute -top-1.5 -right-2 flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs font-bold text-white shadow-lg" />
              <span className="border-bg-dark bg-danger-red absolute -top-1.5 -right-2 flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs font-bold text-white shadow-lg">
                <p className="absolute">{unreadNotifications}</p>
              </span>
            </>
          )}
        </div>
        <Link href={"/"}>
          <img
            src={profileUrl}
            width={50}
            height={50}
            alt="profile image"
            className="border-primary-pink shadow-neon-pink  h-7 w-7 rounded-full border-2 object-cover"
          />
        </Link>
      </div>
    </header>
  );
}
