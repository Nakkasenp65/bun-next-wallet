"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Search,
  Plus,
  Pencil,
  Trash2,
  Target,
  TimerReset,
  CalendarClock,
  ListFilter,
  X,
  Loader2,
  ChevronsLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import {
  useGetAdminMissions,
  useCreateMission,
  useUpdateMission,
  useDeleteMission,
} from "@/hooks/useMission"; // ตรวจสอบว่า Path และชื่อไฟล์ Hook ถูกต้อง
import DropDownComponent from "@/components/Ui/DropDownComponent";
import MissionCard from "./components/MissionCard";

/* =========================================================
   UI Sub-components & Helpers
========================================================= */

const StatCard = ({ title, value, icon, color }) => (
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

const Toolbar = ({ filters, onFilterChange }) => {
  const typeOptions = [
    { label: "ทุกประเภท", value: "ALL" },
    { label: "ONBOARDING", value: "ONBOARDING" },
    { label: "ACCUMULATION", value: "ACCUMULATION" },
    { label: "STREAK", value: "STREAK" },
    { label: "REFERRAL", value: "REFERRAL" },
  ];
  const statusOptions = [
    { label: "ทุกสถานะ", value: "ALL" },
    { label: "ใช้งานอยู่", value: "ACTIVE" },
    { label: "หมดอายุ", value: "EXPIRED" },
  ];
  const sortOptions = [
    { label: "สร้างล่าสุด", value: "latest" },
    { label: "ใกล้หมดอายุ", value: "expiresSoon" },
    { label: "รางวัลสูงสุด", value: "rewardHigh" },
  ];

  return (
    <div className="mb-4 space-y-4 rounded-xl bg-white p-4 shadow-sm">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          placeholder="ค้นหาชื่อภารกิจ…"
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-3 pl-9 text-sm focus:ring-2 focus:ring-pink-400 focus:outline-none"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <DropDownComponent
          label="ประเภท"
          name="type"
          value={filters.type}
          onChange={(v) => onFilterChange("type", v)}
          options={typeOptions}
          buttonClassName="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm"
        />
        <DropDownComponent
          label="สถานะ"
          name="status"
          value={filters.status}
          onChange={(v) => onFilterChange("status", v)}
          options={statusOptions}
          buttonClassName="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm"
        />
        <DropDownComponent
          label="เรียงโดย"
          name="sort"
          value={filters.sort}
          onChange={(v) => onFilterChange("sort", v)}
          options={sortOptions}
          buttonClassName="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm"
        />
      </div>
    </div>
  );
};

// [NEW] Pagination Component
const Pagination = ({ paging, onPageChange }) => (
  <div className="mt-4 flex flex-col items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-sm sm:flex-row">
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

// [NEW & COMPLETE] MissionFormModal Component
const MissionFormModal = ({
  open,
  initial,
  onClose,
  onSubmit,
  isProcessing,
}) => {
  const [form, setForm] = useState({});

  useEffect(() => {
    const initialState = initial || {
      title: "",
      description: "",
      type: "STREAK",
      rewardAmount: 0,
      durationDays: 7,
      completeProgress: 1,
      webExpiresAt: "",
    };
    // Format datetime-local correctly from ISO string
    if (initialState.webExpiresAt) {
      const localDate = new Date(initialState.webExpiresAt);
      localDate.setMinutes(
        localDate.getMinutes() - localDate.getTimezoneOffset(),
      );
      initialState.webExpiresAt = localDate.toISOString().slice(0, 16);
    }
    setForm(initialState);
  }, [initial, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({
      ...s,
      [name]: ["rewardAmount", "durationDays", "completeProgress"].includes(
        name,
      )
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      webExpiresAt: form.webExpiresAt
        ? new Date(form.webExpiresAt).toISOString()
        : null,
    };
    onSubmit(payload);
  };

  return (
    <div
      className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl bg-white shadow-xl"
        role="dialog"
      >
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold text-slate-900">
            {initial ? "แก้ไขภารกิจ" : "สร้างภารกิจใหม่"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
            aria-label="ปิด"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="grid max-h-[80vh] grid-cols-1 gap-4 overflow-y-auto p-6 md:grid-cols-2"
        >
          <div className="md:col-span-2">
            <label className="text-sm text-slate-600">ชื่อภารกิจ</label>
            <input
              name="title"
              value={form.title || ""}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-slate-600">คำอธิบาย</label>
            <textarea
              name="description"
              value={form.description || ""}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">ประเภท</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
            >
              {["ONBOARDING", "ACCUMULATION", "STREAK", "REFERRAL"].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-600">รางวัล (บาท)</label>
            <input
              type="number"
              name="rewardAmount"
              value={form.rewardAmount || ""}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
              min={0}
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">ระยะเวลา (วัน)</label>
            <input
              type="number"
              name="durationDays"
              value={form.durationDays || ""}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
              min={1}
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">เป้าความคืบหน้า</label>
            <input
              type="number"
              name="completeProgress"
              value={form.completeProgress || ""}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
              min={1}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-slate-600">วันหมดอายุบนเว็บ</label>
            <input
              type="datetime-local"
              name="webExpiresAt"
              value={form.webExpiresAt || ""}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-4 md:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex min-w-[160px] items-center justify-center rounded-lg bg-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-110 disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : initial ? (
                "บันทึกการเปลี่ยนแปลง"
              ) : (
                "สร้างภารกิจ"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================================================
   Page: Admin Manage Missions
========================================================= */
export default function AdminMissionsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    search: "",
    type: "ALL",
    status: "ALL",
    sort: "latest",
    page: 1,
    pageSize: 10,
  });
  const [debouncedSearch] = useDebounce(filters.search, 300);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMission, setEditingMission] = useState(null);

  const queryFilters = { ...filters, search: debouncedSearch };

  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
  } = useGetAdminMissions(queryFilters);
  const { mutate: createMission, isLoading: isCreating } = useCreateMission();
  const { mutate: updateMission, isLoading: isUpdating } = useUpdateMission();
  const { mutate: deleteMission } = useDeleteMission();
  const isProcessing = isCreating || isUpdating;

  const missions = apiResponse?.data || [];
  const stats = apiResponse?.stats || { total: 0, active: 0, soon: 0 };
  const paging = apiResponse?.paging || {};

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= paging.totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
    }
  };
  const handleCreate = () => {
    setEditingMission(null);
    setModalOpen(true);
  };
  const handleEdit = (mission) => {
    setEditingMission(mission);
    setModalOpen(true);
  };
  const handleDelete = (missionId) => {
    if (confirm("ยืนยันการลบภารกิจนี้?")) deleteMission(missionId);
  };

  const handleUpsertMission = (payload) => {
    if (editingMission) {
      updateMission(
        { missionId: editingMission.id, payload },
        { onSuccess: () => setModalOpen(false) },
      );
    } else {
      createMission(payload, { onSuccess: () => setModalOpen(false) });
    }
  };

  const daysLeft = (iso) =>
    iso
      ? Math.ceil(
          (new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
        )
      : null;

  return (
    <div className="min-h-dvh bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="rounded-full p-2 text-slate-700 transition hover:bg-slate-100"
              aria-label="ย้อนกลับ"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                จัดการภารกิจ
              </h1>
              <p className="text-sm text-slate-500">
                สร้าง แก้ไข และตรวจสอบสถานะภารกิจทั้งหมด
              </p>
            </div>
          </div>
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-110"
          >
            <Plus className="h-4 w-4" /> สร้างภารกิจ
          </button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            title="ภารกิจทั้งหมด"
            value={stats.total}
            icon={<Target className="h-5 w-5 text-blue-600" />}
            color="bg-blue-100"
          />
          <StatCard
            title="ใช้งานอยู่"
            value={stats.active}
            icon={<TimerReset className="h-5 w-5 text-green-600" />}
            color="bg-green-100"
          />
          <StatCard
            title="ใกล้หมดอายุ (≤7 วัน)"
            value={stats.soon}
            icon={<CalendarClock className="h-5 w-5 text-orange-600" />}
            color="bg-orange-100"
          />
        </div>

        <Toolbar filters={filters} onFilterChange={handleFilterChange} />

        {/* Loading / Error / Empty States */}
        {isLoading && (
          <div className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
          </div>
        )}
        {isError && (
          <div className="rounded-xl bg-red-50 p-6 text-center text-red-600">
            Error: {error.message}
          </div>
        )}
        {!isLoading && !isError && missions.length === 0 && (
          <div className="rounded-xl bg-white p-8 text-center text-slate-500">
            ไม่พบภารกิจที่ตรงกับตัวกรอง
          </div>
        )}

        {/* Content */}
        {!isLoading && !isError && missions.length > 0 && (
          <>
            <div className="hidden overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-100 md:block">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs text-slate-700 uppercase">
                    <tr>
                      <th className="px-6 py-3">ชื่อภารกิจ</th>
                      <th className="px-6 py-3">ประเภท</th>
                      <th className="px-6 py-3">รางวัล</th>
                      <th className="px-6 py-3">สถานะ</th>
                      <th className="px-6 py-3">ผู้เข้าร่วม</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {missions.map((m) => {
                      const expired =
                        new Date(m.webExpiresAt).getTime() < Date.now();
                      const left = daysLeft(m.webExpiresAt);
                      return (
                        <tr key={m.id} className="bg-white hover:bg-slate-50">
                          <td className="max-w-xs px-6 py-4">
                            <div className="truncate font-semibold text-slate-900">
                              {m.title}
                            </div>
                            <div className="truncate text-xs text-slate-500">
                              {m.description || "-"}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-800">
                              {m.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {Number(m.rewardAmount || 0).toLocaleString()} บาท
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {expired ? (
                              <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                                หมดอายุแล้ว
                              </span>
                            ) : (
                              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                                เหลือ {left} วัน
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {m.enrolledByCount}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex gap-2">
                              <button
                                onClick={() => handleEdit(m)}
                                className="rounded-lg border border-slate-200 p-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(m.id)}
                                className="rounded-lg border border-red-200 bg-red-50 p-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <ul className="space-y-3 md:hidden">
              {missions.map((m) => (
                <MissionCard
                  key={m.id}
                  mission={m}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
            {paging.total > paging.pageSize && (
              <Pagination paging={paging} onPageChange={handlePageChange} />
            )}
          </>
        )}
      </div>

      <MissionFormModal
        open={modalOpen}
        initial={editingMission}
        onClose={() => setModalOpen(false)}
        onSubmit={handleUpsertMission}
        isProcessing={isProcessing}
      />
    </div>
  );
}
