"use client";
import React, { useMemo, useState, useEffect } from "react";
import {
  ChevronLeft,
  Search,
  Plus,
  Pencil,
  Trash2,
  Target,
  Gift,
  CalendarClock,
  TimerReset,
  ListFilter,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

/* =========================================================
   Mock missions (แทน API จริงชั่วคราว)
========================================================= */
const mockMissions = [
  {
    id: "m1",
    title: "สะสมออมครบ 7 วัน",
    description: "ออมต่อเนื่องครบทุกวัน 7 วัน",
    type: "STREAK", // MissionType
    rewardAmount: 50,
    durationDays: 7,
    completeProgress: 7,
    webExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(), // +30d
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2d ago
    updatedAt: new Date().toISOString(),
    enrolledBy: [{ id: "u1" }, { id: "u2" }],
  },
  {
    id: "m2",
    title: "ภารกิจต้อนรับ",
    description: "เติมเงินครั้งแรกสำเร็จ",
    type: "ONBOARDING",
    rewardAmount: 30,
    durationDays: 3,
    completeProgress: 1,
    webExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // +7d
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updatedAt: new Date().toISOString(),
    enrolledBy: [{ id: "u3" }],
  },
  {
    id: "m3",
    title: "เชิญเพื่อนได้สำเร็จ",
    description: "เพื่อนสมัครและเริ่มออม",
    type: "REFERRAL",
    rewardAmount: 80,
    durationDays: 14,
    completeProgress: 1,
    webExpiresAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // expired
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    updatedAt: new Date().toISOString(),
    enrolledBy: [],
  },
];

/* =========================================================
   Small UI atoms
========================================================= */
const Chip = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
      active
        ? "bg-pink-500 text-white shadow-md shadow-pink-500/20"
        : "bg-slate-200 text-slate-700 hover:bg-slate-300"
    }`}
  >
    {children}
  </button>
);

const StatCard = ({ title, value, icon, color }) => (
  <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full ${color}`}
      >
        {icon}
      </div>
      <div className="flex flex-col items-start justify-center gap-2">
        <p className="text-xs font-medium text-nowrap text-slate-500">
          {title}
        </p>
        <p className="text-xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  </div>
);

const formatTHB = (n) =>
  (Number(n) || 0).toLocaleString("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
  });

