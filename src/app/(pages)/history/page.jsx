"use client";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faDownload,
  faArrowUp,
  faArrowDown,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useWalletTransaction } from "@/hooks/useTransactions";
import CtaButton from "@/components/ui/CtaButton";
import Transaction from "@/components/TransactionComponents/Transaction";
import { useGetUser } from "@/hooks/useUser";
import { useLiff } from "@/components/provider/LiffProvider";
import TransactionSkeleton from "@/components/ui/TransactionSkeleton";
import DownloadModal from "@/components/modal/DownloadModal";

const thaiMonths = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

const ITEMS_PER_PAGE = 10;

export default function HistoryPage() {
  const { liffProfile } = useLiff();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const isCurrentMonth =
    currentYear === new Date().getFullYear() &&
    currentMonth === new Date().getMonth();

  const { data: userData, isLoading: userLoading } = useGetUser(
    liffProfile?.userId,
  );

  const {
    data: transactions,
    isLoading: transactionLoading,
    error,
  } = useWalletTransaction(currentYear, currentMonth, userData?.wallet?.id, {
    enabled: !!userData,
  });

  // Pagination logic
  const totalPages = transactions
    ? Math.ceil(transactions.length / ITEMS_PER_PAGE)
    : 0;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTransactions = transactions?.slice(startIndex, endIndex) || [];

  // Calculate summary
  const summary = transactions?.reduce(
    (acc, t) => {
      const amount = parseFloat(t.amount);
      if (amount > 0) {
        acc.income += amount;
      } else {
        acc.expense += Math.abs(amount);
      }
      return acc;
    },
    { income: 0, expense: 0 },
  ) || { income: 0, expense: 0 };

  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
    setCurrentPage(1);
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
    setCurrentPage(1);
  };

  if (userLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-40 flex flex-col bg-gradient-to-br from-slate-50 to-slate-100"
      >
        <header className="flex flex-shrink-0 items-center px-6 pt-12 pb-6">
          <div className="h-10 w-10 rounded-xl bg-white/50 shadow-sm" />
          <div className="mx-auto h-6 w-40 rounded-lg bg-white/50 shadow-sm" />
          <div className="h-8 w-8" />
        </header>

        <div className="flex-grow space-y-4 px-6">
          <div className="h-32 w-full animate-pulse rounded-2xl bg-white/50 shadow-sm" />
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex animate-pulse items-center gap-4 rounded-xl bg-white/50 p-4 shadow-sm"
              >
                <div className="h-12 w-12 rounded-full bg-slate-200" />
                <div className="flex-grow space-y-2">
                  <div className="h-4 w-3/4 rounded-md bg-slate-200" />
                  <div className="h-3 w-1/2 rounded-md bg-slate-200" />
                </div>
                <div className="h-5 w-20 rounded-md bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      <DownloadModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        walletId={userData?.wallet?.id}
        defaultMonthDate={currentDate}
      />

      {/* Modern Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-shrink-0 items-center px-6 pt-12 pb-6"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/")}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm transition-all hover:shadow-md"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="text-lg" />
        </motion.button>

        <h2 className="flex-grow bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-center text-xl font-bold text-transparent">
          ประวัติธุรกรรม
        </h2>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpenModal(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
        >
          <FontAwesomeIcon icon={faDownload} className="text-sm" />
        </motion.button>
      </motion.header>

      {/* Content */}
      <div className="flex flex-grow flex-col overflow-y-auto px-6 pb-6">
        {/* Month Selector */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-4 flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrevMonth}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </motion.button>

          <div className="text-center">
            <p className="text-lg font-bold text-slate-800">
              {thaiMonths[currentMonth]}
            </p>
            <p className="text-sm text-slate-500">{currentYear + 543}</p>
          </div>

          <motion.button
            whileHover={{ scale: isCurrentMonth ? 1 : 1.1 }}
            whileTap={{ scale: isCurrentMonth ? 1 : 0.9 }}
            onClick={handleNextMonth}
            disabled={isCurrentMonth}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </motion.button>
        </motion.div>

        {/* Summary Cards */}
        {!transactionLoading && transactions && transactions.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-4 grid grid-cols-2 gap-3"
          >
            <div className="rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-4 shadow-lg">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <FontAwesomeIcon icon={faArrowDown} className="text-white" />
              </div>
              <p className="text-xs text-white/80">รายรับ</p>
              <p className="text-xl font-bold text-white">
                +฿
                {summary.income.toLocaleString("th-TH", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 p-4 shadow-lg">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <FontAwesomeIcon icon={faArrowUp} className="text-white" />
              </div>
              <p className="text-xs text-white/80">รายจ่าย</p>
              <p className="text-xl font-bold text-white">
                -฿
                {summary.expense.toLocaleString("th-TH", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </motion.div>
        )}

        {/* Transactions List */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex-grow"
        >
          {transactionLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <TransactionSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 shadow-sm"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <FontAwesomeIcon
                  icon={faReceipt}
                  className="text-2xl text-red-500"
                />
              </div>
              <p className="text-center text-red-500">
                เกิดข้อผิดพลาดในการโหลดข้อมูล
              </p>
            </motion.div>
          ) : transactions && transactions.length > 0 ? (
            <>
              <AnimatePresence mode="wait">
                <motion.ul
                  key={currentPage}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2"
                >
                  {currentTransactions.map((t, index) => (
                    <motion.li
                      key={t.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Transaction
                        transaction={t}
                        currentWalletId={userData?.wallet.id}
                      />
                    </motion.li>
                  ))}
                </motion.ul>
              </AnimatePresence>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 flex items-center justify-center gap-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
                  </motion.button>

                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`flex h-10 w-10 items-center justify-center rounded-xl font-semibold shadow-sm transition-all ${
                          currentPage === i + 1
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                            : "bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {i + 1}
                      </motion.button>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="text-sm"
                    />
                  </motion.button>
                </motion.div>
              )}

              {/* Page info */}
              <p className="mt-4 text-center text-sm text-slate-400">
                แสดง {startIndex + 1}-{Math.min(endIndex, transactions.length)}{" "}
                จาก {transactions.length} รายการ
              </p>
            </>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 shadow-sm"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <FontAwesomeIcon
                  icon={faReceipt}
                  className="text-2xl text-slate-400"
                />
              </div>
              <p className="text-center font-medium text-slate-600">
                ไม่พบรายการในเดือนนี้
              </p>
              <p className="mt-2 text-center text-sm text-slate-400">
                ยังไม่มีธุรกรรมในช่วงเวลานี้
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
