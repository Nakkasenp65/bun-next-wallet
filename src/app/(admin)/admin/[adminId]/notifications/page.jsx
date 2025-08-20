"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Search,
  Plus,
  Pencil,
  Trash2,
  Send,
  Loader2,
  X,
  Save,
  ChevronsLeft,
  ChevronRight,
  ChevronsRight,
  Bell,
  Users,
  CalendarClock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import {
  useAdminGetBroadcasts,
  useAdminCreateBroadcast,
  useAdminUpdateBroadcast,
  useAdminDeleteBroadcast,
  useAdminSendBroadcast,
} from "@/hooks/useAdmin"; // ตรวจสอบว่า Path และชื่อไฟล์ Hook ถูกต้อง
import Stat from "./components/Stat";
/* =========================================================
   UI Sub-components
========================================================= */

const Toolbar = ({ onSearchChange }) => (
  <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
    <div className="relative lg:w-1/2">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-4 w-4 text-slate-400" />
      </div>
      <input
        type="text"
        placeholder="ค้นหาด้วยชื่อเรื่อง..."
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-3 pl-9 text-sm focus:ring-2 focus:ring-pink-400 focus:outline-none"
      />
    </div>
  </div>
);

const BroadcastCard = ({ broadcast, onEdit, onDelete, onSend, isSending }) => (
  <li className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
    <div className="mb-2 flex items-start justify-between gap-3">
      <div className="flex-grow">
        <p className="font-semibold text-slate-900">{broadcast.title}</p>
        <p className="line-clamp-2 text-xs text-slate-500">
          {broadcast.body || "-"}
        </p>
      </div>
      <span
        className={`rounded-full px-2 py-1 text-xs font-semibold ${broadcast.status === "SENT" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}`}
      >
        {broadcast.status}
      </span>
    </div>
    <div className="mt-3 flex items-center justify-between border-t pt-3">
      <div className="text-xs text-slate-500">
        ส่งแล้ว: {broadcast.sentToUserCount.toLocaleString()} คน
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => onSend(broadcast.id)}
          disabled={broadcast.status === "SENT" || isSending}
          className="inline-flex items-center gap-1.5 rounded-lg bg-pink-50 px-3 py-1.5 text-xs font-semibold text-pink-700 hover:bg-pink-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
        >
          <Send className="h-4 w-4" /> ส่ง
        </button>
        <button
          onClick={() => onEdit(broadcast)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          <Pencil className="h-4 w-4" /> แก้ไข
        </button>
        <button
          onClick={() => onDelete(broadcast.id)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
        >
          <Trash2 className="h-4 w-4" /> ลบ
        </button>
      </div>
    </div>
  </li>
);

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

const BroadcastFormModal = ({
  open,
  initial,
  onClose,
  onSubmit,
  isProcessing,
}) => {
  const [form, setForm] = useState({});
  useEffect(() => {
    setForm(initial || { title: "", body: "" });
  }, [initial, open]);
  if (!open) return null;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title?.trim()) return alert("กรุณากรอกชื่อเรื่อง");
    onSubmit(form);
  };

  return (
    <div
      className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl bg-white shadow-xl"
        role="dialog"
      >
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between border-b p-4">
            <h3 className="text-lg font-semibold text-slate-900">
              {initial ? "แก้ไข" : "สร้าง"} Broadcast
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
              aria-label="ปิด"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-4 p-6">
            <div>
              <label className="text-sm text-slate-600">หัวข้อ</label>
              <input
                name="title"
                value={form.title || ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-sm text-slate-600">รายละเอียด</label>
              <textarea
                name="body"
                value={form.body || ""}
                onChange={handleChange}
                rows={4}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 border-t bg-slate-50 p-4">
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
              className="flex min-w-[120px] items-center justify-center rounded-lg bg-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-110 disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Save className="h-4 w-4" /> บันทึก
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================================================
   Page: Admin Broadcasts Page
========================================================= */
export default function AdminBroadcastsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({ search: "", page: 1, pageSize: 10 });
  const [debouncedSearch] = useDebounce(filters.search, 300);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBroadcast, setEditingBroadcast] = useState(null);

  const queryFilters = { ...filters, search: debouncedSearch };

  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
  } = useAdminGetBroadcasts(queryFilters);
  const { mutate: createBroadcast, isLoading: isCreating } =
    useAdminCreateBroadcast();
  const { mutate: updateBroadcast, isLoading: isUpdating } =
    useAdminUpdateBroadcast();
  const { mutate: deleteBroadcast } = useAdminDeleteBroadcast();
  const { mutate: sendBroadcast, isLoading: isSending } =
    useAdminSendBroadcast();
  const isProcessing = isCreating || isUpdating;

  const broadcasts = apiResponse?.data || [];
  const paging = apiResponse?.paging || {};
  const totalSent = broadcasts.reduce(
    (acc, curr) => acc + (curr.sentToUserCount || 0),
    0,
  );

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= paging.totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleCreate = () => {
    setEditingBroadcast(null);
    setIsModalOpen(true);
  };
  const handleEdit = (broadcast) => {
    setEditingBroadcast(broadcast);
    setIsModalOpen(true);
  };
  const handleDelete = (broadcastId) => {
    if (confirm("ยืนยันการลบ Broadcast ฉบับร่างนี้?"))
      deleteBroadcast(broadcastId);
  };
  const handleSend = (broadcastId) => {
    if (
      confirm(
        "ยืนยันการส่ง Broadcast นี้ไปยังผู้ใช้ทุกคน? การกระทำนี้ไม่สามารถย้อนกลับได้",
      )
    )
      sendBroadcast(broadcastId);
  };

  const handleUpsert = (payload) => {
    if (editingBroadcast) {
      updateBroadcast(
        { broadcastId: editingBroadcast.id, payload },
        { onSuccess: () => setIsModalOpen(false) },
      );
    } else {
      createBroadcast(payload, { onSuccess: () => setIsModalOpen(false) });
    }
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
                จัดการ Broadcast
              </h1>
              <p className="text-sm text-slate-500">
                สร้างและส่งการแจ้งเตือนไปยังผู้ใช้ทุกคนในระบบ
              </p>
            </div>
          </div>
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-110"
          >
            <Plus className="h-4 w-4" /> สร้างใหม่
          </button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Stat
            icon={<Bell className="h-5 w-5 text-pink-600" />}
            label="Broadcast ทั้งหมด"
            value={paging.total || 0}
            color="bg-pink-100"
          />
          <Stat
            icon={<Users className="h-5 w-5 text-green-600" />}
            label="ส่งถึงผู้ใช้ (รวม)"
            value={totalSent.toLocaleString()}
            color="bg-green-100"
          />
          <Stat
            icon={<CalendarClock className="h-5 w-5 text-orange-600" />}
            label="ฉบับร่าง"
            value={broadcasts.filter((b) => b.status === "DRAFT").length}
            color="bg-orange-100"
          />
        </div>

        <Toolbar
          onSearchChange={(value) => handleFilterChange("search", value)}
        />

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
        {!isLoading && !isError && broadcasts.length === 0 && (
          <div className="rounded-xl bg-white p-8 text-center text-slate-500">
            ไม่พบข้อมูล Broadcast
          </div>
        )}

        {!isLoading && !isError && broadcasts.length > 0 && (
          <>
            <div className="hidden overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-100 md:block">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs text-slate-700 uppercase">
                    <tr>
                      <th className="px-6 py-3">หัวข้อ</th>
                      <th className="px-6 py-3">สถานะ</th>
                      <th className="px-6 py-3">ส่งถึง (คน)</th>
                      <th className="px-6 py-3">วันที่ส่ง</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {broadcasts.map((item) => (
                      <tr key={item.id} className="bg-white hover:bg-slate-50">
                        <td className="max-w-lg px-6 py-4">
                          <div className="truncate font-semibold text-slate-900">
                            {item.title}
                          </div>
                          <div className="truncate text-xs text-slate-500">
                            {item.body || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${item.status === "SENT" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {item.sentToUserCount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.sentAt
                            ? new Date(item.sentAt).toLocaleString("th-TH")
                            : "-"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => handleSend(item.id)}
                              disabled={item.status === "SENT" || isSending}
                              className="rounded-lg p-2 text-xs font-semibold text-pink-700 hover:bg-pink-50 disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-transparent"
                            >
                              <Send className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(item)}
                              className="rounded-lg p-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="rounded-lg p-2 text-xs font-semibold text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <ul className="space-y-3 md:hidden">
              {broadcasts.map((item) => (
                <BroadcastCard
                  key={item.id}
                  broadcast={item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onSend={handleSend}
                  isSending={isSending}
                />
              ))}
            </ul>
            {paging.total > paging.pageSize && (
              <Pagination paging={paging} onPageChange={handlePageChange} />
            )}
          </>
        )}
      </div>

      <BroadcastFormModal
        open={isModalOpen}
        initial={editingBroadcast}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUpsert}
        isProcessing={isProcessing}
      />
    </div>
  );
}