const isExpired = (iso) => (iso ? new Date(iso).getTime() < Date.now() : false);
const daysLeft = (iso) =>
  iso
    ? Math.ceil((new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

/* =========================================================
   Mission Form Modal (Create / Edit)
========================================================= */
const MissionFormModal = ({ open, initial, onClose, onSubmit }) => {
  const [form, setForm] = useState(
    () =>
      initial || {
        title: "",
        description: "",
        type: "STREAK",
        rewardAmount: 0,
        durationDays: 7,
        completeProgress: 1,
        webExpiresAt: "",
      },
  );

  useEffect(() => {
    setForm(
      initial || {
        title: "",
        description: "",
        type: "STREAK",
        rewardAmount: 0,
        durationDays: 7,
        completeProgress: 1,
        webExpiresAt: "",
      },
    );
  }, [initial, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({
      ...s,
      [name]:
        name === "rewardAmount" ||
        name === "durationDays" ||
        name === "completeProgress"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation เบื้องต้น
    if (!form.title?.trim()) return alert("กรุณากรอกชื่อภารกิจ");
    if (form.rewardAmount < 0) return alert("รางวัลต้องไม่ติดลบ");
    if (form.durationDays <= 0) return alert("ระยะเวลาต้องมากกว่า 0 วัน");
    if (form.completeProgress <= 0)
      return alert("เป้าความคืบหน้าต้องมากกว่า 0");
    onSubmit(form);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
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
          className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2"
        >
          <div className="md:col-span-2">
            <label className="text-sm text-slate-600">ชื่อภารกิจ</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
              placeholder="เช่น ออมต่อเนื่อง 7 วัน"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-slate-600">คำอธิบาย</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
              placeholder="รายละเอียดเงื่อนไขภารกิจ"
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">
              ประเภท (MissionType)
            </label>
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
            <label className="text-sm text-slate-600">รางวัล (THB)</label>
            <input
              type="number"
              name="rewardAmount"
              value={form.rewardAmount}
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
              value={form.durationDays}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
              min={1}
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">
              เป้าความคืบหน้า (completeProgress)
            </label>
            <input
              type="number"
              name="completeProgress"
              value={form.completeProgress}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
              min={1}
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-slate-600">
              วันหมดอายุบนเว็บ (webExpiresAt)
            </label>
            <input
              type="datetime-local"
              name="webExpiresAt"
              value={
                form.webExpiresAt
                  ? new Date(form.webExpiresAt).toISOString().slice(0, 16)
                  : ""
              }
              onChange={(e) => {
                const val = e.target.value;
                setForm((s) => ({
                  ...s,
                  webExpiresAt: val ? new Date(val).toISOString() : "",
                }));
              }}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 md:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-110"
            >
              {initial ? "บันทึกการเปลี่ยนแปลง" : "สร้างภารกิจ"}
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

  // state
  const [missions, setMissions] = useState(mockMissions);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL | ACTIVE | EXPIRED
  const [sortKey, setSortKey] = useState("latest"); // latest | expiresSoon | rewardHigh
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // derived
  const filtered = useMemo(() => {
    let list = [...missions];

    if (typeFilter !== "ALL") list = list.filter((m) => m.type === typeFilter);
    if (statusFilter !== "ALL")
      list = list.filter((m) =>
        statusFilter === "ACTIVE"
          ? !isExpired(m.webExpiresAt)
          : isExpired(m.webExpiresAt),
      );

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (m) =>
          (m.title || "").toLowerCase().includes(q) ||
          (m.description || "").toLowerCase().includes(q),
      );
    }

    if (sortKey === "latest") {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortKey === "expiresSoon") {
      list.sort(
        (a, b) =>
          new Date(a.webExpiresAt) -
          Date.now() -
          (new Date(b.webExpiresAt) - Date.now()),
      );
    } else if (sortKey === "rewardHigh") {
      list.sort((a, b) => (b.rewardAmount || 0) - (a.rewardAmount || 0));
    }

    return list;
  }, [missions, typeFilter, statusFilter, search, sortKey]);

  // stats
  const stats = useMemo(() => {
    const total = missions.length;
    const active = missions.filter((m) => !isExpired(m.webExpiresAt)).length;
    const soon = missions.filter(
      (m) => !isExpired(m.webExpiresAt) && daysLeft(m.webExpiresAt) <= 7,
    ).length;
    return { total, active, soon };
  }, [missions]);

  // actions
  const handleCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (m) => {
    setEditing(m);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (!confirm("ยืนยันการลบภารกิจนี้?")) return;
    setMissions((prev) => prev.filter((m) => m.id !== id));
  };

  const upsertMission = (payload) => {
    if (editing) {
      // update
      setMissions((prev) =>
        prev.map((m) =>
          m.id === editing.id
            ? { ...m, ...payload, updatedAt: new Date().toISOString() }
            : m,
        ),
      );
    } else {
      // create
      const newItem = {
        id: `m_${Date.now()}`,
        ...payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        enrolledBy: [],
      };
      setMissions((prev) => [newItem, ...prev]);
    }
    setModalOpen(false);
  };

  const clearFilters = () => {
    setTypeFilter("ALL");
    setStatusFilter("ALL");
    setSearch("");
    setSortKey("latest");
  };

  return (
    <div className="min-h-dvh bg-gray-50">
      {/* Container */}
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
                สร้าง/แก้ไขภารกิจ ค้นหา จัดเรียง และตรวจสอบสถานะ
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
        <div className="mb-6 grid grid-cols-3 gap-4 sm:grid-cols-3">
          <StatCard
            title="ภารกิจทั้งหมด"
            value={stats.total}
            icon={<Target className="h-5 w-5 text-blue-600" />}
            color="bg-blue-100"
          />
          <StatCard
            title="ใช้งานอยู่ (Active)"
            value={stats.active}
            icon={<TimerReset className="h-5 w-5 text-green-600" />}
            color="bg-green-100"
          />
          <StatCard
            title="ใกล้หมดอายุ (≤7วัน)"
            value={stats.soon}
            icon={<CalendarClock className="h-5 w-5 text-orange-600" />}
            color="bg-orange-100"
          />
        </div>

        {/* Toolbar */}
        <div className="top-0 z-10 -mx-4 mb-4 border-b bg-white/80 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="flex w-full flex-col items-center gap-3 md:flex-row md:justify-between">
            <div className="relative w-full md:w-1/2">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหาชื่อ/คำอธิบายภารกิจ…"
                className="w-full rounded-lg border border-slate-200 py-2 pr-3 pl-9 text-sm text-slate-800 placeholder:text-slate-400 focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
              />
            </div>

            <div className="flex w-full flex-wrap items-center gap-2 overflow-x-scroll md:w-auto">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600">
                <ListFilter className="h-4 w-4" /> ประเภท
              </span>
              {["ALL", "ONBOARDING", "ACCUMULATION", "STREAK", "REFERRAL"].map(
                (t) => (
                  <Chip
                    key={t}
                    active={typeFilter === t}
                    onClick={() => setTypeFilter(t)}
                  >
                    {t}
                  </Chip>
                ),
              )}
            </div>

            <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600">
                <ListFilter className="h-4 w-4" /> สถานะ
              </span>
              {["ALL", "ACTIVE", "EXPIRED"].map((s) => (
                <Chip
                  key={s}
                  active={statusFilter === s}
                  onClick={() => setStatusFilter(s)}
                >
                  {s}
                </Chip>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500">เรียงโดย</label>
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
              >
                <option value="latest">ล่าสุด</option>
                <option value="expiresSoon">ใกล้หมดอายุ</option>
                <option value="rewardHigh">รางวัลสูงสุด</option>
              </select>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <X className="h-4 w-4" /> ล้างตัวกรอง
              </button>
            </div>
          </div>
        </div>

        {/* List: Table (desktop) */}
        <div className="hidden md:block">
          <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
            <table className="w-full min-w-[1000px] text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs text-slate-700 uppercase">
                <tr>
                  <th className="sticky top-0 z-10 bg-slate-50 px-6 py-3">
                    ชื่อภารกิจ
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-50 px-6 py-3">
                    ประเภท
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-50 px-6 py-3">
                    รางวัล
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-50 px-6 py-3">
                    กำหนด (วัน)
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-50 px-6 py-3">
                    เป้าความคืบหน้า
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-50 px-6 py-3">
                    หมดอายุ
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-50 px-6 py-3">
                    Enrolled
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-50 px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((m) => {
                  const expired = isExpired(m.webExpiresAt);
                  const left = daysLeft(m.webExpiresAt);
                  return (
                    <tr key={m.id} className="bg-white hover:bg-slate-50">
                      <td className="max-w-[320px] px-6 py-4">
                        <div className="truncate font-semibold text-slate-900">
                          {m.title}
                        </div>
                        <div className="truncate text-xs text-slate-500">
                          {m.description || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-800">
                          {m.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatTHB(m.rewardAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {m.durationDays} วัน
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {m.completeProgress}
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
                        {m.enrolledBy?.length || 0}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => handleEdit(m)}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <Pencil className="mr-1 inline h-4 w-4" /> แก้ไข
                          </button>
                          <button
                            onClick={() => handleDelete(m.id)}
                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                          >
                            <Trash2 className="mr-1 inline h-4 w-4" /> ลบ
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

        {/* Mobile list */}
        <div className="md:hidden">
          <ul className="space-y-3">
            {filtered.map((m) => {
              const expired = isExpired(m.webExpiresAt);
              const left = daysLeft(m.webExpiresAt);
              return (
                <li
                  key={m.id}
                  className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
                >
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-900">
                        {m.title}
                      </div>
                      <div className="text-xs text-slate-500">
                        {m.description || "-"}
                      </div>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-800">
                      {m.type}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div className="text-slate-500">รางวัล</div>
                    <div className="text-right font-semibold">
                      {formatTHB(m.rewardAmount)}
                    </div>
                    <div className="text-slate-500">กำหนด (วัน)</div>
                    <div className="text-right">{m.durationDays}</div>
                    <div className="text-slate-500">เป้าความคืบหน้า</div>
                    <div className="text-right">{m.completeProgress}</div>
                    <div className="text-slate-500">สถานะ</div>
                    <div className="text-right">
                      {expired ? (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                          หมดอายุแล้ว
                        </span>
                      ) : (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                          เหลือ {left} วัน
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(m)}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <Pencil className="mr-1 inline h-4 w-4" /> แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="mr-1 inline h-4 w-4" /> ลบ
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Modal */}
      <MissionFormModal
        open={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSubmit={upsertMission}
      />
    </div>
  );
}
