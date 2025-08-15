"use client";
import React, { useState } from "react";
import {
  useGetAvailableMissions,
  useGetMyMissions,
  useEnrollMission,
  useClaimMission,
} from "@/hooks/useMission";
import { useUser } from "@/hooks/useUser";
import { useParams, useRouter } from "next/navigation";
import { FaChevronLeft } from "react-icons/fa";
import clsx from "clsx";
import MyMissionCard from "@/components/MissionComponents/MyMissionCard";
import AvailableMissionCard from "@/components/Ui/AvailableMissionCard";
import MissionGridSkeleton from "@/components/MissionComponents/MissionGridSkeleton";
import Link from "next/link";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("myMissions");

  const { data: userData, isLoading: isUserLoading } = useUser(params.userId);
  const userId = userData?.id;

  const { data: myMissions, isLoading: myMissionsLoading } =
    useGetMyMissions(userId);

  const { data: availableMissions, isLoading: availableMissionsLoading } =
    useGetAvailableMissions(userId);

  const { mutate: enroll, isPending: isEnrolling } = useEnrollMission();
  const { mutate: claim, isPending: isClaiming } = useClaimMission();

  const handleEnrollClick = (missionId) => {
    if (!userId) return;
    enroll({ missionId, userId });
  };

  const isLoading =
    isUserLoading || myMissionsLoading || availableMissionsLoading;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="mt-4">
          <MissionGridSkeleton
            count={6}
            variant={activeTab === "available" ? "available" : "my"}
          />
        </div>
      );
    }
    if (activeTab === "myMissions") {
      if (!myMissions || myMissions.length === 0) {
        return (
          <div className="py-16 text-center text-gray-500">
            คุณยังไม่มีภารกิจที่กำลังทำอยู่
          </div>
        );
      }
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myMissions.map((userMission) => (
            <MyMissionCard
              type={"missionPage"}
              key={userMission.id}
              userMission={userMission}
              onDoMission={() => router.push(`/`)}
              usedOn="missionPage"
              onClaim={() => claim({ userId, userMissionId: userMission.id })}
            />
          ))}
        </div>
      );
    }
    if (activeTab === "available") {
      if (!availableMissions || availableMissions.length === 0) {
        return (
          <div className="py-16 text-center text-gray-500">
            ไม่มีภารกิจใหม่ในขณะนี้
          </div>
        );
      }
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {availableMissions.map((mission) => (
            <AvailableMissionCard
              key={mission.id}
              mission={mission}
              onEnroll={handleEnrollClick}
              isEnrolling={isEnrolling}
            />
          ))}
        </div>
      );
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-gray-50">
      {/* --- 1. Merged Header and Tabs --- */}
      <header className="from-primary-pink to-primary-orange sticky top-0 z-20 bg-gradient-to-br text-white shadow-lg">
        {/* Top part of the header */}
        <div className="flex items-center justify-between px-5 pt-10 pb-4">
          <Link
            href={"/"}
            className="text-2xl transition-transform hover:scale-110"
          >
            <FaChevronLeft />
          </Link>
          <h1 className="text-xl font-bold drop-shadow-md">ศูนย์ภารกิจ</h1>
          <div className="w-6"></div>
        </div>

        {/* Tabs part of the header */}
        <div className="flex bg-white backdrop-blur-sm">
          <button
            onClick={() => setActiveTab("myMissions")}
            className={clsx(
              "flex-1 py-4 text-center font-bold transition-all duration-200",
              activeTab === "myMissions"
                ? "border-b-primary-pink text-primary-pink border-b-2"
                : "text-bg-dark border-b-2 border-white hover:bg-white/10",
            )}
          >
            ภารกิจของฉัน
          </button>
          <button
            onClick={() => setActiveTab("available")}
            className={clsx(
              "flex-1 py-3 text-center font-bold transition-all duration-200",
              activeTab === "available"
                ? "border-b-primary-pink text-primary-pink border-b-2"
                : "text-bg-dark border-b-2 border-white hover:bg-white/10",
            )}
          >
            ภารกิจใหม่
          </button>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-grow p-4">{renderContent()}</main>
    </div>
  );
}
