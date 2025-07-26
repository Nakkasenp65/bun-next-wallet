import React from "react";
import { faGift, faBullseye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SavingsMissionCard({ title, description, currentProgress, targetProgress, rewardAmount }) {
  const progressPercentage = (currentProgress / targetProgress) * 100;
  const isComplete = currentProgress >= targetProgress;

  return (
    <section className="flex w-full flex-col gap-4">
      <h2 className="text-bg-dark text-start text-xl font-bold">ภารกิจการออม</h2>
      <div
        id="mission-card"
        className="flex flex-col gap-4 rounded-3xl p-5 text-white shadow-md [background:linear-gradient(135deg,_var(--vibrant-purple),_var(--primary-pink))]"
      >
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faBullseye} className="text-2xl" />
          <span className="text-lg font-bold">{title}</span>
        </div>
        <p className="-mt-2 text-sm text-white/80">{description}</p>
        {/* Progress Bar */}
        <div className="text-xs font-bold">
          ความคืบหน้า: {currentProgress} / {targetProgress} ครั้ง
        </div>
        <div className="h-2.5 w-full rounded-full bg-black/20">
          <div
            className="from-bright-cyan to-bright-green h-2.5 rounded-full bg-gradient-to-r"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Footer */}
        <div className="mt-1 flex w-full items-center justify-between gap-4">
          <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-bold">
            <FontAwesomeIcon icon={faGift} className="text-bright-yellow" />
            <span>โบนัส +฿{rewardAmount.toLocaleString()}</span>
          </div>
          <button
            className={`rounded-xl px-5 py-2.5 text-sm font-bold shadow-md transition-transform hover:-translate-y-0.5 ${
              isComplete ? "bg-bright-yellow text-bg-dark" : "text-primary-pink bg-white"
            }`}
          >
            {isComplete ? "รับรางวัล!" : "ออมเลย!"}
          </button>
        </div>
      </div>
    </section>
  );
}
