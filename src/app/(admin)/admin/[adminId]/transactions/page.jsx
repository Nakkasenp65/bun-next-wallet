"use client";
import React, { useState } from "react";
import {
  ChevronLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Gift,
  ArrowDownCircle,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  PlusCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useUpdateTransaction,
  useCreateTransaction,
} from "@/hooks/useTransactions";
import { useGetAdminTransactions } from "@/hooks/useAdmin";
import VerificationModal from "./components/VerificationModal";
import DropDownComponent from "@/components/Ui/DropDownComponent"; // Import the reusable DropDownComponent
import CreateTransactionModal from "./components/CreateTransactionModal";

const StatusTag = ({ status }) => {
  const styles =
    {
      PENDING: {
        icon: <Clock className="h-3 w-3" />,
        text: "รอตรวจสอบ",
        color: "bg-yellow-100 text-yellow-800",
      },
      SUCCESS: {
        icon: <CheckCircle2 className="h-3 w-3" />,
        text: "สำเร็จ",
        color: "bg-green-100 text-green-800",
      },
      REJECTED: {
        icon: <XCircle className="h-3 w-3" />,
        text: "ปฏิเสธ",
        color: "bg-red-100 text-red-800",
      },
      CANCELLED: {
        icon: <XCircle className="h-3 w-3" />,
        text: "ยกเลิก",
        color: "bg-gray-100 text-gray-800",
      },
    }[status] || {};
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${styles.color}`}
    >
      {styles.icon} {styles.text}
    </span>
  );
};

const TypeTag = ({ type }) => {
  const styles =
    {
      INCOME: {
        icon: <ArrowDownCircle className="h-3 w-3" />,
        text: "รายรับ",
        color: "text-green-700",
      },
      REWARD: {
        icon: <Gift className="h-3 w-3" />,
        text: "รางวัล",
        color: "text-violet-700",
      },
      OUTCOME: {
        icon: <ArrowDownCircle className="h-3 w-3 rotate-180" />,
        text: "รายจ่าย",
        color: "text-red-700",
      },
    }[type] || {};
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium ${styles.color}`}
    >
      {styles.icon} {styles.text}
    </span>
  );
};

const TransactionCard = ({ tx, onOpenModal }) => (
  <li className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
    <div className="flex items-start justify-between">
      <div>
        <p className="font-semibold text-slate-800">{tx.name || "N/A"}</p>
        <p className="text-xs text-slate-500">จาก: {tx.from}</p>
        <p className="text-xs text-slate-400">
          {new Date(tx.createdAt).toLocaleString("th-TH")}
        </p>
      </div>
      <StatusTag status={tx.status} />
    </div>
    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
      <div>
        <TypeTag type={tx.type} />
        <p className="mt-1 text-xl font-bold text-slate-900">
          {tx.amount != null ? `฿${tx.amount.toLocaleString()}` : "N/A"}
        </p>
      </div>
      <button
        onClick={() => onOpenModal(tx)}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
      >
        {tx.status === "PENDING" ? "ตรวจสอบ" : "แก้ไข / ดู"}
      </button>
    </div>
  </li>
);

const Toolbar = ({ filters, onFilterChange }) => {
  // Prepare options for the Dropdowns
  const statusOptions = [
    { label: "สถานะทั้งหมด", value: "ALL" },
    { label: "รอตรวจสอบ", value: "PENDING" },
    { label: "สำเร็จ", value: "SUCCESS" },
    { label: "ปฏิเสธ", value: "REJECTED" },
    { label: "ยกเลิก", value: "CANCELLED" },
  ];

  const pageSizeOptions = [
    { label: "5 รายการ", value: 5 },
    { label: "10 รายการ", value: 10 },
    { label: "20 รายการ", value: 20 },
    { label: "50 รายการ", value: 50 },
  ];

  return (
    <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:w-1/2">
        <DropDownComponent
          label="สถานะ"
          name="status"
          value={filters.status}
          onChange={(selectedValue) => onFilterChange("status", selectedValue)}
          options={statusOptions}
          placeholder="เลือกสถานะ"
          labelClassName="block text-sm font-medium text-slate-600 mb-1"
          buttonClassName="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm"
          optionsContainerClassName="border border-slate-200"
        />
        <DropDownComponent
          label="แสดงผลต่อหน้า"
          name="pageSize"
          value={filters.pageSize}
          onChange={(selectedValue) =>
            onFilterChange("pageSize", selectedValue)
          }
          options={pageSizeOptions}
          placeholder="เลือกจำนวน"
          labelClassName="block text-sm font-medium text-slate-600 mb-1"
          buttonClassName="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm"
          optionsContainerClassName="border border-slate-200"
        />
      </div>
    </div>
  );
};

