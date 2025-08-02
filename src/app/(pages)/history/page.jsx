"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faDownload } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useTransactions } from "@/hooks/useTransactions"; // 1. Import hook ใหม่
import CtaButton from "@/components/Ui/CtaButton";
import Loading from "@/components/StatusComponents/Loading";
import Transaction from "@/components/TransactionComponents/Transaction";
import { useUser } from "@/hooks/useUser";
import { useLiff } from "@/components/provider/LiffProvider";
import TransactionSkeleton from "@/components/Ui/TransactionSkeleton";

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
  const { liffProfile, isLoggedIn } = useLiff();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const { data: userData, isLoading: userLoading, error: userError } = useUser(liffProfile?.userId);
  const {
    data: transactions,
    isLoading: transactionLoading,
    error,
  } = useTransactions(currentYear, currentMonth, userData?.wallet.id, {
    enabled: !!userData,
  });

  const handlePrevMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const isCurrentMonth =
    currentYear === new Date().getFullYear() && currentMonth === new Date().getMonth();

  if (userLoading) {
    return <Loading message="กำลังโหลดข้อมูลผู้ใช้..." />;
  }

  return (
    <div className="bg-bg-dark/80 fixed inset-0 z-40 flex flex-col backdrop-blur-sm">
      {/* Page Header (remains visible) */}
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
        <div className="w-6"></div>
      </header>

      {/* Page Content (remains visible) */}
      <div className="flex flex-grow flex-col overflow-y-auto rounded-t-[30px] bg-white">
        <div className="p-6">
          {/* Period Selector (remains visible and interactive) */}
          <div className="flex items-center justify-between rounded-lg bg-gray-100 p-3">
            <button onClick={handlePrevMonth} className="text-gray-500 hover:text-black">
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
            <button className="bg-info-blue ml-4 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-white transition hover:bg-blue-600">
              <FontAwesomeIcon icon={faDownload} />
              <span>ดาวน์โหลด</span>
            </button>
          </div>

          {/* --- 2. UPDATED Transaction List with inline loading --- */}
          <ul id="full-history-list" className="mt-4">
            {transactionLoading ? (
              // If transactions are loading, show the skeleton placeholders
              <>
                <TransactionSkeleton />
                <TransactionSkeleton />
                <TransactionSkeleton />
                <TransactionSkeleton />
              </>
            ) : error ? (
              <p className="p-8 text-center text-red-500">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
            ) : transactions && transactions.length > 0 ? (
              transactions.map((transaction) => (
                <Transaction key={transaction.id} transaction={transaction} />
              ))
            ) : (
              <p className="p-8 text-center text-gray-500">ไม่พบรายการในเดือนนี้</p>
            )}
          </ul>
        </div>
      </div>

      {/* Page Footer (remains visible) */}
      <footer className="flex justify-center bg-white p-6 pt-4">
        <CtaButton className={"z-10 w-48 rounded-xl p-4 text-lg font-bold"}>
          ขอรายการเดินบัญชี
        </CtaButton>
      </footer>
    </div>
  );
}
