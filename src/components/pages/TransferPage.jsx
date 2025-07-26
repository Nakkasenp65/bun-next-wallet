"use client";
import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoMdPerson } from "react-icons/io";
import { FaHashtag } from "react-icons/fa6";

import CtaButton from "../Ui/CtaButton";
import FramerDiv from "../framerComponents/FramerDiv";

export default function TransferPage({ userData, setShowTransfer, showTransfer }) {
  const [formData, setFormData] = useState({
    amount: "",
    recipient: "",
    account: "",
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
      isOpen={showTransfer}
      id="transfer-overlay"
      className="bg-bg-dark/80 fixed inset-0 z-40 flex flex-col backdrop-blur-sm"
    >
      {/* Page Header */}
      <header className="flex items-center px-5 pt-10 pb-4">
        <div onClick={() => setShowTransfer(false)} className="text-secondary-text text-2xl">
          <IoIosArrowBack className="text-3xl" />
        </div>
        <h2 className="from-primary-pink to-primary-orange flex-grow bg-gradient-to-r bg-clip-text text-center text-xl font-bold text-transparent">
          โอนเงิน
        </h2>
        <div className="w-6" /> {/* Spacer to keep title perfectly centered */}
      </header>

      {/* Page Content */}
      <div className="flex flex-col gap-6 rounded-t-4xl bg-white p-6">
        {/* Account Balance */}
        <div className="rounded-lg bg-gray-100 p-3 text-center text-sm text-gray-600">
          ยอดเงินที่ใช้ได้
          <span className="text-bg-dark ml-2 font-bold">
            ฿
            {userData?.wallet.balance.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        {/* Input Group: Amount */}
        <div className="flex flex-col gap-2">
          <label htmlFor="transfer-amount" className=" block text-sm font-bold text-gray-500">
            จำนวนเงิน
          </label>
          <input
            type="number"
            id="transfer-amount"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            inputMode="decimal"
            placeholder="฿0.00"
            className="text-bg-dark focus:border-primary-pink focus:ring-primary-pink/30 w-full rounded-xl border border-gray-300 p-4 font-bold focus:ring-2 focus:outline-none"
          />
        </div>

        {/* Input Group: Recipient Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="transfer-recipient" className=" text-sm font-bold text-gray-500">
            ผู้รับโอน
          </label>
          <div className="relative">
            <IoMdPerson className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="transfer-recipient"
              name="recipient"
              value={formData.recipient}
              onChange={handleInputChange}
              placeholder="ชื่อ-นามสกุล"
              className="focus:border-primary-pink focus:ring-primary-pink/30 w-full rounded-xl border border-gray-300 p-4 pl-12 focus:ring-2 focus:outline-none text-bg-dark"
            />
          </div>
        </div>

        {/* Input Group: Bank (Placeholder for now) */}
        <div className="flex flex-col gap-2">
          <label htmlFor="transfer-bank-selector" className=" text-sm font-bold text-gray-500">
            ธนาคารผู้รับ
          </label>
          <div
            id="transfer-bank-selector"
            className="hover:border-vibrant-purple flex w-full cursor-pointer items-center justify-between rounded-xl border border-gray-300 p-3"
          >
            <span className="text-gray-400">เลือกธนาคาร / พร้อมเพย์</span>
            <IoIosArrowBack className="text-3xl rotate-180 text-gray-400" />
          </div>
        </div>

        {/* Input Group: Account Number */}
        <div className="flex flex-col gap-2">
          <label htmlFor="transfer-account" className=" text-sm font-bold text-gray-500">
            เลขบัญชี / เบอร์โทรศัพท์
          </label>
          <div className="relative">
            <FaHashtag className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="transfer-account"
              name="account"
              value={formData.account}
              onChange={handleInputChange}
              placeholder="กรอกเลขบัญชีหรือเบอร์โทร"
              className="focus:border-primary-pink focus:ring-primary-pink/30 w-full rounded-xl border border-gray-300 p-4 pl-12 focus:ring-2 focus:outline-none text-bg-dark"
            />
          </div>
        </div>

        {/* Fee Display */}
        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 text-base">
          <span className="text-gray-600">ค่าบริการ</span>
          <span className="text-bg-dark font-bold">฿300.00</span>
        </div>

        {/* CTA Button */}
        <div className="mt-auto">
          <CtaButton>ต่อไป</CtaButton>
        </div>
      </div>
    </FramerDiv>
  );
}
