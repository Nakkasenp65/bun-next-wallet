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
    gradient: "from-pink-500 via-purple-500 to-cyan-600",
    icon: <FaRocket className="h-5 w-5" />,
    name: "ครั้งแรก",
  },
  ACCUMULATION: {
    gradient: "from-pink-500 via-purple-500 to-cyan-600",
    icon: <FaChartLine className="h-5 w-5" />,
    name: "สะสมเงิน",
  },
  STREAK: {
    gradient: "from-orange-500 via-orange-600 to-red-600",
    icon: <FaFire className="h-5 w-5" />,
    name: "ออมต่อเนื่อง",
  },
  REFERRAL: {
    gradient: "from-blue-600 to-indigo-500",
    icon: <FaUserPlus className="h-5 w-5" />,
    name: "เชิญเพื่อน",
  },
  default: {
    gradient: "from-gray-700 to-gray-800",
    icon: <FaGift className="h-5 w-5" />,
    name: "ทั่วไป",
  },
};

interface MyMissionCardProps {
  userMission: any;
  onDoMission: (mission: any, usedOn: string) => void;
  onClaim: (data?: any) => void;
  cardSize?: string;
  userId?: string;
  type?: string;
  usedOn?: string;
}

const MyMissionCard = ({
  userMission,
  onDoMission,
  onClaim,
  cardSize,
  userId,
  type,
  usedOn = "mainPage",
}: MyMissionCardProps) => {
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
      gradient: missionStyle.gradient, // Use dynamic gradient from mission type
      ring: "ring-white/20",
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
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-bold shadow-lg transition-all focus:ring-2 focus:ring-white/70 focus:outline-none"
            style={{
              color: missionStyle.gradient.includes("pink")
                ? "#d946ef"
                : missionStyle.gradient.includes("blue")
                  ? "#3b82f6"
                  : missionStyle.gradient.includes("orange")
                    ? "#ea580c"
                    : "#4b5563",
            }}
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
        "relative flex w-full flex-shrink-0 snap-start flex-col overflow-hidden rounded-3xl bg-gradient-to-br p-4 text-white transition-shadow",
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
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-black/25 ring-1 ring-white/10 backdrop-blur-sm"
            aria-hidden
          >
            {missionStyle.icon}
          </div>

          <div className="flex-1 overflow-hidden">
            <h3 className="truncate text-lg leading-tight font-bold tracking-tight">
              {mission?.title}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="inline-block rounded-full bg-black/20 px-2.5 py-0.5 text-[10px] font-medium tracking-wide uppercase">
                {missionStyle.name}
              </span>
              {showTimer && (
                <div className="flex items-center gap-1 rounded-full bg-black/20 px-2 py-0.5 text-[10px] font-bold whitespace-nowrap backdrop-blur-sm">
                  {status === "AWAITING_CLAIM" ? (
                    <>
                      <AlertCircle className="h-3 w-3 text-yellow-300" />
                      <span className="text-yellow-300">
                        {timeLeft ?? "หมดเวลา"}
                      </span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-3 w-3 text-amber-300" />
                      <span className="text-white/90">{timeLeft ?? "-"}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="relative z-10 mt-4">
        <p className="text-sm leading-relaxed text-white/90">
          {mission?.description}
        </p>
      </div>

      {/* Progress Section (Clean Design) */}
      <div className="relative z-10 mt-6 mb-2">
        <div className="mb-2 flex items-end justify-between">
          <span className="text-xs font-medium text-white/70">ความคืบหน้า</span>
          <div className="flex items-baseline gap-1 font-semibold">
            <span className="text-lg text-white">{currentProgress}</span>
            <span className="text-sm text-white/50">/</span>
            <span className="text-sm text-white/70">{completeProgress}</span>
          </div>
        </div>

        <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/20 ring-1 ring-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-white/90 to-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
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

      {/* Footer: Reward & CTA */}
      <div className="relative z-10 mt-auto flex items-end justify-between gap-4 pt-4">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-white/70">รางวัล</span>
          <div className="mt-1 flex items-center gap-2 text-3xl font-bold text-amber-300 drop-shadow-sm">
            <GrMoney className="h-6 w-6" aria-hidden />
            <span>{mission?.rewardAmount?.toLocaleString()}</span>
          </div>
        </div>
        <div className="w-[140px]">{renderCTA()}</div>
      </div>
    </motion.div>
  );
};

export default MyMissionCard;
