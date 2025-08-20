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
import { useWithdrawTransaction } from "@/hooks/useTransactions";
import toast from "react-hot-toast";
import { FaExclamationTriangle } from "react-icons/fa";

const MIN_WITHDRAW = 100;
const FEE_RATE = 0.2; // 20%

export default function WithdrawPage({
  userData,
  showWithdraw,
  setShowWithdraw,
  balance = 0,
}) {
  const [showBankModal, setShowBankModal] = useState(false);
  const [formData, setFormData] = useState({
    userId: userData?.id,
    amount: "",
    bank: "",
    accountNumber: "",
    accountName: "", // will sync to userData.fullname below
  });

  // sync accountName from user data so submit uses the same value you display
  useEffect(() => {
    setFormData((prev) => ({ ...prev, accountName: userData?.fullname || "" }));
  }, [userData?.fullname]);

  const closePage = () => {
    setShowWithdraw(false);
    setFormData({
      userId: userData?.id,
      amount: "",
      bank: "",
      accountNumber: "",
      accountName: userData?.fullname || "",
    });
  };

  const { mutate: withdraw, isPending } = useWithdrawTransaction({
    onSuccessCallback: closePage,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // prevent negative or weird strings
    const next = name === "amount" ? value.replace(/[^\d.]/g, "") : value;
    setFormData((prev) => ({ ...prev, [name]: next }));
  };

  const handleBankSelect = (bank) => {
    setFormData((prev) => ({ ...prev, bank: bank.name }));
    setShowBankModal(false);
  };

  const displayBalance = Number(balance);
  const amountNum = Number(formData.amount || 0);
  const belowMin = amountNum > 0 && amountNum < MIN_WITHDRAW;
  const exceedsBalance = amountNum > displayBalance;
  const fee = amountNum * FEE_RATE;
  const net = Math.max(0, amountNum - fee);

  const fmtTHB = (n) =>
    (Number(n) || 0).toLocaleString("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handleSubmit = () => {
    if (!amountNum || isNaN(amountNum))
      return toast.error("กรุณาระบุจำนวนเงินที่ถูกต้อง");
    if (belowMin)
      return toast.error(`ขั้นต่ำในการถอนคือ ${fmtTHB(MIN_WITHDRAW)}`);
    if (exceedsBalance) return toast.error("ยอดถอนมากกว่ายอดเงินที่ใช้ได้");
    if (!formData.bank) return toast.error("กรุณาเลือกธนาคาร");
    if (!formData.accountNumber.trim()) return toast.error("กรุณากรอกเลขบัญชี");

    withdraw({
      userId: userData.id,
      amount: amountNum,
      bank: formData.bank,
      accountNumber: formData.accountNumber,
      accountName: userData.fullname || formData.accountName, // ensure name is sent
    });
  };

  useEffect(() => {
    if (!showWithdraw) closePage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showWithdraw]);

  const disableCTA =
    isPending ||
    !amountNum ||
    belowMin ||
    exceedsBalance ||
    !formData.bank ||
    !formData.accountNumber.trim();

  return (
    <>
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
          <div className="w-6" />
        </header>

        {/* Body */}
        <div className="flex flex-grow flex-col gap-5 overflow-y-auto rounded-t-[30px] bg-white p-6">
          {/* Available balance */}
          <div className="rounded-lg bg-gray-100 p-3 text-center text-sm text-gray-600">
            ยอดเงินที่ใช้ได้
            <span className="text-bg-dark ml-2 font-bold">
              {fmtTHB(displayBalance)}
            </span>
          </div>

          {/* Warning */}
          <div className="flex items-center gap-3 rounded-lg bg-yellow-50 p-3 text-yellow-800">
            <FaExclamationTriangle
              size={24}
              className="mt-1 flex-shrink-0 text-yellow-500"
            />
            <p className="text-base">
              <span className="font-bold">แจ้ง:</span>{" "}
              ชื่อบัญชีผู้รับต้องตรงกับชื่อของบัญชี 1 Wallet Premium เท่านั้น{" "}
              <span className="font-bold text-red-600">
                โปรดตรวจสอบชื่อบัญชีผู้รับก่อนโอน
              </span>
            </p>
          </div>

          {/* Account name (display only) */}
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
                value={userData?.fullname || ""}
                placeholder="ชื่อ-นามสกุลเจ้าของบัญชี"
                className="focus:border-primary-pink focus:ring-primary-pink/30 w-full rounded-xl border border-gray-300 bg-gray-100 p-4 pl-12 font-bold outline-none focus:ring-2"
                disabled
              />
            </div>
          </div>

          {/* Amount */}
          <div>
            <div
              className={`${belowMin || exceedsBalance ? "flex justify-between" : "flex justify-start"}`}
            >
              <label
                htmlFor="withdraw-amount"
                className="mb-2 block text-sm font-bold text-gray-500"
              >
                จำนวนเงิน
              </label>
              <label
                htmlFor="withdraw-amount"
                className="mb-2 block text-sm font-bold text-gray-500"
              >
                <span className="text-xs text-red-500">
                  {exceedsBalance && "ยอดเงินไม่เพียงพอ*"}
                </span>
              </label>
            </div>
            <input
              type="number"
              id="withdraw-amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              inputMode="decimal"
              placeholder="฿0.00"
              className={`text-bg-dark ${belowMin || exceedsBalance ? "border-red-500 bg-red-50" : "focus:border-primary-pink border-gray-300 bg-white"} focus:ring-primary-pink/30 w-full rounded-xl border p-4 text-lg font-bold outline-none focus:ring-2`}
            />
            {/* inline hints */}
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-600">
                ขั้นต่ำ {fmtTHB(MIN_WITHDRAW)}
              </span>
              <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-600">
                ค่าธรรมเนียม {Math.round(FEE_RATE * 100)}%
              </span>
            </div>
          </div>

          {/* Bank selector */}
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

          {/* Account Number */}
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

          {/* Calculation card */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
              <span>จำนวนเงินที่ขอถอน</span>
              <span className="text-bg-dark font-semibold">
                {fmtTHB(amountNum)}
              </span>
            </div>
            <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
              <span>ค่าธรรมเนียม ({Math.round(FEE_RATE * 100)}%)</span>
              <span className="font-semibold text-red-600">
                - {fmtTHB(fee)}
              </span>
            </div>
            <div className="my-2 h-px w-full bg-gray-200" />
            <div className="flex items-center justify-between text-base">
              <span className="font-bold text-gray-700">ยอดที่จะได้รับ</span>
              <span className="text-bg-dark text-3xl font-extrabold">
                {fmtTHB(net)}
              </span>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              ยอดเงินที่ใช้ได้:{" "}
              <span className="font-semibold text-gray-700">
                {fmtTHB(balance)}
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-auto flex items-center justify-center">
            <CtaButton
              onClick={handleSubmit}
              disabled={disableCTA}
              className="z-10 w-48 rounded-xl p-4 text-base font-bold disabled:opacity-60"
            >
              {isPending ? "กำลังดำเนินการ..." : "ต่อไป"}
            </CtaButton>
          </div>
        </div>
      </FramerDiv>
    </>
  );
}
