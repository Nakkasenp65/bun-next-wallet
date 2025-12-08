"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ChevronLeft,
  Loader2,
  Users,
  CheckCircle2,
  Gift,
  Clock,
  XCircle,
  ChevronsLeft,
  ChevronRight,
  ChevronsRight,
  Target,
} from "lucide-react";
import { useAdminGetMissionDetails } from "@/hooks/useAdmin"; // หรือ useMissions

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
    <div className="flex items-center gap-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  </div>
);

const UserMissionStatusBadge = ({ status }: { status: string }) => {
  const styles = ({
    ENROLLED: { text: "กำลังทำ", color: "bg-blue-100 text-blue-700" },
    AWAITING_CLAIM: {
      text: "รอกดรับรางวัล",
      color: "bg-yellow-100 text-yellow-700",
    },
    CLAIMED: { text: "รับรางวัลแล้ว", color: "bg-green-100 text-green-700" },
    EXPIRED: { text: "หมดเวลา", color: "bg-red-100 text-red-700" },
    CLAIM_EXPIRED: {
      text: "ไม่ได้กดรับรางวัล",
      color: "bg-gray-100 text-gray-700",
    },
  } as Record<string, { text: string; color: string }>)[status] || { text: status, color: "bg-slate-100 text-slate-700" };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles.color}`}
    >
      {styles.text}
    </span>
  );
};

interface PaginationProps {
  paging: { page: number; totalPages: number; total: number };
  onPageChange: (page: number) => void;
}

const Pagination = ({ paging, onPageChange }: PaginationProps) => (
  <div className="mt-4 flex flex-col items-center justify-between gap-4 rounded-b-xl border-t bg-white p-4 sm:flex-row">
    <span className="text-sm text-gray-700">
      หน้า <span className="font-semibold">{paging.page}</span> /{" "}
      <span className="font-semibold">{paging.totalPages}</span> (รวม{" "}
      {paging.total} รายการ)
    </span>
    <div className="inline-flex items-center gap-1 sm:gap-2">
      <button
        onClick={() => onPageChange(1)}
        disabled={paging.page <= 1}
        className="rounded-md p-1.5 hover:bg-gray-100 disabled:opacity-50"
      >
        <ChevronsLeft className="h-4 w-4" />
      </button>
      <button
        onClick={() => onPageChange(paging.page - 1)}
        disabled={paging.page <= 1}
        className="rounded-md p-1.5 hover:bg-gray-100 disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={() => onPageChange(paging.page + 1)}
        disabled={paging.page >= paging.totalPages}
        className="rounded-md p-1.5 hover:bg-gray-100 disabled:opacity-50"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
      <button
        onClick={() => onPageChange(paging.totalPages)}
        disabled={paging.page >= paging.totalPages}
        className="rounded-md p-1.5 hover:bg-gray-100 disabled:opacity-50"
      >
        <ChevronsRight className="h-4 w-4" />
      </button>
    </div>
  </div>
);

export default function AdminMissionDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const missionId = params.missionId as string;

  const [participantFilters, setParticipantFilters] = useState({
    page: 1,
    pageSize: 10,
  });

  const {
    data: missionDetails,
    isLoading,
    isError,
    error,
  } = useAdminGetMissionDetails(missionId, participantFilters);

  const mission = missionDetails?.mission;
  const statistics = missionDetails?.statistics;
  const participants = missionDetails?.participants?.data || [];
  const paging = missionDetails?.participants?.paging || {};

  const handleParticipantPageChange = (newPage) => {
    setParticipantFilters((prev) => ({ ...prev, page: newPage }));
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-pink-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-center text-red-600">
        Error: {error.message || "ไม่สามารถโหลดข้อมูลภารกิจได้"}
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="rounded-full p-2 text-slate-700 transition hover:bg-slate-100"
            aria-label="ย้อนกลับ"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {mission?.title || "Mission Details"}
            </h1>
            <p className="text-sm text-slate-500">
              {mission?.description || "รายละเอียดของภารกิจ"}
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard
            title="ผู้เข้าร่วมทั้งหมด"
            value={statistics?.totalEnrolled || 0}
            icon={<Users className="h-5 w-5 text-blue-600" />}
            color="bg-blue-100"
          />
          <StatCard
            title="กำลังทำภารกิจ"
            value={statistics?.byStatus?.ENROLLED || 0}
            icon={<Clock className="h-5 w-5 text-yellow-600" />}
            color="bg-yellow-100"
          />
          <StatCard
            title="ทำสำเร็จ"
            value={statistics?.byStatus?.AWAITING_CLAIM || 0}
            icon={<Target className="h-5 w-5 text-orange-600" />}
            color="bg-orange-100"
          />
          <StatCard
            title="รับรางวัลแล้ว"
            value={statistics?.byStatus?.CLAIMED || 0}
            icon={<Gift className="h-5 w-5 text-green-600" />}
            color="bg-green-100"
          />
        </div>

        {/* Participants List */}
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
          <div className="border-b p-4">
            <h2 className="text-lg font-semibold text-slate-800">
              รายชื่อผู้เข้าร่วม
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs text-slate-700 uppercase">
                <tr>
                  <th className="px-6 py-3">ผู้ใช้</th>
                  <th className="px-6 py-3">ความคืบหน้า</th>
                  <th className="px-6 py-3">สถานะ</th>
                  <th className="px-6 py-3">วันที่เข้าร่วม</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {participants.length > 0 ? (
                  participants.map(
                    ({ user, status, currentProgress, enrolledAt }) => (
                      <tr key={user.id} className="bg-white hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          <div className="flex items-center gap-3">
                            <Image
                              src={
                                user.line_profile_url ||
                                "/placeholder-avatar.png"
                              }
                              alt={user.line_display_name || ""}
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                            <span>{user.line_display_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-800">
                          {currentProgress} / {mission.completeProgress}
                        </td>
                        <td className="px-6 py-4">
                          <UserMissionStatusBadge status={status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(enrolledAt).toLocaleDateString("th-TH", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                      </tr>
                    ),
                  )
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">
                      ยังไม่มีผู้เข้าร่วมภารกิจนี้
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {paging.total > paging.pageSize && (
            <Pagination
              paging={paging}
              onPageChange={handleParticipantPageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
