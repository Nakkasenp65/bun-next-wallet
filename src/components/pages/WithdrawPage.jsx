"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faHashtag,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import CtaButton from "../Ui/CtaButton";
import FramerDiv from "../framerComponents/FramerDiv";

export default function WithdrawPage({
  userData,
  showWithdraw,
  setShowWithdraw,
}) {
  const [formData, setFormData] = useState({
    amount: "",
    accountNumber: "",
    recipient: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <FramerDiv
      isOpen={showWithdraw}
      id="withdraw-overlay"
      className="bg-bg-dark/80 fixed inset-0 z-40 flex flex-col backdrop-blur-sm"
    >
      <div
        id="withdraw-overlay"
        className="bg-bg-dark/80 fixed inset-0 z-40 flex flex-col backdrop-blur-sm"
      >
        {/* Header */}
        <header className="flex flex-shrink-0 items-center border-b border-white/20 px-5 pt-10 pb-4">
          <button
            onClick={() => setShowWithdraw((prev) => !prev)}
            className="text-secondary-text text-2xl transition-colors hover:text-white"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <h2 className="from-primary-pink to-primary-orange flex-grow bg-gradient-to-r bg-clip-text text-center text-xl font-bold text-transparent">
            ถอนเงิน
          </h2>
          <div className="w-6"></div> {/* Spacer */}
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
              type="text"
              id="withdraw-amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              inputMode="decimal"
              placeholder="฿0.00"
              className="focus:border-primary-pink focus:ring-primary-pink/30 w-full rounded-xl border border-gray-300 p-4 text-2xl font-bold outline-none focus:ring-2"
            />
          </div>

          {/* Input Group: Bank (Placeholder) */}
          <div>
            <label
              htmlFor="withdraw-bank-selector"
              className="mb-2 block text-sm font-bold text-gray-500"
            >
              ถอนไปยังบัญชีธนาคาร
            </label>
            <div
              id="withdraw-bank-selector"
              className="hover:border-vibrant-purple flex w-full cursor-pointer items-center justify-between rounded-xl border border-gray-300 p-4"
            >
              <span className="text-gray-400">เลือกธนาคาร</span>
              <FontAwesomeIcon
                icon={faChevronLeft}
                className="rotate-180 text-gray-400"
              />
            </div>
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
                name="recipient"
                value={formData.recipient}
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

          {/* CTA Button */}
          <div className="mt-auto">
            <CtaButton id="confirm-withdraw-btn">ต่อไป</CtaButton>
          </div>
        </div>
      </div>
    </FramerDiv>
  );
}
