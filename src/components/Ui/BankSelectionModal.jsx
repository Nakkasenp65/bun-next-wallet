"use client";
import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import Image from "next/image";
import FramerDiv from "../framerComponents/FramerDiv";

const banks = [
  { id: "promptpay", name: "พร้อมเพย์ (PromptPay)", logo: "/promptpay-logo.png" },
  { id: "kbank", name: "กสิกรไทย (KBank)", logo: "/kbank-logo.png" },
  { id: "scb", name: "ไทยพาณิชย์ (SCB)", logo: "/scb-logo.png" },
  { id: "bbl", name: "กรุงเทพ (BBL)", logo: "/bbl-logo.png" },
];

export default function BankSelectionModal({ isOpen, onClose, onBankSelect }) {
  return (
    <FramerDiv isOpen={isOpen} className="fixed inset-0 z-50 flex flex-col justify-center">
      <div className="w-full h-full flex flex-col rounded-3xl bg-white  mx-auto  drop-shadow-xl">
        {/* Modal Header */}
        <header className="relative flex flex-shrink-0 items-center justify-center p-4">
          <IoIosArrowBack className="absolute top-4 left-4 cursor-pointer text-bg-dark" size={32} onClick={onClose} />
          <h2 className="text-lg text-bg-dark font-bold">เลือกธนาคาร</h2>
        </header>

        {/* Bank List */}
        <ul className="flex flex-col gap-2 flex-grow overflow-y-auto p-4">
          {banks.map((bank) => (
            <li
              key={bank.id}
              onClick={() => onBankSelect(bank)}
              className="flex cursor-pointer border bg-stone-100 border-stone-100 items-center gap-4 rounded-lg p-3 transition-colors hover:bg-gray-100"
            >
              <Image width={50} height={50} src={bank.logo} alt={bank.name} className="h-8 w-8 rounded-md" />
              <span className="font-semibold text-bg-dark">{bank.name}</span>
            </li>
          ))}
          <div className="w-full my-8  border-black border-t" />
          <li className="flex justify-center cursor-pointer border bg-stone-100 border-stone-100 items-center gap-4 rounded-lg p-3 transition-colors hover:bg-gray-100">
            <span className=" font-semibold text-bg-dark">หรือชำระผ่านช่องทางอื่นๆ...</span>
          </li>
        </ul>
      </div>
    </FramerDiv>
  );
}
