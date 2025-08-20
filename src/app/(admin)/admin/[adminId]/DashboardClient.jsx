"use client";
import Link from "next/link";
import {
  Users,
  Wallet,
  ClipboardList,
  Flame,
  UserPlus,
  ArrowDownCircle,
  Award,
  Home,
  Repeat,
  Bell,
  MessageSquare,
  TabletSmartphone,
} from "lucide-react";
import { useGetAdminDashboardData } from "@/hooks/useAdmin";
import DashboardSkeleton from "./components/DashboardSkeleton";
import StatCard from "./components/StatCard";

export default function DashboardClient({ userId }) {
  // --- 1. เรียกใช้ Hook เพื่อดึงข้อมูล ---
  const { data, isLoading, isError, error } = useGetAdminDashboardData();

  // --- 2. สร้างรายการเมนู (ใช้ userId ที่รับมาจาก props) ---
  const adminNavItems = [
    {
      href: `/`,
      label: "หน้าหลัก (User View)",
      icon: <Home className="h-5 w-5" />,
      color: "text-sky-600",
    },
    {
      href: `/admin/${userId}/users`,
      label: "จัดการผู้ใช้",
      icon: <Users className="h-5 w-5" />,
      color: "text-blue-600",
    },
    {
      href: `/admin/${userId}/transactions`,
      label: "จัดการธุรกรรม",
      icon: <Repeat className="h-5 w-5" />,
      color: "text-orange-600",
    },
    {
      href: `/admin/${userId}/missions`,
      label: "จัดการภารกิจ",
      icon: <Flame className="h-5 w-5" />,
      color: "text-red-600",
    },
    {
      href: `/admin/${userId}/notifications`,
      label: "ส่งการแจ้งเตือน",
      icon: <Bell className="h-5 w-5" />,
      color: "text-purple-600",
    },
    {
      href: `/admin/${userId}/line`,
      label: "ตั้งค่า LINE",
      icon: <MessageSquare className="h-5 w-5" />,
      color: "text-green-600",
    },
    {
      href: `/admin/${userId}/products`,
      label: "ตั้งค่ารุ่นมือถือ",
      icon: <TabletSmartphone className="h-5 w-5" />,
      color: "text-green-600",
    },
  ];

  // --- 3. จัดการสถานะการโหลดข้อมูล ---
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // --- 4. จัดการสถานะ Error ---
  if (isError || !data) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center text-red-700">
        <h2 className="text-lg font-bold">เกิดข้อผิดพลาดในการโหลดข้อมูล</h2>
        <p className="mt-2 text-sm">
          {error instanceof Error
            ? error.message
            : "กรุณาลองรีเฟรชหน้าอีกครั้ง"}
        </p>
      </div>
    );
  }

  // --- 5. เมื่อมีข้อมูลแล้ว Render UI หลัก ---
  return (
    <main>
      {/* === Summary Cards Section === */}
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="ผู้ใช้งานทั้งหมด"
          value={data.summary.totalUsers}
          icon={<Users className="h-6 w-6 text-blue-600" />}
          color="bg-blue-100"
        />
        <StatCard
          title="ยอดเงินออมในระบบ"
          value={`฿${data.summary.totalSavingsBalance}`}
          icon={<Wallet className="h-6 w-6 text-green-600" />}
          color="bg-green-100"
        />
        <StatCard
          title="รายการรอตรวจสอบ"
          value={data.summary.pendingTransactionsCount}
          icon={<ClipboardList className="h-6 w-6 text-orange-600" />}
          color="bg-orange-100"
        />
        <StatCard
          title="ภารกิจที่กำลังดำเนินอยู่"
          value={data.summary.activeMissionsCount}
          icon={<Flame className="h-6 w-6 text-red-600" />}
          color="bg-red-100"
        />
      </div>

      {/* === Quick Navigation Menu === */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900">เมนูการจัดการ</h2>
        <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-xl bg-white p-4 text-center shadow-sm transition-all hover:bg-gray-100 hover:shadow-md"
            >
              <div
                className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-white ${item.color}`}
              >
                {item.icon}
              </div>
              <p className="mt-3 text-sm font-semibold text-gray-800">
                {item.label}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* === Monthly Activity Section === */}
      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          กิจกรรมในเดือนนี้
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          ข้อมูลสรุปการเติบโตและกิจกรรมตั้งแต่ต้นเดือน
        </p>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 border-t border-gray-200 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
              <UserPlus className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">ผู้ใช้ใหม่เดือนนี้</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.monthlyActivity.newUsersThisMonth.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
              <ArrowDownCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">ยอดออมเข้าเดือนนี้</p>
              <p className="text-2xl font-bold text-gray-900">
                ฿{data.monthlyActivity.depositsThisMonth.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">รางวัลที่แจกเดือนนี้</p>
              <p className="text-2xl font-bold text-gray-900">
                ฿{data.monthlyActivity.rewardsPaidThisMonth.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
