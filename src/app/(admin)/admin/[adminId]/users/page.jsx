"use client";
import React, { useMemo, useState } from "react";
import {
  ChevronLeft,
  Search,
  Users,
  Shield,
  UserX,
  Wallet,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

/* =========================================================
   Mock data (เหมือนเดิม)
========================================================= */
const mockUsers = [
  {
    id: "68a05de8beea7095b825bfff",
    line_user_id: "U006fb519ba07650932c6981af95d0620",
    line_display_name: "Long👁️‍🗨️",
    fullname: "นาคเสน พุทธเจริญ",
    occupation: "นักศึกษา",
    phone: "0987454366",
    ageRange: "15-20",
    line_profile_url:
      "https://profile.line-scdn.net/0hPsTql5LvD1x5CB7EtsVxYglYglYDDZaeVZOVjxHahgOUGhMPU9ZVDxIORwJAj5BOhxZAWxBakoIV21bTUB3DWgHYz9BU24mUxsKPhhEezdwJwJNQTdDFRZGXRB2BRAsbhxKUDFHXDVTUDIMbD5jU2oBcTpMFWpFQCxrN19jCnw6Yd8WCngJVG9GOE4BU2_M",
    monthlyPayment: 1200,
    isLocked: false,
    referralCode: "IVRKC6",
    firstTime: false,
    wallet: { balance: 1, bonusBalance: 101 },
    madeReferrals: [{ newcomerId: "..." }],
    createdAt: "2025-08-16T10:31:04.239Z",
    role: "ADMIN",
    goal: { product: { model: "iPhone 11" } },
    userMissions: [{ status: "ENROLLED" }, { status: "ENROLLED" }],
  },
  {
    id: "68a05de8beea7095b825c111",
    line_user_id: "U1234567890abcdefghij",
    line_display_name: "TestUser",
    fullname: "สมชาย ใจดี",
    occupation: "พนักงานออฟฟิศ",
    phone: "0812345678",
    ageRange: "25-30",
    line_profile_url: null,
    monthlyPayment: 5000,
    isLocked: true,
    referralCode: "TEST01",
    firstTime: true,
    wallet: { balance: 1500, bonusBalance: 50 },
    madeReferrals: [],
    createdAt: "2025-08-15T09:00:00.000Z",
    role: "USER",
    goal: { product: { model: "Galaxy S25" } },
    userMissions: [],
  },
  {
    id: "68a05de8beea7095b825c222",
    line_user_id: "U9876543210jihgfedcba",
    line_display_name: "JaneDoe",
    fullname: "สมศรี มีสุข",
    occupation: "ฟรีแลนซ์",
    phone: "0898765432",
    ageRange: "21-24",
    line_profile_url: "https://profile.line-scdn.net/0hR9Z...example",
    monthlyPayment: 3500,
    isLocked: false,
    referralCode: "JANE02",
    firstTime: false,
    wallet: { balance: 8250, bonusBalance: 200 },
    madeReferrals: [{ newcomerId: "..." }, { newcomerId: "..." }],
    createdAt: "2025-08-14T14:20:10.000Z",
    role: "USER",
    goal: { product: { model: "iPad Air" } },
    userMissions: [{ status: "ENROLLED" }],
  },
];

/* =========================================================
   Small UI atoms
========================================================= */
const StatCard = ({ title, value, icon, color }) => (
  <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
    <div className="flex items-center gap-4">
      <div
        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const UserDetailModal = ({ user, onClose }) => {
  if (!user) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="max-h-[90vh] w-[90%] max-w-2xl overflow-y-auto rounded-2xl bg-gray-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/80 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Image
              src={user.line_profile_url || "/default-avatar.png"}
              width={40}
              height={40}
              className="rounded-full object-cover"
              alt="Profile"
            />
            <div>
              <h3 className="font-bold text-gray-900">
                {user.fullname || user.line_display_name}
              </h3>
              <span className="text-xs text-gray-500">
                {user.role === "ADMIN" ? "ผู้ดูแลระบบ" : "ผู้ใช้งาน"}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-200"
            aria-label="ปิด"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
          {/* Column 1: Core Info */}
          <div className="space-y-4 md:col-span-1">
            <h4 className="font-semibold text-gray-700">ข้อมูลส่วนตัว</h4>
            <div className="text-sm">
              <p className="text-gray-500">ชื่อ-สกุล</p>
              <p className="font-medium text-gray-800">
                {user.fullname || "-"}
              </p>
            </div>
            <div className="text-sm">
              <p className="text-gray-500">เบอร์โทรศัพท์</p>
              <p className="font-medium text-gray-800">{user.phone || "-"}</p>
            </div>
            <div className="text-sm">
              <p className="text-gray-500">อาชีพ</p>
              <p className="font-medium text-gray-800">
                {user.occupation || "-"}
              </p>
            </div>
            <div className="text-sm">
              <p className="text-gray-500">สถานะ</p>
              <span
                className={`rounded-full px-2 py-1 text-xs ${user.isLocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
              >
                {user.isLocked ? "ถูกระงับ" : "ปกติ"}
              </span>
            </div>
          </div>

          {/* Column 2: Goal & Wallet */}
          <div className="space-y-4 md:col-span-1">
            <h4 className="font-semibold text-gray-700">เป้าหมายและ Wallet</h4>
            <div className="text-sm">
              <p className="text-gray-500">เป้าหมายปัจจุบัน</p>
              <p className="font-medium text-gray-800">
                {user.goal?.product?.model || "ยังไม่มี"}
              </p>
            </div>
            <div className="text-sm">
              <p className="text-gray-500">ยอดเงินใน Wallet</p>
              <p className="text-lg font-bold text-green-600">
                ฿{user.wallet?.balance?.toLocaleString() || 0}
              </p>
            </div>
            <div className="text-sm">
              <p className="text-gray-500">ยอดโบนัส</p>
              <p className="font-medium text-gray-800">
                ฿{user.wallet?.bonusBalance?.toLocaleString() || 0}
              </p>
            </div>
          </div>

          {/* Column 3: Activity */}
          <div className="space-y-4 md:col-span-1">
            <h4 className="font-semibold text-gray-700">กิจกรรม</h4>
            <div className="text-sm">
              <p className="text-gray-500">ภารกิจที่กำลังทำ</p>
              <p className="font-medium text-gray-800">
                {user.userMissions?.filter((m) => m.status === "ENROLLED")
                  .length || 0}{" "}
                รายการ
              </p>
            </div>
            <div className="text-sm">
              <p className="text-gray-500">เชิญเพื่อนสำเร็จ</p>
              <p className="font-medium text-gray-800">
                {user.madeReferrals?.length || 0} คน
              </p>
            </div>
            <div className="text-sm">
              <p className="text-gray-500">สมัครเมื่อ</p>
              <p className="font-medium text-gray-800">
                {new Date(user.createdAt).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   Main Page
========================================================= */
export default function Page() {
  const [users] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const router = useRouter();

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const lower = searchTerm.toLowerCase();
    return users.filter(
      (u) =>
        u.fullname?.toLowerCase().includes(lower) ||
        u.line_display_name?.toLowerCase().includes(lower) ||
        u.phone?.includes(searchTerm),
    );
  }, [users, searchTerm]);

  const stats = useMemo(() => {
    const totalAdmins = users.filter((u) => u.role === "ADMIN").length;
    const lockedUsers = users.filter((u) => u.isLocked).length;
    const totalBalance = users.reduce(
      (acc, u) => acc + (u.wallet?.balance || 0),
      0,
    );
    return { totalAdmins, lockedUsers, totalBalance };
  }, [users]);

  const handleBack = () => router.back();

  return (
    <div className="min-h-dvh bg-gray-50">
      {/* Container คุมความกว้างให้สมส่วน */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="rounded-full p-2 text-slate-700 transition hover:bg-slate-100"
              aria-label="ย้อนกลับ"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                จัดการผู้ใช้งาน
              </h1>
              <p className="text-sm text-slate-500">
                ดู, ค้นหา, และแก้ไขข้อมูลผู้ใช้ทั้งหมดในระบบ
              </p>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="ผู้ใช้ทั้งหมด"
            value={users.length}
            icon={<Users className="h-5 w-5 text-blue-600" />}
            color="bg-blue-100"
          />
          <StatCard
            title="ผู้ดูแลระบบ"
            value={stats.totalAdmins}
            icon={<Shield className="h-5 w-5 text-violet-600" />}
            color="bg-violet-100"
          />
          <StatCard
            title="บัญชีถูกระงับ"
            value={stats.lockedUsers}
            icon={<UserX className="h-5 w-5 text-red-600" />}
            color="bg-red-100"
          />
          <StatCard
            title="ยอดเงินออมรวม"
            value={`฿${stats.totalBalance.toLocaleString()}`}
            icon={<Wallet className="h-5 w-5 text-green-600" />}
            color="bg-green-100"
          />
        </div>

        {/* Card: Search + List */}
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
          {/* Toolbar */}
          <div className="flex flex-col items-center justify-between gap-4 border-b p-4 md:flex-row">
            <div className="relative w-full md:w-1/2">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="ค้นหาด้วยชื่อ, LINE ID, หรือเบอร์โทร..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-200 py-2 pr-3 pl-9 text-sm text-slate-800 placeholder:text-slate-400 focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs text-slate-700 uppercase">
                  <tr>
                    <th className="sticky top-0 z-10 bg-slate-50 px-6 py-3">
                      ผู้ใช้งาน
                    </th>
                    <th className="sticky top-0 z-10 bg-slate-50 px-6 py-3">
                      เบอร์โทรศัพท์
                    </th>
                    <th className="sticky top-0 z-10 bg-slate-50 px-6 py-3">
                      ยอดเงิน
                    </th>
                    <th className="sticky top-0 z-10 bg-slate-50 px-6 py-3">
                      สถานะ
                    </th>
                    <th className="sticky top-0 z-10 bg-slate-50 px-6 py-3">
                      Role
                    </th>
                    <th className="sticky top-0 z-10 bg-slate-50 px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="bg-white hover:bg-slate-50">
                      <th scope="row" className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Image
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.line_profile_url || "/default-avatar.png"}
                            alt="Profile image"
                            width={40}
                            height={40}
                          />
                          <div className="min-w-0">
                            <div className="truncate text-base font-semibold text-slate-900">
                              {user.fullname || user.line_display_name}
                            </div>
                            <div className="truncate text-sm text-slate-500">
                              {user.line_display_name}
                            </div>
                          </div>
                        </div>
                      </th>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.phone || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ฿{user.wallet?.balance?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span
                            className={`mr-2 inline-block h-2.5 w-2.5 rounded-full ${user.isLocked ? "bg-red-500" : "bg-green-500"}`}
                          />
                          {user.isLocked ? "ถูกระงับ" : "ปกติ"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${user.role === "ADMIN" ? "bg-violet-100 text-violet-800" : "bg-slate-100 text-slate-800"}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          ดูข้อมูล
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden">
            <ul className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <li key={user.id} className="flex items-center gap-3 p-4">
                  <Image
                    className="h-12 w-12 rounded-full object-cover"
                    src={user.line_profile_url || "/default-avatar.png"}
                    alt="Profile image"
                    width={48}
                    height={48}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold text-slate-900">
                      {user.fullname || user.line_display_name}
                    </div>
                    <div className="truncate text-sm text-slate-500">
                      {user.phone || "-"}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs">
                      <span
                        className={`rounded-full px-2 py-0.5 ${user.isLocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                      >
                        {user.isLocked ? "ถูกระงับ" : "ปกติ"}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 ${user.role === "ADMIN" ? "bg-violet-100 text-violet-800" : "bg-slate-100 text-slate-800"}`}
                      >
                        {user.role}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="rounded-lg bg-pink-500 px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-white shadow-sm hover:brightness-110"
                  >
                    ดูข้อมูล
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Modal */}
      <UserDetailModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}
