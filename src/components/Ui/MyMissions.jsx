"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react"; // --- Replaced FaArrowRightLong with Lucide for consistency
import MyMissionCard from "../MissionComponents/MyMissionCard";
import MissionSlider from "./MissionsSlider";
import Image from "next/image";

export default function MyMissions({ missions, line_user_id, userId, onDoMission, onClaim }) {
  // --- The Re-Woven "Empty State" ---
  // This section is now an "invitation card" instead of a simple text block.
  if (!missions || missions.length === 0) {
    return (
      <Link href={`/mission/${line_user_id}`} className="w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="from-primary-pink/5 to-primary-orange/5 flex cursor-pointer flex-col items-center gap-4 rounded-2xl bg-gradient-to-br p-6 text-center shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md"
        >
          {/* --- Meaningful Iconography --- */}
          <div className="from-primary-pink to-primary-orange rounded-full bg-gradient-to-br p-1.5 text-white">
            <Image
              width={500}
              height={500}
              className="h-12 w-12"
              src={"/assets/images/animatedMission.gif"}
              alt="mission document"
              priority
            />
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-slate-800">ยังไม่มีภารกิจที่กำลังทำ</h3>
            <p className="text-sm text-slate-500">สำรวจภารกิจใหม่ๆ เพื่อรับรางวัลพิเศษ!</p>
          </div>
          {/* --- Clear Call-to-Action --- */}
          <div className="text-primary-pink mt-2 flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm">
            <span>ดูภารกิจทั้งหมด</span>
            <ArrowRight size={16} />
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
            <div className="bg-primary-pink h-6 w-1 rounded-full" />
            ภารกิจของฉัน
          </h2>
          <motion.div
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="View all missions"
          >
            <ArrowRight size={20} />
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
