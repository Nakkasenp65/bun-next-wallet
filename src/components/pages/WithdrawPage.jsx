"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faHashtag,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { IoIosArrowForward } from "react-icons/io";
import CtaButton from "../Ui/CtaButton";
import FramerDiv from "../framerComponents/FramerDiv";
import BankSelectionModal from "../Ui/BankSelectionModal";
import Loading from "../StatusComponents/Loading";
import { useWithdrawTransaction } from "@/hooks/useTransactions"; // 1. Import hook ใหม่
import toast from "react-hot-toast";

export default function WithdrawPage({
  userData,
  showWithdraw,
  setShowWithdraw,
}) {
  console.log("Withdraw:", userData);
  const [showBankModal, setShowBankModal] = useState(false);
  const [formData, setFormData] = useState({
    userId: userData.id,
    amount: "",
    bank: "",
    accountNumber: "",
    accountName: "", // เปลี่ยนจาก recipient เป็น accountName เพื่อให้ตรงกับ service
  });

  // 2. สร้างฟังก์ชันสำหรับปิดหน้าและรีเซ็ตค่าทั้งหมด
  const closePage = () => {
    setShowWithdraw(false);
    setFormData({
      amount: "",
      bank: "",
      accountNumber: "",
      accountName: "",
    });
  };

  // 3. เรียกใช้งาน useMutation hook
  const { mutate: withdraw, isPending } = useWithdrawTransaction({
    onSuccessCallback: closePage,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleBankSelect = (bank) => {
    setFormData((prev) => ({
      ...prev,
      bank: bank.name, // เก็บเฉพาะชื่อธนาคาร
    }));
    setShowBankModal(false);
  };

  // 4. สร้างฟังก์ชัน handleSubmit
  const handleSubmit = () => {
    // --- Client-side validation ---
    const numericAmount = parseFloat(formData.amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return toast.error("กรุณาระบุจำนวนเงินที่ถูกต้อง");
    }
    if (!formData.bank) {
      return toast.error("กรุณาเลือกธนาคาร");
    }
    if (!formData.accountNumber.trim()) {
      return toast.error("กรุณากรอกเลขบัญชี");
    }
    if (!formData.accountName.trim()) {
      return toast.error("กรุณากรอกชื่อบัญชีผู้รับ");
    }

    // ส่งข้อมูลไปให้ mutation
    withdraw({
      userId: userData.id,
      amount: numericAmount,
      bank: formData.bank,
      accountNumber: formData.accountNumber,
      accountName: formData.accountName,
    });
  };

  // useEffect ถูกปรับปรุงให้ใช้ closePage เพื่อความสะอาด
  useEffect(() => {
    if (!showWithdraw) {
      closePage();
    }
  }, [showWithdraw]);

  return (
    <>
      {/* 5. เพิ่ม Loading Overlay */}
      {isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Loading />
        </div>
      )}

      <FramerDiv
        isOpen={showWithdraw}
        id="withdraw-overlay"
        className="text-bg-dark bg-bg-dark/80 fixed inset-0 z-40 flex flex-col backdrop-blur-sm"
      >
        {/* Header */}
        <header className="flex flex-shrink-0 items-center px-5 pt-10 pb-4">
          <button
            onClick={closePage}
            className="text-secondary-text text-2xl transition-colors hover:text-white"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <h2 className="from-primary-pink to-primary-orange flex-grow bg-gradient-to-r bg-clip-text text-center text-xl font-bold text-transparent">
            ถอนเงิน
          </h2>
          <div className="w-6"></div>
        </header>

        {/* Page Content */}
        <div className="flex flex-grow flex-col gap-5 overflow-y-auto rounded-t-[30px] bg-white p-6">
          <div className="rounded-lg bg-gray-100 p-3 text-center text-sm text-gray-600">
            ยอดเงินที่ใช้ได้
            <span className="text-bg-dark ml-2 font-bold">
              ฿
              {userData.wallet.balance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          {/* Input Group: Amount */}
          <div>
            <label
              htmlFor="withdraw-amount"
              className="mb-2 block text-sm font-bold text-gray-500"
            >
              จำนวนเงิน
            </label>
            <input
              type="number"
              id="withdraw-amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              inputMode="decimal"
              placeholder="฿0.00"
              className="text-bg-dark focus:border-primary-pink focus:ring-primary-pink/30 w-full rounded-xl border border-gray-300 p-4 text-lg font-bold outline-none focus:ring-2"
            />
          </div>

          {/* --- 6. เพิ่ม UI สำหรับเลือกธนาคาร (สำคัญ) --- */}
          <div>
            <label
              htmlFor="withdraw-bank-selector"
              className="mb-2 block text-sm font-bold text-gray-500"
            >
              ถอนไปยังบัญชีธนาคาร
            </label>
            <div
              id="withdraw-bank-selector"
              onClick={() => setShowBankModal(true)}
              className="hover:border-primary-pink flex w-full cursor-pointer items-center justify-between rounded-xl border border-gray-300 p-4"
            >
              <span
                className={
                  formData.bank ? "text-bg-dark font-semibold" : "text-gray-400"
                }
              >
                {formData.bank || "เลือกธนาคาร"}
              </span>
              <IoIosArrowForward className="text-xl text-gray-400" />
            </div>
            <BankSelectionModal
              isOpen={showBankModal}
              onClose={() => setShowBankModal(false)}
              onBankSelect={handleBankSelect}
            />
          </div>

          {/* Input Group: Account Number */}
          <div>
            <label
              htmlFor="withdraw-account-number"
              className="mb-2 block text-sm font-bold text-gray-500"
            >
              เลขบัญชี
            </label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faHashtag}
                className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                id="withdraw-account-number"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                placeholder="กรอกเลขบัญชีปลายทาง"
                className="focus:border-primary-pink focus:ring-primary-pink/30 w-full rounded-xl border border-gray-300 p-4 pl-12 outline-none focus:ring-2"
              />
            </div>
          </div>

          {/* Input Group: Recipient Name */}
          <div>
            <label
              htmlFor="withdraw-recipient"
              className="mb-2 block text-sm font-bold text-gray-500"
            >
              ชื่อบัญชีผู้รับ
            </label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faUser}
                className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                id="withdraw-recipient"
                name="accountName"
                value={formData.accountName}
                onChange={handleInputChange}
                placeholder="ชื่อ-นามสกุลเจ้าของบัญชี"
                className="focus:border-primary-pink focus:ring-primary-pink/30 w-full rounded-xl border border-gray-300 p-4 pl-12 outline-none focus:ring-2"
              />
            </div>
          </div>

          {/* Fee Display */}
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 text-base">
            <span className="text-gray-600">ค่าบริการ</span>
            <span className="text-bg-dark font-bold">฿15.00</span>
          </div>

          {/* --- 7. เชื่อมปุ่ม CTA กับ handleSubmit --- */}
          <div className="mt-auto flex items-center justify-center">
            <CtaButton
              onClick={handleSubmit}
              disabled={isPending}
              className={"z-10 w-48 rounded-xl p-4 text-base font-bold"}
            >
              {isPending ? "กำลังดำเนินการ..." : "ต่อไป"}
            </CtaButton>
          </div>
        </div>
      </FramerDiv>
    </>
  );
}
