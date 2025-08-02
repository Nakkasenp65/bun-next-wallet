"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser"; // 1. Import useUser hook
import CtaButton from "@/components/Ui/CtaButton";
import Loading from "@/components/StatusComponents/Loading";

export default function MyQr() {
  const router = useRouter();
  const { data: userData, isLoading, error } = useUser("U5d2998909721fdea596f8e9e91e7bf85");

  const handleClose = () => {
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="bg-bg-dark flex h-dvh w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-bg-dark flex h-screen items-center justify-center text-red-500">
        <p>Error loading user data: {error.message}</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="bg-bg-dark flex h-screen items-center justify-center text-yellow-400">
        <p>Could not find user data.</p>
      </div>
    );
  }

  const qrCodeData = `PROMPTPAY_1234567890_${userData.username}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeData)}`;

  return (
    <div
      id="my-qr-overlay"
      className="bg-bg-dark/80 fixed inset-0 z-40 flex flex-col backdrop-blur-sm"
    >
      {/* Page Header */}
      <header className="flex flex-shrink-0 items-center border-b border-white/20 px-5 pt-10 pb-4">
        <button
          onClick={handleClose}
          className="text-secondary-text text-2xl transition-colors hover:text-white"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <h2 className="from-primary-pink to-primary-orange flex-grow bg-gradient-to-r bg-clip-text text-center text-xl font-bold text-transparent">
          QR ของฉัน
        </h2>
        <div className="w-6"></div> {/* Spacer */}
      </header>

      {/* Page Content */}
      <div className="flex flex-grow flex-col items-center justify-center gap-5 overflow-y-auto rounded-t-[30px] bg-white p-6 text-center">
        {/* 3. ใช้ชื่อผู้ใช้จาก userData */}
        <h2 className="text-bg-dark text-2xl font-bold">{userData.username}</h2>
        <p className="text-base text-gray-500">รับเงินผ่าน QR Code</p>

        {/* QR Code Display */}
        <div
          className="h-48 w-48 rounded-lg border-8 border-white bg-cover bg-center shadow-md"
          style={{ backgroundImage: `url(${qrCodeUrl})` }}
        ></div>

        <p className="text-sm text-gray-600">แสดง QR นี้ให้เพื่อนเพื่อรับเงิน</p>

        {/* Close Button */}
        <div className="mt-auto w-full pt-6">
          <CtaButton onClick={handleClose}>ปิด</CtaButton>
        </div>
      </div>
    </div>
  );
}
