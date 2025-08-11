"use client";
import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import FramerDiv from "../framerComponents/FramerDiv";
import NotificationTab from "../NotificationComponents/NotificationTab";
// 1. Import the corrected hooks
import {
  useMarkNotificationAsRead,
  useClearNotifications,
} from "@/hooks/useNotification";

export default function NotificationPage({
  showNotifications,
  setShowNotifications,
  userData,
}) {
  const [activeTab, setActiveTab] = useState("transactions");

  // The notification data is derived directly from the userData prop
  const notificationData = userData?.notifications || [];

  const markAsReadMutation = useMarkNotificationAsRead();
  const clearNotificationsMutation = useClearNotifications();

  const handleNotificationClick = (notification) => {
    if (!notification.isRead && userData?.id) {
      markAsReadMutation.mutate({
        notificationId: notification.id,
        userId: userData.id, // Pass line_user_id for the onSuccess callback
      });
    }
  };

  const handleClear = () => {
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการล้างการแจ้งเตือนทั้งหมด?`)) {
      // Define what types each tab represents for the backend
      const typeToClear = activeTab === "transactions" ? "WALLET" : "PROMO"; // e.g., PROMO could clear SYSTEM and REWARD
      console.log("Current tab: ", activeTab);
      clearNotificationsMutation.mutate({
        type: typeToClear,
        userId: userData.id, // Pass line_user_id for the onSuccess callback
      });
    }
  };

  // Your filtering logic is correct based on your schema
  const filteredNotifications = React.useMemo(() => {
    if (activeTab === "transactions") {
      return notificationData.filter((n) => n.type === "WALLET");
    }
    if (activeTab === "promos") {
      return notificationData.filter(
        (n) => n.type === "SYSTEM" || n.type === "REWARD",
      );
    }
    return [];
  }, [notificationData, activeTab]);

  return (
    <FramerDiv
      isOpen={showNotifications}
      id="notifications-overlay"
      className="bg-bg-dark/80 fixed inset-0 z-40 flex flex-col backdrop-blur-sm"
    >
      <header className="flex flex-shrink-0 items-center px-5 pt-10 pb-4">
        <button
          onClick={() => setShowNotifications(false)}
          className="text-secondary-text text-2xl transition-colors hover:text-white"
        >
          <IoIosArrowBack className="text-3xl" />
        </button>
        <h2 className="from-primary-pink to-primary-orange flex-grow bg-gradient-to-r bg-clip-text text-center text-xl font-bold text-transparent">
          การแจ้งเตือน
        </h2>
        <div className="w-6"></div>
      </header>
      <div className="flex flex-grow flex-col overflow-y-auto rounded-t-[30px] bg-white">
        <div className="flex flex-shrink-0 items-center justify-between px-4">
          {/* Tabs */}
          <div className="flex flex-shrink-0 grow pr-4">
            <button
              className={`flex-1 py-4 text-center font-bold transition-colors ${
                activeTab === "transactions"
                  ? "border-primary-pink text-primary-pink border-b-2"
                  : "hover:text-primary-pink text-gray-500"
              }`}
              onClick={() => setActiveTab("transactions")}
            >
              ธุรกรรม
            </button>
            <button
              className={`flex-1 py-4 text-center font-bold transition-colors ${
                activeTab === "promos"
                  ? "border-primary-pink text-primary-pink border-b-2"
                  : "hover:text-primary-pink text-gray-500"
              }`}
              onClick={() => setActiveTab("promos")}
            >
              โปรโมชั่นและข่าวสาร
            </button>
          </div>
          {/* Clear Button */}
          <button
            onClick={handleClear}
            disabled={
              clearNotificationsMutation.isPending ||
              filteredNotifications.length === 0
            }
            className="hover:text-danger-red text-sm font-bold text-gray-500 disabled:opacity-50 disabled:hover:text-gray-500"
          >
            {clearNotificationsMutation.isPending
              ? "กำลังล้าง..."
              : "ล้างทั้งหมด"}
          </button>
        </div>
        <div className="p-4">
          {/* The NotificationTab component doesn't need to change */}
          <NotificationTab
            notifications={filteredNotifications}
            onNotificationClick={handleNotificationClick}
          />
        </div>
      </div>
    </FramerDiv>
  );
}
