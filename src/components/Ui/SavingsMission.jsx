import React from "react";
import Link from "next/link";
import { BsFillCircleFill } from "react-icons/bs";
import { FiChevronRight } from "react-icons/fi";
import { GrMoney } from "react-icons/gr";
import { useEnrollMission } from "@/hooks/useMission";
import { MdOutlineSavings } from "react-icons/md";
import { AiOutlineGift } from "react-icons/ai";
import { RiExternalLinkFill } from "react-icons/ri";
import FramerLink from "./FramerLink";
/**
 * Renders the entire "Savings Mission" section, including a header
 * and a horizontally scrollable list of mission cards.
 * @param {object} props
 * @param {Array} props.missions - The array of available mission objects.
 */
export default function SavingsMission({ missions }) {
  const { mutate: enroll, isLoading: isEnrolling } = useEnrollMission();

  // Handler for the "Start Now" button
  const handleEnrollClick = (missionId) => {
    console.log("Enrolling in mission:", missionId);
    enroll(missionId);
  };

  // If there are no missions, don't render the component
  if (!missions || missions.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <MdOutlineSavings className="text-primary-pink h-auto w-8" size={16} />
          <h2 className="text-bg-dark text-base font-bold">ภารกิจการออม</h2>
        </div>
        <FramerLink
          link={"/mission"}
          icon={<RiExternalLinkFill size={24} />}
          backgroundColor={"bg-primary-pink"}
        >
          ดูทั้งหมด
        </FramerLink>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="flex gap-4 overflow-x-auto p-2">
        {missions.map((mission) => (
          // Individual Mission Card
          <div
            key={mission.id}
            className="flex w-64 flex-shrink-0 snap-start flex-col gap-1 rounded-3xl p-4 text-white shadow-sm [background:linear-gradient(135deg,_var(--vibrant-purple),_var(--primary-pink))]"
          >
            {/* Card Header */}
            <div className="flex items-start gap-1">
              <AiOutlineGift size={32} />
              <span className="truncate text-lg font-bold first-letter:uppercase">
                {mission.title}
              </span>
            </div>

            <p className="min-h-12 text-sm text-white/80">{mission.description}</p>

            {/* Spacer to push the footer to the bottom */}
            <div className="flex-grow" />

            {/* Card Footer */}
            <div className="mt-1 flex w-full items-center justify-between gap-2">
              <div className="flex items-center gap-2 rounded-xl bg-black/25 px-3 py-2 text-sm font-bold">
                <GrMoney className="h-4 w-4 text-amber-300" />
                <span>ได้รับ ฿{mission.rewardAmount.toLocaleString()}</span>
              </div>
              <button
                onClick={() => handleEnrollClick(mission.id)}
                disabled={isEnrolling}
                className="text-primary-pink rounded-xl bg-white px-4 py-2 text-sm font-bold shadow-md transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
              >
                เริ่มเลย!
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
