"use client";

import React from "react";
import { Pencil, Trash2, BarChart3 } from "lucide-react";

/**
 * MissionCard: คอมโพเนนต์สำหรับแสดงข้อมูลภารกิจในรูปแบบการ์ด (สำหรับหน้าจอมือถือ)
 * @param {object} props
 * @param {object} props.mission - Object ข้อมูลภารกิจ
 * @param {function} props.onEdit - ฟังก์ชันที่จะถูกเรียกเมื่อกดปุ่ม "แก้ไข"
 * @param {function} props.onDelete - ฟังก์ชันที่จะถูกเรียกเมื่อกดปุ่ม "ลบ"
 * @param {function} props.onViewDetails - ฟังก์ชันที่จะถูกเรียกเมื่อกดปุ่ม "ดูรายละเอียด"
 */
export default function MissionCard({
  mission,
  onEdit,
  onDelete,
  onViewDetails,
}) {
  // Helper to check if the mission's expiration date has passed.
  const isExpired = mission.webExpiresAt
    ? new Date(mission.webExpiresAt).getTime() < Date.now()
    : false;

  // Helper to calculate the number of days left until expiration.
  const daysLeft = mission.webExpiresAt
    ? Math.ceil(
        (new Date(mission.webExpiresAt).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  return (
    <li className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      {/* Section 1: Title, Description, and Type */}
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="flex-grow">
          <p className="font-semibold text-slate-900">{mission.title}</p>
          <p className="line-clamp-2 text-xs text-slate-500">
            {mission.description || "-"}
          </p>
        </div>
        <span className="flex-shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-800">
          {mission.type}
        </span>
      </div>

      {/* Section 2: Details (Reward, Status) */}
      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 border-t pt-2 text-sm">
        <div className="text-slate-500">รางวัล</div>
        <div className="text-right font-semibold">
          {Number(mission.rewardAmount || 0).toLocaleString()} บาท
        </div>
        <div className="text-slate-500">สถานะ</div>
        <div className="text-right">
          {isExpired ? (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
              หมดอายุแล้ว
            </span>
          ) : (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
              เหลือ {daysLeft} วัน
            </span>
          )}
        </div>
        <div className="text-slate-500">ผู้เข้าร่วม</div>
        <div className="text-right font-semibold">
          {mission.enrolledByCount.toLocaleString()}
        </div>
      </div>

      {/* Section 3: Action Buttons */}
      <div className="mt-3 flex flex-wrap justify-end gap-2 border-t pt-3">
        <button
          onClick={() => onViewDetails(mission.id)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
        >
          <BarChart3 className="h-4 w-4" />
          ดูรายละเอียด
        </button>
        <button
          onClick={() => onEdit(mission)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          <Pencil className="h-4 w-4" />
          แก้ไข
        </button>
        <button
          onClick={() => onDelete(mission.id)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
        >
          <Trash2 className="h-4 w-4" />
          ลบ
        </button>
      </div>
    </li>
  );
}
