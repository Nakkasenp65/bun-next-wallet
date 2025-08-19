"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  Loader2,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ShieldCheck,
  User,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useGetAdminUsers, useUpdateAdminUser } from "@/hooks/useUser"; // ตรวจสอบว่า path ถูกต้อง
import UserDetailsModal from "./components/UserDetailsModal";
import { useDebounce } from "use-debounce";

/* =========================================================
   UI Sub-components
========================================================= */

const RoleTag = ({ role }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${role === "ADMIN" ? "bg-pink-100 text-pink-800" : "bg-blue-100 text-blue-800"}`}
  >
    {role === "ADMIN" ? (
      <ShieldCheck className="h-3 w-3" />
    ) : (
      <User className="h-3 w-3" />
    )}
    {role}
  </span>
);

const UserCard = ({ user, onOpenModal }) => (
  <li className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <Image
          src={user.line_profile_url || "/placeholder-avatar.png"}
          alt={user.line_display_name || "User Avatar"}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <p className="font-semibold text-slate-800">
            {user.line_display_name || user.fullname}
          </p>
          <p className="text-xs text-slate-400">
            เข้าร่วม: {new Date(user.createdAt).toLocaleDateString("th-TH")}
          </p>
        </div>
      </div>
      <RoleTag role={user.role} />
    </div>
    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
      <div>
        <p className="text-xs text-slate-500">ยอดเงิน</p>
        <p className="mt-1 font-bold text-slate-900">
          ฿{user.wallet?.balance?.toLocaleString() || 0}
        </p>
      </div>
      <button
        onClick={() => onOpenModal(user.line_user_id)}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
      >
        แก้ไข / ดู
      </button>
    </div>
  </li>
);

const Toolbar = ({ onSearchChange }) => {
  return (
    <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
      <div className="relative lg:w-1/2">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="ค้นหาด้วยชื่อ..."
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-3 pl-9 text-sm focus:ring-2 focus:ring-pink-400 focus:outline-none"
        />
      </div>
    </div>
  );
};

/* =========================================================
   Main Page Component
========================================================= */
export default function AdminUsersPage() {
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    search: "",
  });
  const [debouncedSearch] = useDebounce(filters.search, 300);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const router = useRouter();
  const queryFilters = { ...filters, search: debouncedSearch };
  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
  } = useGetAdminUsers(queryFilters);
  const { mutate: updateUser, isLoading: isUpdating } = useUpdateAdminUser();

  console.log("Users: ", apiResponse);

  const users = apiResponse?.data || [];
  const paging = apiResponse?.paging || {};

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= (paging.totalPages || 1)) {
      setFilters((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleUpdateUser = ({ userId, payload }, options) => {
    updateUser(
      { userId, payload },
      {
        onSuccess: () => {
          if (options?.onSuccess) options.onSuccess();
          setSelectedUserId(null); // Close modal on success
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* --- Header --- */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">จัดการผู้ใช้</h1>
            <p className="text-sm text-gray-500">
              ตรวจสอบและจัดการข้อมูลผู้ใช้ในระบบ
            </p>
          </div>
        </div>

        <Toolbar
          onSearchChange={(value) => handleFilterChange("search", value)}
        />

        {/* --- Responsive Content Area --- */}
        {isLoading && users.length === 0 ? (
          <div className="p-8 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-pink-500" />
          </div>
        ) : isError ? (
          <div className="rounded-lg bg-red-50 p-6 text-center text-red-700">
            <h3 className="font-semibold">เกิดข้อผิดพลาด</h3>
            <p className="mt-1 text-sm">{error.message}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center text-gray-500 shadow-sm">
            <h3 className="font-semibold">ไม่พบข้อมูลผู้ใช้</h3>
            <p className="mt-1 text-sm">
              ไม่พบข้อมูลที่ตรงกับตัวกรองที่คุณเลือก
            </p>
          </div>
        ) : (
          <>
            {/* Mobile View: Card List */}
            <ul className="space-y-3 md:hidden">
              {users.map((user) => (
                <UserCard
                  key={user.line_user_id}
                  user={user}
                  onOpenModal={setSelectedUserId}
                />
              ))}
            </ul>

            {/* Desktop View: Table */}
            <div className="hidden overflow-hidden rounded-xl bg-white shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500">
                  <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        ผู้ใช้
                      </th>
                      <th scope="col" className="px-6 py-3">
                        ยอดเงิน
                      </th>
                      <th scope="col" className="px-6 py-3">
                        เป้าหมาย
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3">
                        เข้าร่วมเมื่อ
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.line_user_id}
                        className="border-b bg-white hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">
                          <div className="flex items-center gap-3">
                            <Image
                              src={
                                user.line_profile_url ||
                                "/placeholder-avatar.png"
                              }
                              alt={user.line_display_name || ""}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <span>
                              {user.line_display_name || user.fullname}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-800">
                          ฿{user.wallet?.balance?.toLocaleString() || 0}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {user.goal?.plan?.displayName || "ยังไม่มี"}
                        </td>
                        <td className="px-6 py-4">
                          <RoleTag role={user.role} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString(
                            "th-TH",
                            { year: "numeric", month: "short", day: "numeric" },
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedUserId(user.line_user_id)}
                            className="font-medium text-blue-600 hover:underline"
                          >
                            แก้ไข / ดู
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {paging && paging.total > 0 && (
              <div className="mt-4 flex flex-col items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-sm sm:flex-row">
                <span className="text-sm text-gray-700">
                  หน้า <span className="font-semibold">{paging.page}</span> /{" "}
                  <span className="font-semibold">{paging.totalPages}</span>{" "}
                  (รวม {paging.total} รายการ)
                </span>
                <div className="inline-flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={!paging.hasPrevPage}
                    className="rounded-md p-1.5 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handlePageChange(paging.page - 1)}
                    disabled={!paging.hasPrevPage}
                    className="rounded-md p-1.5 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handlePageChange(paging.page + 1)}
                    disabled={!paging.hasNextPage}
                    className="rounded-md p-1.5 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handlePageChange(paging.totalPages)}
                    disabled={!paging.hasNextPage}
                    className="rounded-md p-1.5 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <UserDetailsModal
        line_user_id={selectedUserId}
        isOpen={!!selectedUserId}
        onClose={() => setSelectedUserId(null)}
        onUpdate={handleUpdateUser}
        isProcessing={isUpdating}
      />
    </div>
  );
}
