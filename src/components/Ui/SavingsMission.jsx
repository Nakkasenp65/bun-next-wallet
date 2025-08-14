"use client";
import React from "react";
import { RiExternalLinkFill } from "react-icons/ri";
import FramerLink from "./FramerLink";
import { useEnrollMission } from "@/hooks/useMission";
import AvailableMissionCard from "./AvailableMissionCard";
import { motion } from "framer-motion";
import { FaSearchPlus } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast"; // Ensure toast is imported
import { useRouter } from "next/navigation";

export default function SavingsMission({ missions, userData }) {
  const handleSuccessAndReload = () => {
    setTimeout(() => {
      "Wait for 5 sec handle enroll success";
    }, 300);
    window.location.reload();
  };

  const enrollMissionMutation = useEnrollMission({
    onSuccessCallback: handleSuccessAndReload,
  });

  const handleEnrollClick = (missionId) => {
    if (!userData?.id) {
      toast.error("User not found. Please try logging in again.");
      return;
    }
    enrollMissionMutation.mutate({ missionId, userId: userData?.id });
  };

  if (!missions || missions.length === 0) {
    return null; // Or a placeholder message
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-1 rounded-full bg-purple-500" />
          <h2 className="text-bg-dark text-lg font-bold">ภารกิจพิเศษ</h2>
        </div>
        <FramerLink
          link={`/mission/${userData.line_user_id}`}
          icon={<RiExternalLinkFill size={16} />}
          backgroundColor={"bg-primary-pink"}
        >
          ดูทั้งหมด
        </FramerLink>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="noscrollbar -m-2 flex gap-4 overflow-x-auto p-2">
        {missions.map((mission) => (
          <AvailableMissionCard
            key={mission.id}
            mission={mission}
            onEnroll={handleEnrollClick}
            isEnrolling={enrollMissionMutation.isPending}
            cardSize={"main"}
          />
        ))}
        {missions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 1000, damping: 30 }}
            className="flex w-5/6 flex-shrink-0 snap-start items-center justify-center gap-1 rounded-3xl bg-gradient-to-br from-yellow-300 via-orange-400 to-red-400 p-4 font-bold text-white opacity-80"
          >
            <Link
              href={`/mission/${userData?.line_user_id}`}
              className="flex h-full w-full items-center justify-center gap-2"
            >
              ไปยังหน้าภารกิจของคุณ
              <span className="flex items-center gap-1 rounded-full bg-black/25 p-2 text-lg">
                <FaSearchPlus size={24} />
              </span>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
