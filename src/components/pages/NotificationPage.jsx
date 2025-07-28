"use client";

import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import FramerDiv from "../framerComponents/FramerDiv";
import NotificationTab from "../NotificationComponents/NotificationTab";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/useUser";
import Loading from "../Loading";
import ErrorComponent from "../Ui/ErrorComponent";
import axios from "axios";

const fetchNotifications = async (userId) => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_LOCAL_API_URL}/notification/${userId}`);
  return data.data;
};

const markAsReadMutationFn = async ({ notificationId, userMongoId }) => {
  if (!notificationId || !userMongoId) {
    throw new Error("Notification ID and User ID are required.");
  }
  const url = `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/notification/${notificationId}/${userMongoId}/read`;
  const { data } = await axios.patch(url);
  return data.data;
};

const clearNotificationsMutationFn = async (type) => {
  const { data } = await axios.delete(`${process.env.NEXT_PUBLIC_LOCAL_API_URL}/notification/clear?type=${type}`);
  return data.data;
};

export default function NotificationPage({ userId, showNotifications, setShowNotifications }) {
  const [activeTab, setActiveTab] = useState("transactions");
  const queryClient = useQueryClient();
  const { data: userData, isLoading: isUserLoading, error: userError } = useUser(userId);

  // --- Data Fetching ---
  const {
    data: notifications,
    isLoading: areNotificationsLoading,
    error: notificationsError,
  } = useQuery({
    queryKey: ["notifications", userData?.id],
    queryFn: () => fetchNotifications(userData.id),
    enabled: !!userData, // Fetch only when userData is available
  });

  // --- Mutations ---
  const markAsReadMutation = useMutation({
    mutationFn: markAsReadMutationFn,
    onSuccess: () => {
      // Invalidate notifications query to refetch and update the UI
      queryClient.invalidateQueries({ queryKey: ["notifications", userData?.id] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to mark as read.");
    },
  });

  const clearNotificationsMutation = useMutation({
    mutationFn: clearNotificationsMutationFn,
    onSuccess: (data) => {
      toast.success(`${data.count} notifications cleared!`);
      queryClient.invalidateQueries({ queryKey: ["notifications", userData?.id] });
    },
    onError: () => {
      toast.error("Failed to clear notifications.");
    },
  });

  // --- Event Handlers ---
  const handleNotificationClick = (notification) => {
    if (!notification.isRead && userData?.id) {
      markAsReadMutation.mutate({
        notificationId: notification.id,
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
    if (!notifications) return []; // Return empty array if notifications haven't loaded

    if (activeTab === "transactions") {
      // The "Transactions" tab should show SENT and RECEIVE types.
      return notifications.filter((n) => n.type === "SENT" || n.type === "RECEIVE");
    }
    if (activeTab === "promos") {
      // The "Promos" tab should show SYSTEM and REWARD types.
      return notifications.filter((n) => n.type === "SYSTEM" || n.type === "REWARD");
    }
    return []; // Fallback
  }, [notifications, activeTab]);

  const isLoading = isUserLoading || areNotificationsLoading;
  const error = userError || notificationsError;

  if (isLoading)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-dark">
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
      className="fixed inset-0 z-40 flex flex-col bg-bg-dark/80 backdrop-blur-sm"
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
        <div className="flex flex-shrink-0  items-center justify-between border-b border-gray-200 px-4">
          {/* Tabs */}
          <div className="flex flex-shrink-0 grow border-b border-gray-200 px-4">
            <button
              className={`flex-1 py-4 text-center font-bold transition-colors  ${
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
            className="text-sm font-bold text-gray-500 hover:text-danger-red disabled:opacity-50"
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
