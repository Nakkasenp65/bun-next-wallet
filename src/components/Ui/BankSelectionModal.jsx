"use client";
import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import Image from "next/image";
import FramerDiv from "../framerComponents/FramerDiv";

const banks = [
  {
    id: "promptpay",
    name: "พร้อมเพย์ (PromptPay)",
    logo: "/promptpay-logo.png",
  },
  { id: "kbank", name: "กสิกรไทย (KBank)", logo: "/kbank-logo.png" },
  { id: "scb", name: "ไทยพาณิชย์ (SCB)", logo: "/scb-logo.png" },
  { id: "bbl", name: "กรุงเทพ (BBL)", logo: "/bbl-logo.png" },
];

export default function BankSelectionModal({ isOpen, onClose, onBankSelect }) {
  return (
    <FramerDiv
      isOpen={isOpen}
      className="fixed inset-0 z-50 flex flex-col justify-center"
    >
      <div className="mx-auto flex h-full w-full flex-col rounded-3xl bg-white drop-shadow-xl">
        {/* Modal Header */}
        <header className="relative flex flex-shrink-0 items-center justify-center p-4">
          <IoIosArrowBack
            className="text-bg-dark absolute top-4 left-4 cursor-pointer"
            size={32}
            onClick={onClose}
          />
          <h2 className="text-bg-dark text-lg font-bold">เลือกธนาคาร</h2>
        </header>

        {/* Bank List */}
        <ul className="flex flex-grow flex-col gap-2 overflow-y-auto p-4">
          {banks.map((bank) => (
            <li
              key={bank.id}
              onClick={() => onBankSelect(bank)}
              className="flex cursor-pointer items-center gap-4 rounded-lg border border-stone-100 bg-stone-100 p-3 transition-colors hover:bg-gray-100"
            >
              <Image
                width={50}
                height={50}
                src={bank.logo}
                alt={bank.name}
                className="h-8 w-8 rounded-md"
              />
              <span className="text-bg-dark font-semibold">{bank.name}</span>
            </li>
          ))}
          <div className="my-8 w-full border-t border-black" />
          <li className="flex cursor-pointer items-center justify-center gap-4 rounded-lg border border-stone-100 bg-stone-100 p-3 transition-colors hover:bg-gray-100">
            <span className="text-bg-dark font-semibold">
              หรือชำระผ่านช่องทางอื่นๆ...
            </span>
          </li>
        </ul>
      </div>
    </FramerDiv>
  );
}
