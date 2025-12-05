"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { FaArrowRightLong } from "react-icons/fa6";
import MyMissionCard from "../MissionComponents/MyMissionCard";
import MissionSlider from "./MissionsSlider";
import Image from "next/image";

export default function MyMissions({
  missions,
  line_user_id,
  userId,
  onDoMission,
  onClaim,
}) {
  if (!missions || missions.length === 0) {
    return (
      <Link href={`/mission/${line_user_id}`} className="group w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md"
        >
          {/* Decorative Background Elements */}
          <div className="absolute right-0 top-0 -mr-10 -mt-10 h-40 w-40 rounded-full bg-gradient-to-br from-purple-500/5 to-pink-500/5 blur-3xl transition-all group-hover:from-purple-500/10 group-hover:to-pink-500/10" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-gradient-to-tr from-orange-500/5 to-yellow-500/5 blur-3xl transition-all group-hover:from-orange-500/10 group-hover:to-yellow-500/10" />

          <div className="relative z-10 flex flex-col items-center gap-5 text-center">
            {/* Icon Container */}
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-purple-100 blur-xl" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 shadow-sm ring-1 ring-white">
                <Image
                  width={60}
                  height={60}
                  className="h-12 w-12 object-contain drop-shadow-sm"
                  src={"/assets/images/animatedMission.gif"}
                  alt="mission document"
                  priority
                />
              </div>
              {/* Notification Badge */}
              <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                !
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-lg font-bold text-transparent">
                เริ่มภารกิจแรกของคุณ!
              </h3>
              <p className="mx-auto max-w-[240px] text-sm text-slate-500">
                ทำภารกิจให้สำเร็จเพื่อรับเหรียญและของรางวัลพิเศษมากมายรอคุณอยู่
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex items-center gap-2 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition-all group-hover:scale-105 group-hover:bg-slate-800 group-hover:shadow-xl">
              <span>ดูภารกิจทั้งหมด</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </motion.div>
      </Link>
    );

  }

  // --- The "With Missions" State (Polished) ---
  return (
    <div className="grid h-max w-full grid-cols-1 gap-4">
      {/* Section Header */}
      <Link href={`/mission/${line_user_id}`} className="w-full">
        <header className="flex w-full items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <div className="h-10 w-1 rounded-full bg-pink-500" />
            ภารกิจของฉัน
          </h2>
          <motion.div
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 1000, damping: 20 }}
            className="rounded-full bg-pink-500/5 p-3 text-pink-500 transition-colors hover:bg-pink-500/10"
            aria-label="View all missions"
          >
            <FaArrowRightLong size={16} />
          </motion.div>
        </header>
      </Link>

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
