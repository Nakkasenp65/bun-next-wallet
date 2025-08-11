import React from "react";
import { MdOutlineSavings } from "react-icons/md";
import { RiExternalLinkFill } from "react-icons/ri";
import FramerLink from "./FramerLink";
import MyMissionCard from "../MissionComponents/MyMissionCard";

export default function MyMissions({ missions, userData }) {
  // Handler for the "Start Now" button
  const handleEnrollClick = (missionId) => {
    enroll(missionId);
  };

  if (!missions || missions.length === 0) {
    // อาจจะแสดงข้อความว่า "ยังไม่มีภารกิจที่กำลังทำอยู่" แทนการ return null
    return (
      <div className="py-8 text-center text-gray-500">
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
      <div className="noscrollbar -m-2 flex gap-4 overflow-x-auto p-2">
        {missions.map((userMission) => (
          <MyMissionCard key={userMission.id} userMission={userMission} />
        ))}
      </div>
    </div>
  );
}
