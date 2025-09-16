"use client";
import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { ChevronLeft, Filter, Sparkles } from "lucide-react";

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

/* =========================================================
   Filter configs
========================================================= */
const STATUS_FILTERS = [
  { key: "ALL", label: "ทั้งหมด" },
  { key: "AWAITING_CLAIM", label: "รอรับรางวัล" },
  { key: "COMPLETED", label: "สำเร็จแล้ว" },
  { key: "EXPIRED", label: "หมดอายุ" },
];

const TYPE_FILTERS = [
  { key: "ALL", label: "ทุกประเภท" },
  { key: "ONBOARDING", label: "ภารกิจต้อนรับ" },
  { key: "ACCUMULATION", label: "ภารกิจสะสม" },
  { key: "STREAK", label: "ภารกิจต่อเนื่อง" },
  { key: "REFERRAL", label: "ภารกิจชวนเพื่อน" },
];

/* =========================================================
   UI Atoms
========================================================= */
const TabBtn = ({ active, onClick, children, count }) => (
  <button
    onClick={onClick}
    className={clsx(
      "group relative flex-1 py-3 text-center font-bold transition-all",
      // --- FIXED COLOR LOGIC ---
      active ? "text-primary-pink" : "text-bg-dark hover:opacity-80",
    )}
  >
    <span className="inline-flex items-center justify-center gap-2">
      {children}
      {typeof count === "number" && (
        <span
          className={clsx(
            "rounded-full px-2.5 py-0.5 text-xs font-semibold",
            active ? "bg-pink-100 text-pink-600" : "bg-gray-200 text-gray-700",
          )}
        >
          {count}
        </span>
      )}
    </span>
    <span
      className={clsx(
        "absolute inset-x-6 -bottom-0.5 h-0.5 rounded-full transition-all",
        active ? "bg-primary-pink" : "bg-transparent",
      )}
    />
  </button>
);

const Chip = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={clsx(
      "w-max rounded-full px-4 py-1.5 text-xs font-medium text-nowrap transition-colors",
      active
        ? "bg-pink-500 text-white shadow-md shadow-pink-500/20"
        : "bg-gray-200 text-gray-700 hover:bg-gray-300",
    )}
  >
    {children}
  </button>
);

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
export default function Page() {
  const params = useParams();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("myMissions");
  const [myMissionStatusFilter, setMyMissionStatusFilter] = useState("ALL");
  const [myMissionTypeFilter, setMyMissionTypeFilter] = useState("ALL");
  const [availableMissionTypeFilter, setAvailableMissionTypeFilter] = useState("ALL");

  const { data: userData, isLoading: isUserLoading } = useGetUser(params.userId);
  const userId = userData?.id;

  const { data: myMissions, isLoading: myMissionsLoading } = useGetMyMissions(userId);
  const { data: availableMissions, isLoading: availableMissionsLoading } =
    useGetAvailableMissions(userId);

  const { mutate: enroll, isPending: isEnrolling } = useEnrollMission();
  const { mutate: claim, isPending: isClaiming } = useClaimMission();

  const filteredMyMissions = useMemo(() => {
    if (!myMissions) return [];
    return myMissions
      .filter((m) => {
        if (myMissionStatusFilter === "ALL") return true;
        if (myMissionStatusFilter === "AWAITING_CLAIM") return m.status === "AWAITING_CLAIM";
        if (myMissionStatusFilter === "COMPLETED") return m.status === "CLAIMED";
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
    return availableMissions.filter((m) => m?.type === availableMissionTypeFilter);
  }, [availableMissions, availableMissionTypeFilter]);

  const counts = useMemo(
    () => ({
      myAll: myMissions?.length || 0,
      availAll: availableMissions?.length || 0,
    }),
    [myMissions, availableMissions],
  );

  const isLoading = isUserLoading || myMissionsLoading || availableMissionsLoading;

  const handleEnrollClick = (missionId) => {
    if (!userId) return;
    enroll({ missionId, userId });
  };

  const clearFilters = () => {
    setMyMissionStatusFilter("ALL");
    setMyMissionTypeFilter("ALL");
    setAvailableMissionTypeFilter("ALL");
  };

  const FilterRow = ({ forTab }) => (
    <div className="sticky top-[116px] z-10 border-b border-slate-200/60 bg-white/80 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      {forTab === "my" ? (
        <>
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="inline-flex flex-shrink-0 items-center gap-1.5 text-xs font-semibold text-slate-600">
              <Filter className="h-4 w-4" /> สถานะ
            </span>
            {STATUS_FILTERS.map(({ key, label }) => (
              <Chip
                key={key}
                active={myMissionStatusFilter === key}
                onClick={() => setMyMissionStatusFilter(key)}
              >
                {label}
              </Chip>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2 overflow-x-auto py-1">
            <span className="ml-1 inline-flex flex-shrink-0 items-center gap-1.5 text-xs font-semibold text-slate-600">
              ประเภท
            </span>
            {TYPE_FILTERS.map(({ key, label }) => (
              <Chip
                key={key}
                active={myMissionTypeFilter === key}
                onClick={() => setMyMissionTypeFilter(key)}
              >
                {label}
              </Chip>
            ))}
          </div>
        </>
      ) : (
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="inline-flex flex-shrink-0 items-center gap-1.5 text-xs font-semibold text-slate-600">
            <Filter className="h-4 w-4" /> ประเภท
          </span>
          {TYPE_FILTERS.map(({ key, label }) => (
            <Chip
              key={key}
              active={availableMissionTypeFilter === key}
              onClick={() => setAvailableMissionTypeFilter(key)}
            >
              {label}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );

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
      </header>

      <FilterRow forTab={activeTab === "myMissions" ? "my" : "available"} />

      <main className="flex-grow px-4">
        {activeTab === "myMissions" ? renderMy() : renderAvailable()}
      </main>
    </div>
  );
}
