import PromoNotification from "./PromoNotification";
import TransactionNotification from "../TransactionComponents/TransactionNotification";
import { AiOutlineNotification } from "react-icons/ai";
import { FiGift } from "react-icons/fi";

// This component is now much simpler. It just renders what it's given.
export default function NotificationTab({
  notifications,
  onNotificationClick,
  onNotificationDelete,
}) {
  if (!notifications || notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
        <AiOutlineNotification className="mb-4 text-5xl text-gray-300" />
        <p className="font-semibold">ไม่มีการแจ้งเตือน</p>
        <p className="text-sm">การแจ้งเตือนใหม่ๆ จะปรากฏที่นี่</p>
      </div>
    );
  }

  return (
    <ul id="notification-list" className="space-y-2">
      {notifications.map((notification) => {
        // We can decide which component to render based on the type here
        const isTransactionType = notification.type === "WALLET";
        const isPromoType =
          notification.type === "REWARD" || notification.type === "SYSTEM";

        if (isTransactionType) {
          return (
            <TransactionNotification
              key={notification.id}
              notification={notification} // Pass the whole notification object
              onClick={() => onNotificationClick(notification)}
              onDelete={() => onNotificationDelete(notification)}
            />
          );
        }

        if (isPromoType) {
          const displayIcon =
            notification.type === "SYSTEM" ? AiOutlineNotification : FiGift;
          return (
            <PromoNotification
              key={notification.id}
              promo={notification}
              displayIcon={displayIcon}
              onClick={() => onNotificationClick(notification)}
              onDelete={() => onNotificationDelete(notification)}
            />
          );
        }

        return null; // Fallback for any other types
      })}
    </ul>
  );
}
