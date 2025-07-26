"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import CtaButton from "../Ui/CtaButton";
import FramerDiv from "../framerComponents/FramerDiv";

export default function DepositPage({ userData, showDeposit, setShowDeposit }) {
  const [amount, setAmount] = useState("");

  return (
    <FramerDiv
      isOpen={showDeposit}
      id="topup-overlay"
      className="bg-bg-dark/80 fixed inset-0 z-40 flex flex-col backdrop-blur-sm"
    >
      {/* Page Header */}
      <header className="flex flex-shrink-0 items-center border-b border-white/20 px-5 pt-10 pb-4">
        <button
          onClick={() => setShowDeposit((prev) => !prev)}
          className="text-secondary-text text-2xl transition-colors hover:text-white"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <h2 className="from-primary-pink to-primary-orange flex-grow bg-gradient-to-r bg-clip-text text-center text-xl font-bold text-transparent">
          เติมเงิน (ฝากเงิน)
        </h2>
        <div className="w-6"></div> {/* Spacer */}
      </header>

      {/* Page Content */}
      <div className="flex flex-grow flex-col gap-5 overflow-y-auto rounded-t-[30px] bg-white p-6">
        <div className="rounded-lg bg-gray-100 p-3 text-center text-sm text-gray-600">
          ยอดเงินปัจจุบัน
          <span className="text-bg-dark ml-2 font-bold">
            {/* 4. ใช้ balance จาก userData ที่ดึงมาโดยตรง */}฿
            {userData.wallet.balance.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        {/* Input Group: Amount */}
        <div>
          <label htmlFor="topup-amount" className="mb-2 block text-sm font-bold text-gray-500">
            จำนวนเงิน
          </label>
          <input
            type="text"
            id="topup-amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
            placeholder="฿0.00"
            className="focus:border-primary-pink focus:ring-primary-pink/30 w-full rounded-xl border border-gray-300 p-4 text-xl font-bold outline-none focus:ring-2"
          />
        </div>

        {/* CTA Button */}
        <div className="mt-auto">
          <CtaButton id="confirm-topup-btn">ยืนยันการเติมเงิน</CtaButton>
        </div>
      </div>
    </FramerDiv>
  );
}
