"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faDownload } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useTransactions } from "@/hooks/useTransactions"; // 1. Import hook ใหม่
import CtaButton from "@/components/Ui/CtaButton";
import Loading from "@/components/Loading";
import Transaction from "@/components/TransactionComponents/Transaction";

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
  const router = useRouter();

  // 3. State สำหรับจัดการเดือนและปีที่กำลังแสดงผล
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  console.log("year: ", currentYear, " month: ", currentMonth);

  // 4. ดึงข้อมูลธุรกรรมสำหรับเดือนและปีปัจจุบัน
  const { data: transactions, isLoading, error } = useTransactions(currentYear, currentMonth);

  // --- ฟังก์ชันสำหรับจัดการการเปลี่ยนเดือน ---
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

  // ตรวจสอบว่าเป็นเดือนปัจจุบันหรือไม่ เพื่อ disable ปุ่ม "ถัดไป"
  const isCurrentMonth = currentYear === new Date().getFullYear() && currentMonth === new Date().getMonth();

  return (
    <div id="history-overlay" className="bg-bg-dark/80 fixed inset-0 z-40 flex flex-col backdrop-blur-sm">
      {/* Page Header */}
      <header className="flex flex-shrink-0 items-center border-b border-white/20 px-5 pt-10 pb-4">
        <button
          onClick={() => router.push("/")}
          className="text-secondary-text text-2xl transition-colors hover:text-white"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <h2 className="from-primary-pink to-primary-orange flex-grow bg-gradient-to-r bg-clip-text text-center text-xl font-bold text-transparent">
          ประวัติธุรกรรม
        </h2>
        <div className="w-6"></div> {/* Spacer */}
      </header>

      {/* Page Content */}
      <div className="flex flex-grow flex-col overflow-y-auto rounded-t-[30px] bg-white">
        <div className="p-6">
          {/* Period Selector */}
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

          {/* Transaction List */}
          <ul id="full-history-list" className="mt-4">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loading />
              </div>
            ) : error ? (
              <p className="text-center text-red-500">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
            ) : transactions && transactions.length > 0 ? (
              transactions.map((transaction) => <Transaction key={transaction.id} transaction={transaction} />)
            ) : (
              <p className="p-8 text-center text-gray-500">ไม่พบรายการในเดือนนี้</p>
            )}
          </ul>
        </div>
      </div>

      {/* Page Footer */}
      <footer className="flex-shrink-0 bg-white p-6 pt-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <CtaButton>ขอรายการเดินบัญชี</CtaButton>
      </footer>
    </div>
  );
}
