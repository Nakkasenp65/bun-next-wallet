import React from "react";
import { motion } from "framer-motion";
import { AiOutlineGift } from "react-icons/ai";
import { GrMoney } from "react-icons/gr";
import { FaRocket, FaUserPlus, FaChartLine, FaFire } from "react-icons/fa";
import { Clock } from "lucide-react";
import useCountdown from "@/hooks/useCountdown";
import clsx from "clsx";
import Image from "next/image";

// --- 1. Style Mapping for Mission Types ---
// We define the visual properties for each mission type here.
// This includes the gradient and a specific icon for better visual distinction.
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
    icon: <AiOutlineGift className="h-5 w-5" />,
    name: "ทั่วไป",
  },
};

interface Mission {
  id: string;
  webExpiresAt: string | Date;
  type: string;
  title: string;
  description: string;
  rewardAmount: number;
}

interface AvailableMissionCardProps {
  mission: Mission;
  onEnroll: (id: string) => void;
  isEnrolling: boolean;
  cardSize?: string;
}

const AvailableMissionCard = ({ mission, onEnroll, isEnrolling }: AvailableMissionCardProps) => {
  const { timeLeft } = useCountdown(mission.webExpiresAt);

  const handleEnrollClick = (e) => {
    e.preventDefault();
    if (!isEnrolling) {
      onEnroll(mission.id);
    }
  };

  // --- 2. Get the correct style set for the current mission ---
  // It falls back to the 'default' style if the mission type is unknown.
  const styles = missionStyleMap[mission.type] || missionStyleMap.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      // --- 3. Apply the dynamic gradient class ---
      className={clsx(
        "relative flex w-full flex-shrink-0 snap-start flex-col overflow-hidden rounded-3xl bg-gradient-to-br p-5 text-white transition-shadow",
        styles.gradient,
      )}
      role="article"
      aria-label={`ภารกิจ: ${mission.title}`}
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
            {styles.icon}
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="truncate text-base leading-tight font-bold tracking-tight">
              {mission.title}
            </h3>
            <span className="mt-0.5 inline-block rounded-full bg-black/20 px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase">
              {styles.name}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="relative z-10 mt-4 min-h-[40px] text-sm leading-relaxed text-white/95">
        {mission.description}
      </p>

      {/* Countdown Timer */}
      <div
        className="relative z-10 mt-4 flex items-center justify-center gap-2 rounded-xl bg-black/25 py-2.5 text-sm font-medium text-white/95 ring-1 ring-white/10 backdrop-blur-sm"
        role="timer"
        aria-live="polite"
        aria-label={`เวลาที่เหลือ ${timeLeft}`}
      >
        <Clock className="h-4 w-4 text-amber-300" aria-hidden />
        <span>
          เหลืออีก <span className="font-bold text-amber-300">{timeLeft}</span>
        </span>
      </div>

      {/* Footer: Reward & CTA */}
      <div className="relative z-10 mt-5 flex items-end justify-between gap-4 border-t border-white/10 pt-4">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-white/70">รางวัล</span>
          <div className="mt-1 flex items-center gap-1.5 text-2xl font-bold text-amber-300">
            <GrMoney className="h-5 w-5" aria-hidden />
            <span>{mission.rewardAmount.toLocaleString()}</span>
          </div>
        </div>
        <motion.button
          onClick={handleEnrollClick}
          disabled={isEnrolling}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          className="flex h-11 max-w-[140px] flex-1 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-bold shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-70"
          style={{
            color: styles.gradient.includes("pink") ? "#d946ef" : "#3b82f6",
          }}
          aria-label={isEnrolling ? "กำลังดำเนินการ" : "เข้าร่วมภารกิจ"}
        >
          {isEnrolling ? (
            <>
              <div
                className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-t-transparent"
                aria-hidden
              />
              <span>รอสักครู่</span>
            </>
          ) : (
            <>
              <FaRocket className="h-4 w-4" aria-hidden />
              <span>เข้าร่วม!</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AvailableMissionCard;
