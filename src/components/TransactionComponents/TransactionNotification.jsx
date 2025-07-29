import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";

export default function TransactionNotification({ transaction, onClick }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleItemClick = () => {
    // Toggle expansion and call the mark as read function
    setIsExpanded(!isExpanded);
    onClick();
  };

  const isReceived = transaction.type === "RECEIVE";
  const icon = isReceived ? faArrowDown : faArrowUp;

  return (
    <li
      onClick={handleItemClick}
      className={`relative cursor-pointer rounded-lg p-3 transition-colors hover:bg-gray-100 ${
        !transaction.isRead && "bg-pink-50"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`mt-1 flex h-8 w-8 ...`}>
          <FontAwesomeIcon icon={icon} />
        </div>
        {/* Main Content */}
        <div className="flex-grow">
          <p className="font-bold text-gray-800">{transaction.title}</p>
          <p className="text-sm text-gray-600">{transaction.body}</p>
          <p className="mt-1 text-xs text-gray-400">
            {new Date(transaction.createdAt).toLocaleString()}
          </p>
        </div>
        {/* Unread Dot & Chevron */}
        <div className="flex flex-col items-center gap-2">
          {!transaction.isRead && (
            <div className="bg-primary-pink h-2 w-2 rounded-full" />
          )}
          {transaction.transaction && (
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            />
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && transaction.transaction && (
        <div className="mt-3 border-t pt-3 pl-12 text-sm text-gray-700">
          <h4 className="mb-1 font-bold">Transaction Details:</h4>
          <p>
            <strong>Amount:</strong>{" "}
            {transaction.transaction.amount.toLocaleString()} THB
          </p>
          <p>
            <strong>Status:</strong> {transaction.transaction.status}
          </p>
          <p>
            <strong>From:</strong> {transaction.transaction.from}
          </p>
          <p>
            <strong>To:</strong> {transaction.transaction.to}
          </p>
        </div>
      )}
    </li>
  );
}