export default function AdminTransactionsPage() {
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    status: "ALL",
  });
  const [selectedTx, setSelectedTx] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const router = useRouter();

  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
  } = useGetAdminTransactions(filters);
  const { mutate: updateTransaction, isLoading: isProcessing } =
    useUpdateTransaction();
  const { mutate: createTransaction, isLoading: isCreating } =
    useCreateTransaction();

  console.log("Transaction: ", apiResponse);

  const transactions = apiResponse?.data || [];
  const paging = apiResponse?.paging || {};

  const handleUpdate = ({ transactionId, payload }) => {
    updateTransaction(
      { transactionId, payload },
      {
        onSuccess: () => {
          setSelectedTx(null); // Close modal on success
        },
      },
    );
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 })); // Reset to page 1 on filter change
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= (paging.totalPages || 1)) {
      setFilters((prev) => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* --- Header --- */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                จัดการธุรกรรม
              </h1>
              <p className="text-sm text-gray-500">
                ตรวจสอบและจัดการรายการธุรกรรมทั้งหมด
              </p>
            </div>
          </div>
          {/* [NEW] ปุ่มสำหรับเปิด Modal สร้างรายการ */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-700"
          >
            <PlusCircle size={16} />
            สร้างรายการ
          </button>
        </div>

        <Toolbar filters={filters} onFilterChange={handleFilterChange} />

        {/* --- Responsive Content Area --- */}
        {isLoading && transactions.length === 0 ? (
          <div className="p-8 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-pink-500" />
          </div>
        ) : isError ? (
          <div className="rounded-lg bg-red-50 p-6 text-center text-red-700">
            <h3 className="font-semibold">เกิดข้อผิดพลาด</h3>
            <p className="mt-1 text-sm">{error.message}</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center text-gray-500 shadow-sm">
            <h3 className="font-semibold">ไม่พบรายการธุรกรรม</h3>
            <p className="mt-1 text-sm">
              ไม่พบข้อมูลที่ตรงกับตัวกรองที่คุณเลือก
            </p>
          </div>
        ) : (
          <>
            <ul className="space-y-3 md:hidden">
              {transactions.map((tx) => (
                <TransactionCard
                  key={tx.id}
                  tx={tx}
                  onOpenModal={setSelectedTx}
                />
              ))}
            </ul>
            <div className="hidden overflow-hidden rounded-xl bg-white shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500">
                  <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        วันที่
                      </th>
                      <th scope="col" className="px-6 py-3">
                        ผู้ทำรายการ
                      </th>
                      <th scope="col" className="px-6 py-3">
                        ประเภท
                      </th>
                      <th scope="col" className="px-6 py-3">
                        จำนวนเงิน
                      </th>
                      <th scope="col" className="px-6 py-3">
                        สถานะ
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr
                        key={tx.id}
                        className="border-b bg-white hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                          {new Date(tx.createdAt).toLocaleString("th-TH", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </td>
                        <td className="px-6 py-4">{tx.from}</td>
                        <td className="px-6 py-4">
                          <TypeTag type={tx.type} />
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          {tx.amount != null
                            ? `฿${tx.amount.toLocaleString()}`
                            : "-"}
                        </td>
                        <td className="px-6 py-4">
                          <StatusTag status={tx.status} />
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedTx(tx)}
                            className="font-medium text-blue-600 hover:underline"
                          >
                            {tx.status === "PENDING" ? "ตรวจสอบ" : "แก้ไข / ดู"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
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

      <VerificationModal
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
        onUpdate={handleUpdate}
        isProcessing={isProcessing}
      />

      <CreateTransactionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={createTransaction}
        isProcessing={isProcessing}
      />
    </div>
  );
}
