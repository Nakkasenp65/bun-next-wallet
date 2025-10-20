"use client";
import React from "react";
import { motion } from "framer-motion";
import { AiFillCheckCircle } from "react-icons/ai";
import { GrMoney } from "react-icons/gr";
import {
  FaRocket,
  FaUserPlus,
  FaChartLine,
  FaFire,
  FaGift,
} from "react-icons/fa";
import { Clock, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import clsx from "clsx";
import useCountdown from "@/hooks/useCountdown";
import { useRouter } from "next/navigation";

// --- Mission Type Style Configuration ---
const missionStyleMap = {
  ONBOARDING: {
    icon: <FaRocket className="h-5 w-5" />,
    name: "ครั้งแรก",
  },
  ACCUMULATION: {
    icon: <FaChartLine className="h-5 w-5" />,
    name: "สะสมเงิน",
  },
  STREAK: {
    icon: <FaFire className="h-5 w-5" />,
    name: "ออมต่อเนื่อง",
  },
  REFERRAL: {
    icon: <FaUserPlus className="h-5 w-5" />,
    name: "เชิญเพื่อน",
  },
  default: {
    icon: <FaGift className="h-5 w-5" />,
    name: "ทั่วไป",
  },
};

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
    completeProgress > 0
      ? Math.min((currentProgress / completeProgress) * 100, 100)
      : 0;
  const countdownTarget =
    status === "AWAITING_CLAIM" ? claimExpiresAt : userExpiresAt;

  // ดึงค่า timeLeft และ isCounting ออกมาจาก hook
  const { timeLeft, isCounting } = useCountdown(countdownTarget);
  const showTimer = Boolean(isCounting || timeLeft === "หมดเวลา");

  // Get mission type styling
  const missionStyle =
    missionStyleMap[mission?.type] || missionStyleMap.default;

  // Status-based gradient configuration
  const statusConfig = {
    ENROLLED: {
      gradient: "from-purple-600 via-purple-500 to-pink-600",
      ring: "ring-purple-400/30",
    },
    AWAITING_CLAIM: {
      gradient: "from-yellow-400 via-orange-500 to-red-500",
      ring: "ring-orange-400/30",
    },
    CLAIMED: {
      gradient: "from-gray-600 to-gray-700",
      ring: "ring-gray-500/30",
      opacity: "opacity-75",
    },
    EXPIRED: {
      gradient: "from-gray-600 to-gray-800",
      ring: "ring-gray-500/30",
      opacity: "opacity-70",
    },
    CLAIM_EXPIRED: {
      gradient: "from-gray-600 to-gray-800",
      ring: "ring-gray-500/30",
      opacity: "opacity-70",
    },
  };

  const config = statusConfig[status] || statusConfig.ENROLLED;

  // ฟังก์ชันสำหรับแสดงผลปุ่ม CTA และสถานะต่างๆ
  const renderCTA = () => {
    switch (status) {
      case "ENROLLED":
        return (
          <motion.button
            type="button"
            onClick={() => onDoMission(mission, usedOn)}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-bold text-purple-600 shadow-lg transition-all focus:ring-2 focus:ring-white/70 focus:outline-none"
            aria-label="เริ่มทำภารกิจ"
          >
            <FaRocket className="h-4 w-4" aria-hidden />
            <span>ทำภารกิจ!</span>
          </motion.button>
        );
      case "AWAITING_CLAIM":
        return (
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              if (usedOn === "mainPage") {
                onClaim({ userId: userId, userMissionId: userMission.id });
              }
            }}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-bold text-orange-600 shadow-lg transition-all focus:ring-2 focus:ring-white/70 focus:outline-none"
            aria-label="รับรางวัล"
          >
            <FaGift className="h-4 w-4" aria-hidden />
            <span>รับรางวัล!</span>
          </motion.button>
        );
      case "CLAIMED":
        return (
          <div
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-black/25 px-4 text-sm font-bold text-white/90 ring-1 ring-white/10 backdrop-blur-sm"
            aria-live="polite"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden />
            <span>รับแล้ว</span>
          </div>
        );
      case "EXPIRED":
      case "CLAIM_EXPIRED":
        return (
          <div
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-black/25 px-4 text-sm font-bold text-white/70 ring-1 ring-white/10 backdrop-blur-sm"
            aria-live="polite"
          >
            <XCircle className="h-4 w-4" aria-hidden />
            <span>หมดเวลา</span>
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
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={clsx(
        "relative flex w-full flex-shrink-0 snap-start flex-col overflow-hidden rounded-3xl bg-gradient-to-br p-5 text-white transition-shadow",
        config.gradient,
        config.opacity,
        `ring-1 ${config.ring}`,
      )}
      role="article"
      aria-label={`ภารกิจ: ${mission?.title}, สถานะ: ${status}`}
    >
      {/* Subtle overlay for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(transparent_60%,rgba(0,0,0,0.2))]"
      />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex flex-1 items-center gap-3">
          <div
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-black/25 ring-1 ring-white/10 backdrop-blur-sm"
            aria-hidden
          >
            {missionStyle.icon}
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="truncate text-base leading-tight font-bold tracking-tight">
              {mission?.title}
            </h3>
            <span className="mt-0.5 inline-block rounded-full bg-black/20 px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase">
              {missionStyle.name}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="relative z-10 mt-4 min-h-[40px] text-sm leading-relaxed text-white/95">
        {mission?.description}
      </p>

      {/* Progress Bar & Status */}
      <div className="relative z-10 mt-4">
        <div className="flex items-center justify-between text-xs font-medium text-white/80">
          <span>ความคืบหน้า</span>
          <span className="font-bold">
            {currentProgress} / {completeProgress}
          </span>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-black/30 ring-1 ring-white/10 backdrop-blur-sm">
          <motion.div
            className="h-2.5 rounded-full bg-gradient-to-r from-white to-amber-300"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            role="progressbar"
            aria-valuenow={Math.round(progressPercent)}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Time Left */}
      {showTimer && (
        <div
          className="relative z-10 mt-4 flex items-center justify-center gap-2 rounded-xl bg-black/25 py-2.5 text-xs font-medium text-white/95 ring-1 ring-white/10 backdrop-blur-sm"
          role="timer"
          aria-live="polite"
        >
          {status === "AWAITING_CLAIM" ? (
            <>
              <AlertCircle className="h-4 w-4 text-yellow-300" aria-hidden />
              <span>
                หมดเวลาเคลม:{" "}
                <span className="font-bold text-yellow-300">
                  {timeLeft ?? "-"}
                </span>
              </span>
            </>
          ) : (
            <>
              <Clock className="h-4 w-4 text-amber-300" aria-hidden />
              <span>
                เวลาที่เหลือ:{" "}
                <span className="font-bold text-amber-300">
                  {timeLeft ?? "-"}
                </span>
              </span>
            </>
          )}
        </div>
      )}

      {/* Footer: Reward & CTA */}
      <div className="relative z-10 mt-5 flex items-end justify-between gap-4 border-t border-white/10 pt-4">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-white/70">รางวัล</span>
          <div className="mt-1 flex items-center gap-1.5 text-2xl font-bold text-amber-300">
            <GrMoney className="h-5 w-5" aria-hidden />
            <span>{mission?.rewardAmount?.toLocaleString()}</span>
          </div>
        </div>
        <div className="max-w-[140px] flex-1">{renderCTA()}</div>
      </div>
    </motion.div>
  );
};

export default MyMissionCard;
