"use client";
import React from "react";
import { motion } from "framer-motion";
import { AiOutlineGift, AiFillCheckCircle } from "react-icons/ai";
import { GrMoney } from "react-icons/gr";
import { FaHourglassHalf, FaExclamation } from "react-icons/fa";
import clsx from "clsx";
import useCountdown from "@/hooks/useCountdown"; // Import hook ที่เพิ่งสร้าง
import { useRouter } from "next/navigation";

const MyMissionCard = ({
  userMission,
  onDoMission,
  onClaim,
  cardSize,
  userId,
  type,
  usedOn = "mainPage",
}) => {
  const {
    mission,
    status,
    currentProgress,
    completeProgress,
    userExpiresAt,
    claimExpiresAt,
  } = userMission;
  // คำนวณ % ความคืบหน้า
  const progressPercent =
    completeProgress > 0 ? (currentProgress / completeProgress) * 100 : 0;
  const countdownTarget =
    status === "AWAITING_CLAIM" ? claimExpiresAt : userExpiresAt;
  // ดึงค่า timeLeft และ isCounting ออกมาจาก hook
  const { timeLeft, isCounting } = useCountdown(countdownTarget);
  const showTimer = Boolean(isCounting || timeLeft === "หมดเวลา");
  const router = useRouter();

  // ฟังก์ชันสำหรับแสดงผลปุ่ม CTA และสถานะต่างๆ
  const renderCTA = () => {
    switch (status) {
      case "ENROLLED":
        return (
          <button
            type="button"
            onClick={() => onDoMission(mission, usedOn)}
            className="w-full rounded-xl bg-white px-4 py-2 text-base font-bold text-pink-500 shadow-md transition-transform hover:-translate-y-0.5 focus:ring-2 focus:ring-white/70 focus:outline-none"
            aria-label="เริ่มทำภารกิจ"
          >
            ทำภารกิจ!
          </button>
        );
      case "AWAITING_CLAIM":
        return (
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (usedOn === "mainPage") {
                onClaim({ userId: userId, userMissionId: userMission.id });
              }
            }}
            className="w-full rounded-xl bg-white px-4 py-2 text-base font-bold text-orange-600 shadow-lg focus:ring-2 focus:ring-white/70 focus:outline-none"
            aria-label="รับรางวัล"
          >
            รับรางวัล!
          </motion.button>
        );
      case "CLAIMED":
        return (
          <div
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-black/20 px-4 py-2 text-base font-bold text-white/80"
            aria-live="polite"
          >
            <AiFillCheckCircle aria-hidden />
            <span>รับแล้ว</span>
          </div>
        );
      case "EXPIRED":
      case "CLAIM_EXPIRED":
        return (
          <div
            className="w-full rounded-xl bg-gray-700/50 px-4 py-2 text-center text-sm font-bold text-white/60"
            aria-live="polite"
          >
            หมดเวลา
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={clsx(
        `flex w-full flex-shrink-0 snap-start flex-col gap-1 rounded-4xl bg-gradient-to-br from-purple-600 to-pink-700 p-4 px-6 text-white`,
        status === "AWAITING_CLAIM" &&
          "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500",
        status === "ENROLLED" &&
          "bg-gradient-to-br from-purple-600 to-pink-600",
        (status === "CLAIMED" ||
          status === "EXPIRED" ||
          status === "CLAIM_EXPIRED") &&
          "bg-gradient-to-br from-gray-600 to-gray-800 opacity-80",
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-black/20 p-2">
          <AiOutlineGift size={24} />
        </div>
        <h3 className="truncate text-lg font-bold">{mission?.title}</h3>
      </div>

      {/* Progress Bar & Status */}
      <div className="my-2">
        <div className="flex justify-between text-xs font-medium text-white/80">
          <span>ความคืบหน้า</span>
          <span>
            {currentProgress} / {completeProgress}
          </span>
        </div>
        <div className="mt-1 h-2 w-full rounded-full bg-black/25">
          <motion.div
            className="h-2 rounded-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Time Left */}
      <div
        className="flex items-center gap-2 text-xs font-semibold text-white/90"
        aria-live="polite"
      >
        {showTimer && (
          <>
            {status === "AWAITING_CLAIM" ? (
              <FaExclamation className="text-yellow-300" aria-hidden />
            ) : (
              <FaHourglassHalf aria-hidden />
            )}
            <span>
              {status === "AWAITING_CLAIM"
                ? `หมดเวลาเคลมใน: ${timeLeft ?? "-"}`
                : (timeLeft ?? "-")}
            </span>
          </>
        )}
      </div>

      {/* Footer: Reward & CTA */}
      <div className="mt-auto flex items-end justify-between gap-4 pt-2">
        <div className="flex flex-col items-start gap-1">
          <span className="text-xs text-white/80">รางวัล</span>
          <div className="flex items-baseline gap-1 text-xl font-bold text-amber-300">
            <GrMoney />
            <span>{mission?.rewardAmount}</span>
          </div>
        </div>
        <div className="w-32">{renderCTA()}</div>
      </div>
    </motion.div>
  );
};

export default MyMissionCard;
