import React from "react";
import { MdOutlineSavings } from "react-icons/md";
import { RiExternalLinkFill } from "react-icons/ri";
import FramerLink from "./FramerLink";
import { useEnrollMission } from "@/hooks/useMission";
import AvailableMissionCard from "./AvailableMissionCard"; // 1. Import Component ใหม่

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
          />
        ))}
      </div>
    </div>
  );
}
