"use client";
import React from "react";
import { RiExternalLinkFill } from "react-icons/ri";
import FramerLink from "./FramerLink";
import { useEnrollMission } from "@/hooks/useMission";
import AvailableMissionCard from "./AvailableMissionCard";
import { motion } from "framer-motion";
import { FaSearchPlus } from "react-icons/fa";

export default function SavingsMission({ missions, userData }) {
  // 2. isPending จะถูกใช้เพื่อส่งไปยังการ์ดแต่ละใบ
  const { mutate: enroll, isPending: isEnrolling } = useEnrollMission();

  const handleEnrollClick = (missionId) => {
    if (!userData?.id) {
      // อาจจะแสดง toast แจ้งเตือนให้ login ก่อน
      return;
    }
    enroll({ missionId, userId: userData.id });
  };

  if (!missions || missions.length === 0) {
    return null; // หรือแสดงข้อความว่า "ไม่มีภารกิจพิเศษในขณะนี้"
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
        {/* 3. วนลูปและเรียกใช้ AvailableMissionCard */}
        {missions.map((mission) => (
          <AvailableMissionCard
            key={mission.id}
            mission={mission}
            onEnroll={handleEnrollClick}
            isEnrolling={isEnrolling}
            cardSize={"main"}
          />
        ))}
        {missions && (
          <motion.a
            href="/"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 1000, damping: 30 }}
            className="flex w-5/6 flex-shrink-0 snap-start items-center justify-center gap-1 rounded-3xl bg-gradient-to-br from-yellow-300 via-orange-400 to-red-400 p-4 font-bold text-white opacity-80"
          >
            ไปยังหน้าภารกิจของคุณ
            <span className="flex items-center gap-1 rounded-full bg-black/25 p-2 text-lg">
              <FaSearchPlus size={24} />
            </span>
          </motion.a>
        )}
      </div>
    </div>
  );
}
