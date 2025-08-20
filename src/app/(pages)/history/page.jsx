"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useWalletTransaction } from "@/hooks/useTransactions";
import CtaButton from "@/components/Ui/CtaButton";
import Transaction from "@/components/TransactionComponents/Transaction";
import { useGetUser } from "@/hooks/useUser";
import { useLiff } from "@/components/provider/LiffProvider";
import TransactionSkeleton from "@/components/Ui/TransactionSkeleton";
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

export default function HistoryPage() {
  const { liffProfile } = useLiff();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [openModal, setOpenModal] = useState(false);

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

  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  };

  // Show header + page chrome even when loading transactions
  if (userLoading) {
    return (
      <div className="bg-bg-dark/80 fixed inset-0 z-40 flex items-center justify-center backdrop-blur-sm">
        <TransactionSkeleton />
      </div>
    );
  }

  return (
    <div className="bg-bg-dark/80 fixed inset-0 z-40 flex flex-col backdrop-blur-sm">
      {/* Modal */}
      <DownloadModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        walletId={userData?.wallet?.id}
        defaultMonthDate={currentDate}
      />

      {/* Header */}
      <header className="flex flex-shrink-0 items-center px-5 pt-10 pb-4">
        <button
          onClick={() => router.push("/")}
          className="text-secondary-text text-2xl transition-colors hover:text-white"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <h2 className="from-primary-pink to-primary-orange flex-grow bg-gradient-to-r bg-clip-text text-center text-xl font-bold text-transparent">
          ประวัติธุรกรรม
        </h2>
        <div className="w-6" />
      </header>

      {/* Content */}
      <div className="flex flex-grow flex-col overflow-y-auto rounded-t-[30px] bg-white">
        <div className="p-6">
          {/* Period + top download */}
          <div className="flex items-center justify-between rounded-lg bg-gray-100 p-3">
            <button
              onClick={handlePrevMonth}
              className="text-gray-500 hover:text-black"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <span className="text-bg-dark font-bold">
              {thaiMonths[currentMonth]} {currentYear + 543}
            </span>
            <button
              onClick={handleNextMonth}
              disabled={isCurrentMonth}
              className="text-gray-500 hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>

          {/* Transactions List */}
          <ul id="full-history-list" className="mt-4">
            {transactionLoading ? (
              <>
                <TransactionSkeleton />
                <TransactionSkeleton />
                <TransactionSkeleton />
                <TransactionSkeleton />
              </>
            ) : error ? (
              <p className="p-8 text-center text-red-500">
                เกิดข้อผิดพลาดในการโหลดข้อมูล
              </p>
            ) : transactions && transactions.length > 0 ? (
              transactions.map((t) => (
                <Transaction key={t.id} transaction={t} />
              ))
            ) : (
              <p className="p-8 text-center text-gray-500">
                ไม่พบรายการในเดือนนี้
              </p>
            )}
          </ul>
        </div>
      </div>

      {/* Footer download */}
      <footer className="flex justify-center bg-white p-6 pt-4">
        <CtaButton
          onClick={() => setOpenModal(true)}
          className="z-10 w-48 rounded-xl p-4 text-lg font-bold"
        >
          ขอรายการเดินบัญชี
        </CtaButton>
      </footer>
    </div>
  );
}
