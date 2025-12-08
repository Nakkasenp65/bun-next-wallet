import React from "react";
import clsx from "clsx";
import { FaCheckCircle, FaHourglassHalf, FaTimesCircle } from "react-icons/fa";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    SUCCESS: {
      text: "สำเร็จ",
      icon: <FaCheckCircle />,
      className: "bg-green-100 text-green-700",
    },
    PENDING: {
      text: "รอตรวจสอบ",
      icon: <FaHourglassHalf className="animate-spin" />,
      className: "bg-amber-100 text-amber-700",
    },
    REJECTED: {
      text: "ถูกปฏิเสธ",
      icon: <FaTimesCircle />,
      className: "bg-red-100 text-red-700",
    },
    CANCELLED: {
      text: "ยกเลิก",
      icon: <FaTimesCircle />,
      className: "bg-gray-100 text-gray-600",
    },
  };

  const config = statusConfig[status] || statusConfig.CANCELLED;

  return (
    <div
      className={clsx(
        "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold",
        config.className,
      )}
    >
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
};

export default StatusBadge;
