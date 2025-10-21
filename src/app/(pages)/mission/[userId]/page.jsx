"use client";
import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { ChevronLeft, Sparkles } from "lucide-react";

import {
  useGetAvailableMissions,
  useGetMyMissions,
  useEnrollMission,
  useClaimMission,
} from "@/hooks/useMission";
import { useGetUser } from "@/hooks/useUser";

import MyMissionCard from "@/components/MissionComponents/MyMissionCard";
import AvailableMissionCard from "@/components/ui/AvailableMissionCard";
import MissionGridSkeleton from "@/components/SkeletonComponents/MissionGridSkeleton";
import FilterRow from "./components/FilterRow";
import TabBtn from "./components/TabBtn";

/* =========================================================
   UI Atoms
========================================================= */

const EmptyState = ({ title, subtitle, action }) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white p-10 text-center shadow-sm">
    <div className="rounded-2xl bg-gradient-to-br from-pink-50 to-orange-50 p-4">
      <Sparkles className="text-primary-pink h-7 w-7" />
    </div>
    <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
    {subtitle && <p className="max-w-md text-sm text-slate-500">{subtitle}</p>}
    {action}
  </div>
);

/* =========================================================
   Main Page
========================================================= */
export default function MissionPage() {
  const params = useParams();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("myMissions");
  const [myMissionStatusFilter, setMyMissionStatusFilter] = useState("ALL");
  const [myMissionTypeFilter, setMyMissionTypeFilter] = useState("ALL");
  const [availableMissionTypeFilter, setAvailableMissionTypeFilter] =
    useState("ALL");

  const { data: userData, isLoading: isUserLoading } = useGetUser(
    params.userId,
  );
  const userId = userData?.id;

  const { data: myMissions, isLoading: myMissionsLoading } = useGetMyMissions(
    userId,
    "all",
  );
  const { data: availableMissions, isLoading: availableMissionsLoading } =
    useGetAvailableMissions(userId);

  const { mutate: enroll, isPending: isEnrolling } = useEnrollMission();
  const { mutate: claim, isPending: isClaiming } = useClaimMission();

  const filteredMyMissions = useMemo(() => {
    if (!myMissions) return [];
    return myMissions
      .filter((m) => {
        if (myMissionStatusFilter === "ALL") return true;
        if (myMissionStatusFilter === "AWAITING_CLAIM")
          return m.status === "AWAITING_CLAIM";
        if (myMissionStatusFilter === "COMPLETED")
          return m.status === "CLAIMED";
        if (myMissionStatusFilter === "EXPIRED")
          return m.status === "EXPIRED" || m.status === "CLAIM_EXPIRED";
        return true;
      })
      .filter((m) => {
        if (myMissionTypeFilter === "ALL") return true;
        return m?.mission?.type === myMissionTypeFilter;
      });
  }, [myMissions, myMissionStatusFilter, myMissionTypeFilter]);

  const filteredAvailableMissions = useMemo(() => {
    if (!availableMissions) return [];
    if (availableMissionTypeFilter === "ALL") return availableMissions;
    return availableMissions.filter(
      (m) => m?.type === availableMissionTypeFilter,
    );
  }, [availableMissions, availableMissionTypeFilter]);

  const counts = useMemo(
    () => ({
      myAll: myMissions?.length || 0,
      availAll: availableMissions?.length || 0,
    }),
    [myMissions, availableMissions],
  );

  const isLoading =
    isUserLoading || myMissionsLoading || availableMissionsLoading;

  const handleEnrollClick = (missionId) => {
    if (!userId) return;
    enroll({ missionId, userId });
  };

  const clearFilters = () => {
    setMyMissionStatusFilter("ALL");
    setMyMissionTypeFilter("ALL");
    setAvailableMissionTypeFilter("ALL");
  };

  const renderMy = () => {
    if (isLoading)
      return (
        <div>
          <MissionGridSkeleton count={6} variant="my" />
        </div>
      );
    if (!filteredMyMissions.length) {
      return (
        <div>
          <EmptyState
            title="ไม่พบภารกิจตามเงื่อนไขที่เลือก"
            subtitle="ลองล้างตัวกรองหรือเปลี่ยนเงื่อนไขการค้นหา"
            action={
              <button
                onClick={clearFilters}
                className="bg-primary-pink rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-md shadow-pink-500/20 hover:brightness-110"
              >
                ล้างตัวกรอง
              </button>
            }
          />
        </div>
      );
    }
    return (
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMyMissions.map((userMission) => (
          <MyMissionCard
            key={userMission.id}
            userMission={userMission}
            onDoMission={() => router.push(`/`)}
            usedOn="missionPage"
            onClaim={() => claim({ userId, userMissionId: userMission.id })}
          />
        ))}
      </div>
    );
  };

  const renderAvailable = () => {
    if (isLoading)
      return (
        <div className="mt-4">
          <MissionGridSkeleton count={6} variant="available" />
        </div>
      );
    if (!filteredAvailableMissions.length) {
      return (
        <div className="mt-6">
          <EmptyState
            title="ยังไม่มีภารกิจใหม่ที่ตรงกับตัวกรอง"
            subtitle="ลองเปลี่ยนประเภทภารกิจเพื่อดูภารกิจอื่น ๆ"
            action={
              <button
                onClick={clearFilters}
                className="bg-primary-pink rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-md shadow-pink-500/20 hover:brightness-110"
              >
                ดูทั้งหมด
              </button>
            }
          />
        </div>
      );
    }
    return (
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAvailableMissions.map((mission) => (
          <AvailableMissionCard
            key={mission.id}
            mission={mission}
            onEnroll={handleEnrollClick}
            isEnrolling={isEnrolling}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex min-h-dvh flex-col bg-gray-50">
      <header className="sticky top-0 z-20 bg-white text-white shadow-md">
        <div className="from-primary-pink to-primary-orange bg-gradient-to-br">
          <div className="flex items-center justify-between px-5 pt-10 pb-4">
            <Link
              href="/"
              className="rounded-full p-1 transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
            >
              <ChevronLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-xl font-bold drop-shadow-md">ศูนย์ภารกิจ</h1>
            <div className="w-6" />
          </div>
        </div>
        <div className="flex border-b border-slate-200/80">
          <TabBtn
            active={activeTab === "myMissions"}
            onClick={() => setActiveTab("myMissions")}
            count={counts.myAll}
          >
            ภารกิจของฉัน
          </TabBtn>
          <TabBtn
            active={activeTab === "available"}
            onClick={() => setActiveTab("available")}
            count={counts.availAll}
          >
            ภารกิจใหม่
          </TabBtn>
        </div>
        <FilterRow
          forTab={activeTab === "myMissions" ? "my" : "available"}
          myMissionStatusFilter={myMissionStatusFilter}
          setMyMissionStatusFilter={setMyMissionStatusFilter}
          myMissionTypeFilter={myMissionTypeFilter}
          setMyMissionTypeFilter={setMyMissionTypeFilter}
          availableMissionTypeFilter={availableMissionTypeFilter}
          setAvailableMissionTypeFilter={setAvailableMissionTypeFilter}
        />
      </header>

      <main className="flex-grow px-4 py-4 pb-24">
        {activeTab === "myMissions" ? renderMy() : renderAvailable()}
      </main>
    </div>
  );
}
