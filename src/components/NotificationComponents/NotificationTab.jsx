import PromoNotification from "./PromoNotification";
import TransactionNotification from "../TransactionComponents/TransactionNotification";
import { AiOutlineNotification } from "react-icons/ai";
import { FiGift } from "react-icons/fi";

export default function NotificationTab({ activeTab, notifications }) {
  console.log("Notification Tab: ", notifications);
  if (activeTab === "promos") {
    return (
      <ul id="notification-list-promos" className="space-y-2">
        {notifications.map((notification) => {
          if (notification.type === "SYSTEM")
            return <PromoNotification key={notification.id} promo={notification} displayIcon={AiOutlineNotification} />;
          if (notification.type === "REWARD")
            return <PromoNotification key={notification.id} promo={notification} displayIcon={FiGift} />;
        })}
      </ul>
    );
  }

  if (activeTab === "transactions") {
    return (
      <ul id="notification-list-transactions" className="space-y-2">
        {notifications.map((notification) => {
          if (notification.type === "RECEIVE" || notification.type === "SENT")
            return <TransactionNotification key={notification.id} transaction={notification} />;
        })}
      </ul>
    );
  }
}
