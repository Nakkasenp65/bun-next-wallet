import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import React from "react";

// The props now clearly expect a 'transaction'
export default function TransactionNotification({ transaction }) {
  console.log(transaction);
  const isReceived = transaction.type === "RECEIVE";
  const icon = isReceived ? faArrowDown : faArrowUp;

  return (
    <li
      className={`relative flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-gray-100 ${
        !transaction.isRead && "bg-pink-50"
      }`}
    >
      <div
        className={`mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm ${
          isReceived ? "bg-success-green/20 text-success-green" : "bg-danger-red/20  text-danger-red "
        }`}
      >
        <FontAwesomeIcon icon={icon} />
      </div>
      <div>
        <p className="font-bold text-gray-800">{transaction.title}</p>
        <p className="text-sm text-gray-600">{transaction.body}</p>
        <p className="mt-1 text-xs text-gray-400">{transaction.time}</p>
      </div>
      {!transaction.isRead && <div className="bg-primary-pink absolute top-3 right-3 h-2 w-2 rounded-full" />}
    </li>
  );
}
