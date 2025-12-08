"use client";
import React from "react";
import { useEnrollMission } from "@/hooks/useMission";
import AvailableMissionCard from "./AvailableMissionCard";
import { motion } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast"; // Ensure toast is imported
import { FaArrowRightLong } from "react-icons/fa6";
import MissionSlider from "./MissionsSlider";

export default function SavingMission({ missions, line_user_id, userId }) {
  

  const enrollMissionMutation = useEnrollMission();

  const handleEnrollClick = (missionId) => {
    enrollMissionMutation.mutate({ missionId, userId });
  };

  if (!missions || missions.length === 0) {
    return null; // Or a placeholder message
  }

  return (
    <div className="grid h-max w-full grid-cols-1 gap-4">
      {/* Section Header */}
      <Link href={`/mission/${line_user_id}`} className={"flex w-full"}>
        <header className="flex w-full justify-between">
          <h2 className="text-bg-dark flex items-center gap-2 text-lg font-bold">
            <div className="bg-primary-pink h-10 w-1 rounded-full" />
            ภารกิจพิเศษ
          </h2>
          <motion.div
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 1000, damping: 20 }}
            className={`rounded-full bg-amber-500/5 p-3`}
          >
            <FaArrowRightLong className={`text-primary-pink`} size={16} />
          </motion.div>
        </header>
      </Link>

      {/* Horizontal Scroll Container */}
      <MissionSlider>
        {missions.map((mission) => (
          <div key={mission.id}>
            {/* เพิ่ม Padding รอบๆ Card เพื่อไม่ให้ติดขอบ */}
            <AvailableMissionCard
              mission={mission}
              onEnroll={handleEnrollClick}
              isEnrolling={enrollMissionMutation.isPending}
              cardSize={"main"}
            />
          </div>
        ))}
      </MissionSlider>
    </div>
  );
}
