import React from "react";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

const formatCurrency = (num) => `฿${num.toLocaleString("en-US")}`;

export default function SavingsGoalCard({ brand, name, target, balance = 0 }) {
  const progress = progressDisplay();
  const remainingAmount = Math.max(0, target - balance);
  const isAchieved = balance >= target;

  function progressDisplay() {
    if (balance > 0 && balance <= target) return (balance / target) * 100;
    else if (balance > target) {
      return 100;
    } else return 0;
  }

  return (
    <div
      id="savings-goal-card"
      className="text-light-text shadow-neon-purple relative flex flex-col gap-4 overflow-hidden rounded-3xl p-4 [background:linear-gradient(135deg,_#2a2155_0%,_#3a2e6d_100%)]"
    >
      <div className="flex justify-between">
        {/* Card Title */}
        <div id="card-title" className="flex flex-5/6 flex-col gap-6">
          <div className="flex flex-col w-3/4  ">
            <div className="flex gap-0.5 items-center ">
              <FontAwesomeIcon
                icon={faTrophy}
                className="text-accent-gold drop-shadow-accent-gold/50 mb-0.5 h-5 w-5 text-sm drop-shadow-sm"
              />{" "}
              <span className="text-lg">เป้าหมาย:</span>
            </div>
            <span className=" text-sm">
              {brand} {name}
            </span>
          </div>
          <div className="text-sm text-white/50">ยอดเงินคงเหลือ</div>
        </div>

        {/* Profile Picture */}
        <Image
          src={"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
          width={100}
          height={100}
          alt="profile image"
          className="border-primary-pink shadow-neon-pink absolute top-4 right-5 h-14 w-14 rounded-full border-2 bg-cover"
        />
      </div>

      {/* Saved Amount */}
      <div className="flex flex-col gap-2">
        <div className="from-primary-pink to-primary-orange bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent">
          {formatCurrency(balance)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative my-1">
        <div className="text-accent-gold absolute -top-5 right-0 text-xs font-bold">{Math.round(progress)}%</div>
        <div className="h-3 rounded-full bg-black/25 shadow-inner">
          <div
            className="h-full rounded-full [background:linear-gradient(90deg,_var(--gold-accent)_0%,_var(--primary-pink)_100%)]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Goal Details */}
      <div className="flex items-center justify-between text-xs font-bold text-white/90">
        <span className="rounded-full bg-black/10 px-3 py-2">เป้าหมาย: {formatCurrency(target)}</span>
        <span className="rounded-full bg-black/10 px-3 py-2">
          {isAchieved ? "สำเร็จแล้ว!" : `ขาดอีก: ${formatCurrency(remainingAmount)}`}
        </span>
      </div>
    </div>
  );
}
