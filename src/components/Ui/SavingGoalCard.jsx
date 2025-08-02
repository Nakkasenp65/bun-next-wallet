import React from "react";
import { IoMdTrophy } from "react-icons/io";
import Image from "next/image";

const formatCurrency = (num) => `฿${num.toLocaleString("en-US")}`;

export default function SavingsGoalCard({ brand, name, target, balance = 20000, imageUrl }) {
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
      className="text-light-text shadow-neon-purple inset-shadow-lg relative flex flex-col gap-4 overflow-hidden rounded-3xl p-6 inset-shadow-black/36 [background:linear-gradient(45deg,_#230640_0%,_#402E99_100%)]"
    >
      <Image
        className="animate-floating drop-shadow-primary-pink absolute -right-18 -bottom-4 h-auto w-[240px] -rotate-6 drop-shadow-2xl sm:-bottom-12 sm:w-[300px] sm:-rotate-10"
        src={imageUrl}
        alt="mobile phone image"
        width={300}
        height={300}
        priority
      />
      <div className="flex justify-between">
        {/* Profile Picture */}
        {/* <Image
          src={"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
          width={100}
          height={100}
          alt="profile image"
          className="border-primary-pink shadow-neon-pink absolute top-4 right-5 h-14 w-14 rounded-full border-2 bg-cover"
        /> */}

        {/* Card Title */}
        <div id="card-title" className="flex flex-5/6 flex-col gap-6">
          <div className="flex w-3/4 flex-col">
            <div className="flex items-center gap-0.5">
              <IoMdTrophy className="text-accent-gold drop-shadow-accent-gold/50 mb-0.5 h-4 w-4 drop-shadow-sm" />
              <span className="text-xs">เป้าหมาย:</span>
            </div>
            <span className="text-base break-keep">
              {brand} {name}
            </span>
          </div>
        </div>
      </div>

      {/* Saved Amount */}
      <div className="flex flex-col">
        <div className="text-xs text-white/50">ยอดเงินปัจจุบัน</div>
        <div className="from-primary-pink bg-gradient-to-r to-amber-500 bg-clip-text text-3xl font-bold text-transparent">
          {formatCurrency(balance)}
        </div>
      </div>

      <div className="relative flex w-[60%] flex-col gap-2">
        {/* Progress Bar */}
        {/* <div className="text-accent-gold absolute -top-5 right-0 text-xs font-bold">{Math.round(progress)}%</div> */}
        <div className="h-3 rounded-full bg-black/50 shadow-inner">
          <div
            className="h-full rounded-full [background:linear-gradient(90deg,_var(--gold-accent)_0%,_var(--primary-pink)_100%)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* GOAL */}
        <div className="flex items-center justify-between text-[10px] text-white/90">
          <span className="rounded-full bg-black/50 px-2 py-1.5">
            ดาวน์: {formatCurrency(target)}
          </span>
          <span className="rounded-full bg-black/50 px-2 py-1.5">
            {isAchieved ? "สำเร็จแล้ว!" : `อีก: ${formatCurrency(remainingAmount)}`}
          </span>
        </div>
      </div>

      {/* Goal Details */}
    </div>
  );
}
