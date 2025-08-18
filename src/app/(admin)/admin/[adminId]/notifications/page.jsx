"use client";
import React, { useMemo, useState } from "react";
import {
  ChevronLeft,
  Bell,
  Megaphone,
  Gift,
  Settings,
  Search,
  ListFilter,
  Plus,
  Send,
  Save,
  Trash2,
  Pencil,
  X,
  CalendarClock,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

/* =========================================================
   Types / Enums (align กับ Prisma)
========================================================= */
const NotificationType = {
  WALLET: "WALLET",
  REWARD: "REWARD",
  SYSTEM: "SYSTEM",
};

const Audience = {
  ALL: "ALL",
  ACTIVE: "ACTIVE", // isLocked = false
  LOCKED: "LOCKED", // isLocked = true
  ADMINS: "ADMINS",
  SINGLE_USER: "SINGLE_USER", // ระบุ userId
};

const DraftStatus = {
  DRAFT: "DRAFT",
  SCHEDULED: "SCHEDULED",
  SENT: "SENT",
};

/* =========================================================
   Mock data (แทน API จริงระหว่างพัฒนา)
========================================================= */
const seed = [
  {
    id: "n1",
    title: "โปรพิเศษรับเปิดเทอม",
    body: "เติมเงินครบ 500 รับโบนัส 50 บาท",
    type: NotificationType.WALLET,
    audience: Audience.ALL,
    status: DraftStatus.SENT,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    sendAt: new Date(Date.now() - 1000 * 60 * 60 * 35).toISOString(),
  },
  {
    id: "n2",
    title: "รางวัลรออยู่!",
    body: "คุณทำภารกิจครบแล้ว กดรับรางวัลได้ใน 24 ชั่วโมง",
    type: NotificationType.REWARD,
    audience: Audience.ACTIVE,
    status: DraftStatus.SCHEDULED,
    createdAt: new Date().toISOString(),
    sendAt: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(), // +2 ชั่วโมง
  },
];

/* =========================================================
   Small UI atoms
========================================================= */
const Stat = ({ icon, label, value, color }) => (
  <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
    <div className="flex items-center gap-3">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full ${color}`}
      >
        {icon}
      </div>
      <div>
        <div className="text-sm text-slate-500">{label}</div>
        <div className="text-xl font-bold text-slate-900">{value}</div>
      </div>
    </div>
  </div>
);

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

const TypeBadge = ({ type }) => {
  const map = {
    WALLET: { text: "WALLET", cls: "bg-blue-100 text-blue-700" },
    REWARD: { text: "REWARD", cls: "bg-green-100 text-green-700" },
    SYSTEM: { text: "SYSTEM", cls: "bg-slate-100 text-slate-700" },
  };
  const t = map[type] || map.SYSTEM;
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${t.cls}`}>
      {t.text}
    </span>
  );
};

/* =========================================================
   Live Preview card
========================================================= */
const PreviewCard = ({ title, body, type }) => (
  <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
    <div className="mb-2 flex items-center gap-2 text-slate-400">
      {type === NotificationType.REWARD ? (
        <Gift className="h-4 w-4" />
      ) : type === NotificationType.WALLET ? (
        <WalletIcon />
      ) : (
        <Bell className="h-4 w-4" />
      )}
      <span className="text-xs">ตัวอย่างการแสดงผล</span>
    </div>
    <div className="flex items-start gap-3">
      <div className="mt-1 h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-pink-100 to-orange-100"></div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="truncate font-semibold text-slate-900">
            {title || "(ไม่มีชื่อเรื่อง)"}
          </div>
          <TypeBadge type={type} />
        </div>
        <div className="mt-0.5 text-sm break-words whitespace-pre-wrap text-slate-700">
          {body || "(ไม่มีเนื้อหา)"}
        </div>
      </div>
    </div>
  </div>
);

const WalletIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    <path d="M21 5H8a3 3 0 0 0-3 3v0a3 3 0 0 0 3 3h13z" />
  </svg>
);

