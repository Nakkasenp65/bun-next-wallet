"use client";

import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import FramerDiv from "../framerComponents/FramerDiv";
import NotificationTab from "../NotificationComponents/NotificationTab";
import { useUser } from "@/hooks/userHook";
import Loading from "../StatusComponents/Loading";
import ErrorComponent from "../Ui/ErrorComponent";
import { useNotification } from "@/hooks/useNotification";
import { clearNotificationsMutation } from "@/hooks/useNotification";

export default function NotificationPage({ userId, showNotifications, setShowNotifications }) {
  const [activeTab, setActiveTab] = useState("transactions");
  const { data: userData, isLoading: isUserLoading, error: userError } = useUser(userId);
  const {
    data: notificationData,
    isLoading: notificationLoading,
    error: notificationError,
  } = useNotification(userData);
  // --- Event Handlers ---
  const handleNotificationClick = (notification) => {
    if (!notification.isRead && userData?.id) {
      markAsReadMutation.mutate({
        notificationId: notificationData.id,
        userMongoId: userData.id, // <-- Use the internal MongoDB ID here
      });
    }
  };

  const handleClear = () => {
    if (window.confirm(`Are you sure you want to clear all ${activeTab} notifications?`)) {
      clearNotificationsMutation.mutate(activeTab);
    }
  };

  const filteredNotifications = React.useMemo(() => {
    if (!notificationData) return []; // Return empty array if notifications haven't loaded

    if (activeTab === "transactions") {
      // The "Transactions" tab should show SENT and RECEIVE types.
      return notificationData.filter((n) => n.type === "SENT" || n.type === "RECEIVE");
    }
    if (activeTab === "promos") {
      // The "Promos" tab should show SYSTEM and REWARD types.
      return notificationData.filter((n) => n.type === "SYSTEM" || n.type === "REWARD");
    }
    return []; // Fallback
  }, [notificationData, activeTab]);

  const isLoading = isUserLoading || notificationLoading;
  const error = userError || notificationError;

  if (isLoading)
    return (
      <div className="bg-bg-dark fixed inset-0 z-50 flex items-center justify-center">
        <Loading />
      </div>
    );

  if (error)
    return (
      <div className="fixed inset-0 z-50">
        <ErrorComponent message={error.message} />
      </div>
    );

  return (
    <FramerDiv
      isOpen={showNotifications}
      id="notifications-overlay"
      className="bg-bg-dark/80 fixed inset-0 z-40 flex flex-col backdrop-blur-sm"
    >
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
        <div className="w-6"></div>
      </header>
      <div className="flex flex-grow flex-col overflow-y-auto rounded-t-[30px] bg-white">
        <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 px-4">
          {/* Tabs */}
          <div className="flex flex-shrink-0 grow border-b border-gray-200 px-4">
            <button
              className={`flex-1 py-4 text-center font-bold transition-colors ${
                activeTab === "transactions"
                  ? "border-primary-pink text-primary-pink border-b-2"
                  : "hover:text-primary-pink text-gray-500"
              } `}
              onClick={() => setActiveTab("transactions")} /* ... */
            >
              ธุรกรรม
            </button>
            <button
              className={`flex-1 py-4 text-center font-bold transition-colors ${
                activeTab === "promos"
                  ? "border-primary-pink text-primary-pink border-b-2"
                  : "hover:text-primary-pink text-gray-500"
              }`}
              onClick={() => setActiveTab("promos")} /* ... */
            >
              โปรโมชั่นและข่าวสาร
            </button>
          </div>
          {/* Clear Button */}
          <button
            onClick={handleClear}
            disabled={clearNotificationsMutation.isPending}
            className="hover:text-danger-red text-sm font-bold text-gray-500 disabled:opacity-50"
          >
            {clearNotificationsMutation.isPending ? "Clearing..." : "Clear All"}
          </button>
        </div>
        <div className="p-4">
          <NotificationTab
            activeTab={activeTab}
            notifications={filteredNotifications} // <-- PASS THE FILTERED DATA
            onNotificationClick={handleNotificationClick}
          />
        </div>
      </div>
    </FramerDiv>
  );
}
