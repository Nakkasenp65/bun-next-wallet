"use client";
import React, { useState } from "react";
import { ChevronLeft, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import FramerDiv from "../framerComponents/FramerDiv"; // --- Restoring your custom component ---
import NotificationTab from "../NotificationComponents/NotificationTab";
import {
  useMarkNotificationAsRead,
  useClearNotifications,
} from "@/hooks/useNotification";
import ConfirmationModal from "../NotificationComponents/ConfirmationModal";

export default function NotificationPage({
  showNotifications,
  setShowNotifications,
  userId = "",
  notificationData,
  notificationLoading,
}) {
  const [activeTab, setActiveTab] = useState("transactions");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const clearNotificationsMutation = useClearNotifications();
  const markAsReadMutation = useMarkNotificationAsRead();

  const handleNotificationClick = (notification) => {
    if (!notification.isRead && userId) {
      markAsReadMutation.mutate({ userId, notificationId: notification.id });
    }
  };

  const handleClearClick = () => {
    if (filteredNotifications.length > 0) {
      setIsModalOpen(true);
    }
  };

  const onConfirmClear = () => {
    if (filteredNotifications.length > 0 && userId) {
      const typesToClear =
        activeTab === "transactions" ? ["WALLET"] : ["SYSTEM", "REWARD"];
      clearNotificationsMutation.mutate(
        {
          types: typesToClear,
          userId,
        },
        {
          onSuccess: () => {
            setIsModalOpen(false);
          },
        },
      );
    }
  };

  const filteredNotifications = React.useMemo(() => {
    if (!notificationData) return [];
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

  if (notificationLoading) {
    return null; // Render nothing while loading initial data
  }

  const modalMessage = `คุณแน่ใจหรือไม่ว่าต้องการล้างการแจ้งเตือนในแท็บ "${
    activeTab === "transactions" ? "ธุรกรรม" : "โปรโมชั่น"
  }" ทั้งหมด?`;

  return (
    // --- Using FramerDiv as the main animated container ---
    <>
      <FramerDiv
        isOpen={showNotifications}
        className="bg-bg-dark/80 fixed inset-0 z-40 flex flex-col backdrop-blur-sm"
      >
        {/* All content is now a child of your FramerDiv */}
        <header className="flex flex-shrink-0 items-center px-4 pt-10 pb-4">
          <button
            onClick={() => setShowNotifications(false)}
            className="p-2 text-white/80 transition-colors hover:text-white"
            aria-label="Close notifications"
          >
            <ChevronLeft size={28} />
          </button>
          <h2 className="from-primary-pink to-primary-orange flex-grow bg-gradient-to-r bg-clip-text text-center text-xl font-bold text-transparent">
            การแจ้งเตือน
          </h2>
          <div className="w-10" /> {/* Spacer */}
        </header>
        <div className="flex flex-grow flex-col overflow-y-auto rounded-t-3xl bg-white">
          <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-100 px-4">
            {/* Tabs with motion underline */}
            <div className="flex flex-shrink-0 grow">
              <button
                className={`relative flex-1 py-4 text-center font-bold transition-colors ${
                  activeTab === "transactions"
                    ? "text-primary-pink"
                    : "hover:text-primary-pink text-gray-500"
                }`}
                onClick={() => setActiveTab("transactions")}
              >
                ธุรกรรม
                {activeTab === "transactions" && (
                  <motion.div
                    className="bg-primary-pink absolute right-0 bottom-0 left-0 h-0.5"
                    layoutId="underline"
                  />
                )}
              </button>
              <button
                className={`relative flex-1 py-4 text-center font-bold transition-colors ${
                  activeTab === "promos"
                    ? "text-primary-pink"
                    : "hover:text-primary-pink text-gray-500"
                }`}
                onClick={() => setActiveTab("promos")}
              >
                โปรโมชั่น
                {activeTab === "promos" && (
                  <motion.div
                    className="bg-primary-pink absolute right-0 bottom-0 left-0 h-0.5"
                    layoutId="underline"
                  />
                )}
              </button>
            </div>
            {/* The enhanced "Clear All" button remains */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleClearClick}
              disabled={
                filteredNotifications.length === 0 ||
                clearNotificationsMutation.isPending
              }
              className="ml-4 flex-shrink-0 rounded-full p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Clear notifications"
            >
              <Trash2 size={20} />
            </motion.button>
          </div>
          <div className="p-4">
            <NotificationTab
              notifications={filteredNotifications}
              onNotificationClick={handleNotificationClick}
            />
          </div>
        </div>
      </FramerDiv>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={onConfirmClear}
        isConfirming={clearNotificationsMutation.isPending}
        title="ยืนยันการล้างข้อมูล"
        message={modalMessage}
      />
    </>
  );
}
