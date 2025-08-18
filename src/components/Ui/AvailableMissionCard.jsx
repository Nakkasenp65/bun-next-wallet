import React from "react";
import { motion } from "framer-motion";
import { AiOutlineGift } from "react-icons/ai";
import { GrMoney } from "react-icons/gr";
import { FaRocket, FaUserPlus, FaChartLine, FaFire } from "react-icons/fa";
import useCountdown from "@/hooks/useCountdown";
import clsx from "clsx";
import Image from "next/image";

// --- 1. Style Mapping for Mission Types ---
// We define the visual properties for each mission type here.
// This includes the gradient and a specific icon for better visual distinction.
const missionStyleMap = {
  ONBOARDING: {
    gradient: "from-pink-500 via-purple-500 to-cyan-600",
    icon: <FaRocket />,
    name: "ครั้งแรก",
  },
  ACCUMULATION: {
    gradient: "from-pink-500 via-purple-500 to-cyan-600",
    icon: <FaChartLine />,
    name: "สะสมเงิน",
  },
  STREAK: {
    gradient: "from-orange-500 via-orange-600 to-red-600",
    icon: <FaFire />,
    name: "ออมต่อเนื่อง",
  },
  REFERRAL: {
    gradient: "from-blue-600 to-indigo-500",
    icon: <FaUserPlus />,
    name: "เชิญเพื่อน",
  },
  default: {
    gradient: "from-gray-700 to-gray-800",
    icon: <AiOutlineGift />,
    name: "ทั่วไป",
  },
};

const AvailableMissionCard = ({ mission, onEnroll, isEnrolling }) => {
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
      transition={{ duration: 0.5 }}
      // --- 3. Apply the dynamic gradient class ---
      className={clsx(
        "flex w-full flex-shrink-0 snap-start flex-col gap-1 rounded-3xl bg-gradient-to-br p-4 text-white",
        styles.gradient,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-black/25 p-2.5 text-xl">
            {/* Use the dynamic icon */}
            {styles.icon}
          </div>
          <h3 className="text-md truncate font-bold">{mission.title}</h3>
        </div>
        {/* Use the mission type name as a stylish tag */}
        {/* <span className="rounded-full bg-black/25 px-3 py-1 text-[10px] font-semibold">
          {styles.name}
        </span> */}
      </div>

      {/* Description */}
      <p className="my-3 min-h-[40px] text-sm text-white drop-shadow-sm drop-shadow-black/75">
        {mission.description}
      </p>

      {/* Countdown Timer */}
      <div className="my-2 flex items-center self-center text-center text-xs font-medium text-white/90">
        <Image
          width={40}
          height={40}
          className="h-6 w-6"
          src={
            "https://lh3.googleusercontent.com/d/1laqwMVmQG02RSn0iyFLQg2WnVxhsFHmf"
          }
          alt="clock ticking logo"
          priority
        />
        หมดเวลาเข้าร่วมใน{" "}
        <span className="font-bold text-amber-300">{timeLeft}</span>
      </div>

      {/* Footer: Reward & CTA */}
      <div className="mt-auto flex items-end justify-between gap-4 border-t border-white/20 pt-4">
        <div className="flex flex-col items-start">
          <span className="text-xs text-white/80">รางวัล</span>
          <div className="flex items-baseline gap-2 text-2xl font-bold text-amber-300">
            <GrMoney />
            <span>{mission.rewardAmount}</span>
          </div>
        </div>
        <motion.button
          onClick={handleEnrollClick}
          disabled={isEnrolling}
          whileTap={{ scale: 0.95 }}
          className="flex w-32 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-purple-600 shadow-md transition-transform disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isEnrolling ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-purple-600 border-t-transparent"></div>
              <span>รอสักครู่</span>
            </>
          ) : (
            <>
              <FaRocket />
              <span>เข้าร่วม!</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AvailableMissionCard;
