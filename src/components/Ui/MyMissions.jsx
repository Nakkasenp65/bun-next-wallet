"use client";
import React from "react";
import { motion } from "framer-motion";
import { RiExternalLinkFill } from "react-icons/ri";
import FramerLink from "./FramerLink";
import MyMissionCard from "../MissionComponents/MyMissionCard";
import { FaSearchPlus } from "react-icons/fa";
import Link from "next/link";

export default function MyMissions({
  missions,
  userData,
  onDoMission,
  onClaim,
}) {
  if (!missions || missions.length === 0) {
    // อาจจะแสดงข้อความว่า "ยังไม่มีภารกิจที่กำลังทำอยู่" แทนการ return null
    return (
      <div className="py-2 text-center text-gray-500">
        <p>ยังไม่มีภารกิจที่กำลังทำอยู่</p>
        <p className="text-sm">ลองไปดูภารกิจใหม่ๆ สิ!</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary-pink h-6 w-1 rounded-full" size={16} />
          <h2 className="text-bg-dark text-lg font-bold">ภารกิจของฉัน</h2>
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
      <div className="-m-2 flex gap-4 overflow-x-auto p-2">
        {missions.map((userMission) => (
          <MyMissionCard
            key={userMission.id}
            userMission={userMission}
            userId={userData?.id}
            cardSize={"main"}
            onDoMission={onDoMission}
            onClaim={onClaim}
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