/* =========================================================
   Main Page
========================================================= */
export default function AdminNotificationsPage() {
  const router = useRouter();

  // left: create & list
  const [items, setItems] = useState(seed);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [editingId, setEditingId] = useState(null);

  // compose form
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [nType, setNType] = useState(NotificationType.SYSTEM);
  const [audience, setAudience] = useState(Audience.ALL);
  const [targetUserId, setTargetUserId] = useState("");
  const [sendAt, setSendAt] = useState("");

  // right: config
  const [retentionDays, setRetentionDays] = useState(30);
  const [defaultType, setDefaultType] = useState(NotificationType.SYSTEM);
  const [confirmBeforeSend, setConfirmBeforeSend] = useState(true);

  const stats = useMemo(() => {
    const total = items.length;
    const scheduled = items.filter(
      (i) => i.status === DraftStatus.SCHEDULED,
    ).length;
    const sent = items.filter((i) => i.status === DraftStatus.SENT).length;
    return { total, scheduled, sent };
  }, [items]);

  const filtered = useMemo(() => {
    let list = [...items];
    if (typeFilter !== "ALL") list = list.filter((i) => i.type === typeFilter);
    if (statusFilter !== "ALL")
      list = list.filter((i) => i.status === statusFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) || i.body.toLowerCase().includes(q),
      );
    }
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }, [items, typeFilter, statusFilter, search]);

  const clearCompose = () => {
    setTitle("");
    setBody("");
    setNType(defaultType);
    setAudience(Audience.ALL);
    setTargetUserId("");
    setSendAt("");
    setEditingId(null);
  };

  const handleSaveDraft = () => {
    if (!title.trim()) return alert("กรุณากรอกชื่อเรื่อง");
    const payload = {
      id: editingId || `n_${Date.now()}`,
      title,
      body,
      type: nType,
      audience,
      status: DraftStatus.DRAFT,
      createdAt: new Date().toISOString(),
      sendAt: sendAt ? new Date(sendAt).toISOString() : null,
      targetUserId:
        audience === Audience.SINGLE_USER ? targetUserId : undefined,
    };
    if (editingId) {
      setItems((prev) =>
        prev.map((x) => (x.id === editingId ? { ...x, ...payload } : x)),
      );
    } else {
      setItems((prev) => [payload, ...prev]);
    }
    clearCompose();
  };

  const handleSendNow = () => {
    if (!title.trim()) return alert("กรุณากรอกชื่อเรื่อง");
    if (audience === Audience.SINGLE_USER && !targetUserId.trim())
      return alert("กรุณาระบุ User ID");
    const payload = {
      id: editingId || `n_${Date.now()}`,
      title,
      body,
      type: nType,
      audience,
      status: DraftStatus.SENT,
      createdAt: new Date().toISOString(),
      sendAt: new Date().toISOString(),
      targetUserId:
        audience === Audience.SINGLE_USER ? targetUserId : undefined,
    };
    if (editingId) {
      setItems((prev) =>
        prev.map((x) => (x.id === editingId ? { ...x, ...payload } : x)),
      );
    } else {
      setItems((prev) => [payload, ...prev]);
    }
    clearCompose();
  };

  const handleSchedule = () => {
    if (!title.trim()) return alert("กรุณากรอกชื่อเรื่อง");
    if (!sendAt) return alert("กรุณาเลือกเวลาส่ง");
    const payload = {
      id: editingId || `n_${Date.now()}`,
      title,
      body,
      type: nType,
      audience,
      status: DraftStatus.SCHEDULED,
      createdAt: new Date().toISOString(),
      sendAt: new Date(sendAt).toISOString(),
      targetUserId:
        audience === Audience.SINGLE_USER ? targetUserId : undefined,
    };
    if (editingId) {
      setItems((prev) =>
        prev.map((x) => (x.id === editingId ? { ...x, ...payload } : x)),
      );
    } else {
      setItems((prev) => [payload, ...prev]);
    }
    clearCompose();
  };

  const handleEdit = (it) => {
    setEditingId(it.id);
    setTitle(it.title);
    setBody(it.body);
    setNType(it.type);
    setAudience(it.audience || Audience.ALL);
    setTargetUserId(it.targetUserId || "");
    setSendAt(it.sendAt ? new Date(it.sendAt).toISOString().slice(0, 16) : "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (!confirm("ลบการแจ้งเตือนนี้?")) return;
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  const applyRetention = () => {
    const now = Date.now();
    const keepMs = Number(retentionDays) * 24 * 60 * 60 * 1000;
    setItems((prev) =>
      prev.filter((x) => now - new Date(x.createdAt).getTime() <= keepMs),
    );
    alert(
      `ตั้งค่าระยะเวลาลบอัตโนมัติ: ${retentionDays} วัน (จะมีผลกับข้อมูลในเครื่อง/หน้านี้ และควรใช้กับ backend ด้วย)`,
    );
  };

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
                จัดการการแจ้งเตือน
              </h1>
              <p className="text-sm text-slate-500">
                สร้าง/ส่งการแจ้งเตือน (โปรโมชั่น, รางวัล, ระบบ) และตั้งค่า
                retention
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Stat
            icon={<Bell className="h-5 w-5 text-pink-600" />}
            label="ทั้งหมด"
            value={stats.total}
            color="bg-pink-100"
          />
          <Stat
            icon={<CalendarClock className="h-5 w-5 text-orange-600" />}
            label="กำหนดส่งไว้"
            value={stats.scheduled}
            color="bg-orange-100"
          />
          <Stat
            icon={<Users className="h-5 w-5 text-green-600" />}
            label="ส่งแล้ว"
            value={stats.sent}
            color="bg-green-100"
          />
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: Compose + List */}
          <div className="space-y-6 lg:col-span-2">
            {/* Compose */}
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-pink-600" />
                  <h2 className="text-lg font-semibold text-slate-900">
                    สร้างการแจ้งเตือน
                  </h2>
                </div>
                {editingId && (
                  <button
                    onClick={clearCompose}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <X className="h-4 w-4" /> ยกเลิกแก้ไข
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="text-sm text-slate-600">หัวข้อ</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
                    placeholder="เช่น โปรรับเปิดเทอม, แจ้งเตือนรางวัล"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm text-slate-600">รายละเอียด</label>
                  <textarea
                    rows={4}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
                    placeholder={"พิมพ์ข้อความแจ้งเตือนให้ผู้ใช้ทราบ…"}
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-600">ประเภท</label>
                  <select
                    value={nType}
                    onChange={(e) => setNType(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
                  >
                    {Object.keys(NotificationType).map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-slate-600">
                    กลุ่มเป้าหมาย
                  </label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
                  >
                    {Object.keys(Audience).map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>

                {audience === Audience.SINGLE_USER && (
                  <div className="md:col-span-2">
                    <label className="text-sm text-slate-600">
                      User ID เป้าหมาย
                    </label>
                    <input
                      value={targetUserId}
                      onChange={(e) => setTargetUserId(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
                      placeholder="เช่น 68a05de8beea7095b825bfff"
                    />
                  </div>
                )}

                <div>
                  <label className="text-sm text-slate-600">
                    กำหนดเวลาส่ง (ไม่บังคับ)
                  </label>
                  <input
                    type="datetime-local"
                    value={sendAt}
                    onChange={(e) => setSendAt(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:col-span-2">
                  <button
                    onClick={handleSaveDraft}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Save className="h-4 w-4" /> บันทึกแบบร่าง
                  </button>
                  <button
                    onClick={handleSchedule}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-100"
                  >
                    <CalendarClock className="h-4 w-4" /> ตั้งเวลาส่ง
                  </button>
                  <button
                    onClick={handleSendNow}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-110"
                  >
                    <Send className="h-4 w-4" /> ส่งเลย
                  </button>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-5">
                <PreviewCard title={title} body={body} type={nType} />
              </div>
            </div>

            {/* List: search + filters */}
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:w-1/2">
                  <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="ค้นหาในหัวข้อ/รายละเอียด…"
                    className="w-full rounded-lg border border-slate-200 py-2 pr-3 pl-9 text-sm text-slate-800 placeholder:text-slate-400 focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600">
                    <ListFilter className="h-4 w-4" /> ประเภท
                  </span>
                  {["ALL", ...Object.keys(NotificationType)].map((t) => (
                    <Chip
                      key={t}
                      active={typeFilter === t}
                      onClick={() => setTypeFilter(t)}
                    >
                      {t}
                    </Chip>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600">
                    <ListFilter className="h-4 w-4" /> สถานะ
                  </span>
                  {["ALL", ...Object.keys(DraftStatus)].map((s) => (
                    <Chip
                      key={s}
                      active={statusFilter === s}
                      onClick={() => setStatusFilter(s)}
                    >
                      {s}
                    </Chip>
                  ))}
                </div>
              </div>

              {/* Table (desktop) */}
              <div className="hidden md:block">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs text-slate-700 uppercase">
                      <tr>
                        <th className="sticky top-0 z-10 bg-slate-50 px-6 py-3">
                          หัวข้อ
                        </th>
                        <th className="sticky top-0 z-10 bg-slate-50 px-6 py-3">
                          ประเภท
                        </th>
                        <th className="sticky top-0 z-10 bg-slate-50 px-6 py-3">
                          สถานะ
                        </th>
                        <th className="sticky top-0 z-10 bg-slate-50 px-6 py-3">
                          กำหนดส่ง
                        </th>
                        <th className="sticky top-0 z-10 bg-slate-50 px-6 py-3">
                          สร้างเมื่อ
                        </th>
                        <th className="sticky top-0 z-10 bg-slate-50 px-6 py-3">
                          <span className="sr-only">actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filtered.map((it) => (
                        <tr key={it.id} className="bg-white hover:bg-slate-50">
                          <td className="max-w-[320px] px-6 py-4">
                            <div className="truncate font-semibold text-slate-900">
                              {it.title}
                            </div>
                            <div className="truncate text-xs text-slate-500">
                              {it.body}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <TypeBadge type={it.type} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                it.status === DraftStatus.SENT
                                  ? "bg-green-100 text-green-700"
                                  : it.status === DraftStatus.SCHEDULED
                                    ? "bg-orange-100 text-orange-700"
                                    : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {it.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {it.sendAt
                              ? new Date(it.sendAt).toLocaleString("th-TH")
                              : "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(it.createdAt).toLocaleString("th-TH")}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex gap-2">
                              <button
                                onClick={() => handleEdit(it)}
                                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                              >
                                <Pencil className="mr-1 inline h-4 w-4" /> แก้ไข
                              </button>
                              <button
                                onClick={() => handleDelete(it.id)}
                                className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                              >
                                <Trash2 className="mr-1 inline h-4 w-4" /> ลบ
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile list */}
              <div className="md:hidden">
                <ul className="divide-y divide-slate-100">
                  {filtered.map((it) => (
                    <li key={it.id} className="flex items-start gap-3 p-4">
                      <div className="mt-1 h-9 w-9 flex-shrink-0 rounded-full bg-gradient-to-br from-pink-100 to-orange-100" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="truncate font-semibold text-slate-900">
                            {it.title}
                          </div>
                          <TypeBadge type={it.type} />
                        </div>
                        <div className="truncate text-xs text-slate-500">
                          {it.body}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          ส่ง:{" "}
                          {it.sendAt
                            ? new Date(it.sendAt).toLocaleString("th-TH")
                            : "-"}
                        </div>
                        <div className="mt-1">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                              it.status === DraftStatus.SENT
                                ? "bg-green-100 text-green-700"
                                : it.status === DraftStatus.SCHEDULED
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {it.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleEdit(it)}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          แก้ไข
                        </button>
                        <button
                          onClick={() => handleDelete(it.id)}
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                        >
                          ลบ
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right: Config (sticky) */}
          <aside className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <div className="mb-3 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-slate-700" />
                  <h3 className="text-base font-semibold text-slate-900">
                    ตั้งค่า
                  </h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-600">
                      ลบอัตโนมัติหลัง (วัน)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={retentionDays}
                      onChange={(e) => setRetentionDays(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      ใช้เป็น retention policy สำหรับ backend ด้วย
                    </p>
                    <button
                      onClick={applyRetention}
                      className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      ใช้ค่ากับรายการปัจจุบัน
                    </button>
                  </div>

                  <div>
                    <label className="text-sm text-slate-600">
                      ประเภทเริ่มต้น
                    </label>
                    <select
                      value={defaultType}
                      onChange={(e) => setDefaultType(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
                    >
                      {Object.keys(NotificationType).map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-slate-500">
                      จะถูกใช้เมื่อเริ่มสร้างการแจ้งเตือนใหม่
                    </p>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        ยืนยันก่อนส่ง
                      </div>
                      <div className="text-xs text-slate-500">
                        แสดงกล่องยืนยันเมื่อกด "ส่งเลย"
                      </div>
                    </div>
                    <button
                      onClick={() => setConfirmBeforeSend((v) => !v)}
                      className={`relative h-6 w-11 rounded-full transition ${confirmBeforeSend ? "bg-pink-500" : "bg-slate-300"}`}
                      aria-pressed={confirmBeforeSend}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${confirmBeforeSend ? "left-6" : "left-0.5"}`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <div className="mb-3 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-pink-600" />
                  <h3 className="text-base font-semibold text-slate-900">
                    พรีวิวล่าสุด
                  </h3>
                </div>
                <PreviewCard title={title} body={body} type={nType} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
