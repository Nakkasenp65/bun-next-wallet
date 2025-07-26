import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare, faWallet, faPlusCircle, faBullseye } from "@fortawesome/free-solid-svg-icons";
export default function ActionGrid({ setShowTransfer, setShowWithdraw, setShowDeposit, setShowGoal }) {
  const actionItems = [
    {
      label: "โอนเงิน",
      icon: faArrowUpRightFromSquare,
      key: "transfer",
    },
    { label: "ถอนเงิน", icon: faWallet, key: "withdraw" },
    { label: "ออมเงิน", icon: faPlusCircle, key: "deposit" },
    { label: "เป้าหมาย", icon: faBullseye, key: "goal" },
  ];

  const handleClick = (key) => {
    switch (key) {
      case "transfer":
        setShowTransfer((prev) => !prev);
        break;
      case "withdraw":
        setShowWithdraw((prev) => !prev);
        break;
      case "deposit":
        setShowDeposit((prev) => !prev);
        break;
      case "goal":
        setShowGoal((prev) => !prev);
        break;
      default:
        break;
    }
  };

  return (
    <div id="actions-grid" className="grid grid-cols-4 gap-4">
      {actionItems.map((item) => (
        <div
          onClick={() => handleClick(item.key)}
          href={item.url ? item.url : "/"}
          key={item.key}
          className="group text-secondary-text hover:text-light-text flex cursor-pointer flex-col items-center gap-2 transition-all hover:-translate-y-1"
        >
          <div className="bg-card-bg-dark group-hover:bg-vibrant-purple/50 flex h-[55px] w-[55px] items-center justify-center rounded-full text-xl shadow-sm transition-all">
            <FontAwesomeIcon icon={item.icon} />
          </div>
          <span className="text-xs font-bold">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
