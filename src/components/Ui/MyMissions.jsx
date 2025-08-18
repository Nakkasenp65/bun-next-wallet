"use client";
import React from "react";
import { motion } from "framer-motion";
import MyMissionCard from "../MissionComponents/MyMissionCard";
import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";
import MissionSlider from "./MissionsSlider";
import { FcQuestions } from "react-icons/fc";
export default function MyMissions({
  missions,
  line_user_id,
  userId,
  onDoMission,
  onClaim,
}) {
  if (!missions || missions.length === 0) {
    // อาจจะแสดงข้อความว่า "ยังไม่มีภารกิจที่กำลังทำอยู่" แทนการ return null
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-2 text-center text-gray-500">
        <FcQuestions size={48} />
        <div className="flex flex-col gap-0.5">
          <p>ยังไม่มีภารกิจที่กำลังทำอยู่</p>
          <p className="text-sm">ลองไปดูภารกิจใหม่ๆ สิ!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-max w-full grid-cols-1 gap-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <Link href={`/mission/${line_user_id}`} className={"flex w-full"}>
          <header className="flex w-full justify-between">
            <h2 className="text-bg-dark flex items-center gap-2 text-lg font-bold">
              <div className="bg-primary-pink h-10 w-1 rounded-full" />
              ภารกิจของฉัน
            </h2>
            <motion.div
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 1000, damping: 20 }}
              className={`bg-primary-pink/5 rounded-full p-3`}
            >
              <FaArrowRightLong className={`text-primary-pink`} size={16} />
            </motion.div>
          </header>
        </Link>
      </div>

      {/* Horizontal Scroll Container */}
      <MissionSlider>
        {missions.map((userMission) => (
          <MyMissionCard
            key={userMission.id}
            userMission={userMission}
            userId={userId}
            cardSize={"main"}
            onDoMission={onDoMission}
            onClaim={onClaim}
          />
        ))}
      </MissionSlider>
    </div>
  );
}
