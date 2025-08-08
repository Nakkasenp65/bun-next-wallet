import React from "react";
import { motion } from "framer-motion";
import { AiOutlineGift } from "react-icons/ai";
import { GrMoney } from "react-icons/gr";
import { FaRocket } from "react-icons/fa";

const AvailableMissionCard = ({ mission, onEnroll, isEnrolling }) => {
  // ฟังก์ชันป้องกันการกดซ้ำซ้อน
  const handleEnrollClick = (e) => {
    e.preventDefault();
    if (!isEnrolling) {
      onEnroll(mission.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex w-72 flex-shrink-0 snap-start flex-col gap-3 rounded-3xl bg-gradient-to-br from-purple-600 to-pink-600 p-4 text-white shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-black/20 p-2">
          <AiOutlineGift size={24} />
        </div>
        <h3 className="truncate text-lg font-bold">{mission.title}</h3>
      </div>

      {/* Description */}
      <p className="min-h-[60px] text-sm text-white/80">
        {mission.description}
      </p>

      {/* Spacer */}
      <div className="flex-grow" />

      {/* Footer: Reward & CTA */}
      <div className="mt-auto flex items-end justify-between gap-4 pt-2">
        <div className="flex flex-col items-start">
          <span className="text-xs text-white/80">รางวัล</span>
          <div className="flex items-baseline gap-1 text-xl font-bold text-amber-300">
            <GrMoney />
            <span>{mission.rewardAmount}</span>
          </div>
        </div>
        <div className="w-32">
          <motion.button
            onClick={handleEnrollClick}
            disabled={isEnrolling}
            whileTap={{ scale: 0.95 }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-pink-500 shadow-md transition-transform disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isEnrolling ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-pink-500 border-t-transparent"></div>
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
      </div>
    </motion.div>
  );
};

export default AvailableMissionCard;
