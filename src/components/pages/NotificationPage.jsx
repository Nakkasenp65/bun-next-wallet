"use client";

import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import FramerDiv from "../framerComponents/FramerDiv";
import NotificationTab from "../NotificationComponents/NotificationTab";

export default function NotificationPage({ notifications, showNotifications, setShowNotifications }) {
  const [activeTab, setActiveTab] = useState("transactions");

  return (
    <FramerDiv
      isOpen={showNotifications}
      id="notifications-overlay"
      className="bg-bg-dark/80 fixed inset-0 z-40 flex flex-col backdrop-blur-sm"
    >
      {/* Page Header */}
      <header className="flex flex-shrink-0 items-center border-b border-white/20 px-5 pt-10 pb-4">
        <button
          onClick={() => setShowNotifications(false)}
          className="text-secondary-text text-2xl transition-colors hover:text-white"
        >
          <IoIosArrowBack className="text-3xl" />
        </button>
        <h2 className="from-primary-pink to-primary-orange flex-grow bg-gradient-to-r bg-clip-text text-center text-xl font-bold text-transparent">
          การแจ้งเตือน
        </h2>
        <div className="w-6"></div> {/* Spacer */}
      </header>

      {/* Page Content */}
      <div className="flex flex-grow flex-col overflow-y-auto rounded-t-[30px] bg-white">
        {/* Notification Tabs */}
        <div className="flex flex-shrink-0 border-b border-gray-200 px-4">
          <button
            onClick={() => setActiveTab("transactions")}
            className={`flex-1 py-4 text-center font-bold transition-colors  ${
              activeTab === "transactions"
                ? "border-primary-pink text-primary-pink border-b-2"
                : "hover:text-primary-pink text-gray-500"
            } `}
          >
            ธุรกรรม
          </button>
          <button
            onClick={() => setActiveTab("promos")}
            className={`flex-1 py-4 text-center font-bold transition-colors ${
              activeTab === "promos"
                ? "border-primary-pink text-primary-pink border-b-2"
                : "hover:text-primary-pink text-gray-500"
            }`}
          >
            โปรโมชั่นและข่าวสาร
          </button>
        </div>

        <div className="p-4">
          <NotificationTab activeTab={activeTab} notifications={notifications} />
        </div>
      </div>
    </FramerDiv>
  );
}
