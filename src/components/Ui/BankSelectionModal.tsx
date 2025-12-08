"use client";
import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import Image from "next/image";
import FramerDiv from "../framerComponents/FramerDiv";
import { BANK_DATA } from "@/lib/bankData"; // <-- Import the data

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

        {/* Bank Grid */}
        <ul className="grid grid-cols-3 gap-4 overflow-y-auto p-6">
          {BANK_DATA.map((bank) => (
            <li
              key={bank.short_name_en}
              // The parent component expects an object with a `name` property.
              // We create it here to ensure compatibility.
              onClick={() => onBankSelect({ name: bank.name_th })}
              className="flex aspect-square cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-pink-500 hover:bg-pink-50 hover:shadow-md"
            >
              <Image
                width={64}
                height={64}
                src={bank.logo_url}
                alt={bank.name_th}
                className="h-12 w-auto object-contain"
              />
            </li>
          ))}
        </ul>
      </div>
    </FramerDiv>
  );
}
