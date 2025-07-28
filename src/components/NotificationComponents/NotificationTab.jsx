import PromoNotification from "./PromoNotification";
import TransactionNotification from "../TransactionComponents/TransactionNotification";
import { AiOutlineNotification } from "react-icons/ai";
import { FiGift } from "react-icons/fi";

export default function NotificationTab({ activeTab, notifications, onNotificationClick }) {
  const transactionNotifications = notifications.filter((n) => n.type === "RECEIVE" || n.type === "SENT");
  const promoNotifications = notifications.filter((n) => n.type === "SYSTEM" || n.type === "REWARD");

  if (activeTab === "promos") {
    return (
      <ul id="notification-list-promos" className="space-y-2">
        {promoNotifications.length > 0 ? (
          promoNotifications.map((notification) => {
            const displayIcon = notification.type === "SYSTEM" ? AiOutlineNotification : FiGift;
            return (
              <PromoNotification
                key={notification.id}
                promo={notification}
                displayIcon={displayIcon}
                onClick={() => onNotificationClick(notification)}
              />
            );
          })
        ) : (
          <p className="text-center text-gray-500">No promotions yet.</p>
        )}
      </ul>
    );
  }

  if (activeTab === "transactions") {
    return (
      <ul id="notification-list-transactions" className="space-y-2">
        {transactionNotifications.length > 0 ? (
          transactionNotifications.map((notification) => (
            <TransactionNotification
              key={notification.id}
              transaction={notification}
              onClick={() => onNotificationClick(notification)}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No transactions yet.</p>
        )}
      </ul>
    );
  }
}
