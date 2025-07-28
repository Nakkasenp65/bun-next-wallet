"use client";
import React, { useState } from "react";
import {
  FaCreditCard,
  FaEllipsisH,
  FaQrcode,
  FaUniversity,
  FaExclamationTriangle,
  FaCommentDots,
} from "react-icons/fa";
import { SiPromis, SiSpacex } from "react-icons/si";
import clsx from "clsx";
import TransferContent from "@/components/Payment/TransferContent";
import QrContent from "@/components/Payment/QrContent";
import OtherMethodsContent from "@/components/Payment/OtherMethodsContent";
import Image from "next/image";

// A small sub-component for the tab buttons
const TabButton = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={clsx(
      "flex flex-1 items-center justify-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-bold transition-all duration-300",
      isActive
        ? "border-b-2 border-red-500 text-red-500"
        : "border-b-2 border-transparent text-gray-500 hover:bg-gray-100"
    )}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default function PaymentPage() {
  const [activeTab, setActiveTab] = useState("transfer");

  const tabs = [
    { id: "transfer", label: "โอนเงิน", icon: <FaUniversity /> },
    { id: "promptpay", label: "พร้อมเพย์", icon: <FaQrcode /> },
    { id: "spaylater", label: "SPayLater", icon: <SiSpacex /> },
    { id: "creditcard", label: "บัตรเครดิต", icon: <FaCreditCard /> },
    { id: "other", label: "อื่นๆ", icon: <FaEllipsisH /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="relative mx-auto max-w-md bg-white shadow-lg">
        {/* Header */}
        <header className="sticky flex items-center justify-center top-0 z-20 bg-white bg-gradient-to-br from-purple-950 to-pink-900 p-4 text-center text-white shadow-md gap-1">
          <Image
            width={100}
            height={100}
            src="/okNumberOne.png"
            alt="NO1 Payments"
            className="w-8 h-8 object-contain"
          />{" "}
          <p className="from-primary-pink to-primary-orange  bg-gradient-to-r bg-clip-text text-center text-xl font-bold text-transparent">
            เติมเงิน (ฝากเงิน)
          </p>
          {/* Replace with your logo URL */}
        </header>

        <main className="flex flex-col p-4 gap-2">
          {/* Main Title */}
          <div className="flex justify-center items-center gap-2  ">
            <FaUniversity color="#f36" size={24} className="animate-bounce" />
            <h1 className="text-xl font-bold text-[#f36]">เลือกช่องทางการชำระเงิน</h1>
          </div>

          {/* Warning Message */}
          <div className="mt-4 flex items-start gap-3 rounded-lg bg-yellow-50 p-3 text-yellow-800">
            <FaExclamationTriangle className="mt-1 flex-shrink-0 text-yellow-500" />
            <p className="text-[12px]">
              <span className="font-bold">ข้อแนะนำ:</span> โปรดหลีกเลี่ยงการชำระเงินช่วงเวลา{" "}
              <span className="font-bold text-red-600">00:00 - 01:00น.</span>{" "}
              เพื่อป้องกันข้อผิดพลาดช่วงเวลาธนาคารปิดปรับปรุงระบบ
            </p>
          </div>

          {/* Tabs */}
          <div className="noscrollbar -mx-4 mt-4 flex overflow-x-auto border-b border-gray-200">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                icon={tab.icon}
                label={tab.label}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </div>

          {/* Tab Content */}
          <div className="-mx-4 bg-gray-50">
            {activeTab === "transfer" && <TransferContent />}
            {activeTab === "promptpay" && <QrContent />}
            {activeTab === "other" && <OtherMethodsContent />}
            {/* Add placeholders for other tabs */}
            {(activeTab === "spaylater" || activeTab === "creditcard") && (
              <div className="p-16 text-center text-gray-400">
                <p>ช่องทางนี้ยังไม่เปิดให้บริการ</p>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="p-4 text-center text-xs text-gray-400">
          <p>© 2025 สงวนลิขสิทธิ์โดย NO1Money+. All Rights Reserved.</p>
          <div className="mt-2">
            <a href="#" className="hover:underline">
              ข้อกำหนดและเงื่อนไขการให้บริการ
            </a>
            <span className="mx-2">|</span>
            <a href="#" className="hover:underline">
              นโยบายความเป็นส่วนตัว
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
