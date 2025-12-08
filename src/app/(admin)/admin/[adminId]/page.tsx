import { PlusCircle } from "lucide-react";

import DashboardClient from "./DashboardClient";

export default function Page({ params }) {
  const { adminId } = params;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* === Header (ยังคงอยู่ใน Server Component ได้) === */}
        <header className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              แอดมิน แดชบอร์ด
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              ภาพรวมทั้งหมดของระบบในวันนี้
            </p>
          </div>
        </header>

        {/* === (3) เรียกใช้ Client Component และส่ง props ที่จำเป็นไปให้ === */}
        <DashboardClient userId={adminId} />
      </div>
    </div>
  );
}
