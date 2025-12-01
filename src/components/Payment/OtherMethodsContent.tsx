"use client";
import Image from "next/image";
import React from "react";
import { FaPaypal, FaLine } from "react-icons/fa";

export default function OtherMethodsContent() {
  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      <p className="text-center font-semibold text-gray-600">
        ช่องทางนี้ยังไม่เปิดให้บริการในขณะนี้
      </p>

      <div className="grid grid-cols-1 gap-2 opacity-50">
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-4">
          <FaLine className="h-6 w-auto text-5xl text-green-500" />
          <div>
            <p className="text-bg-dark font-bold">LINE Pay</p>
            <p className="text-sm text-gray-500">ชำระผ่านแอปพลิเคชัน LINE</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-4">
          <FaPaypal className="h-6 w-auto text-5xl text-blue-800" />
          <div>
            <p className="text-bg-dark font-bold">PayPal</p>
            <p className="text-sm text-gray-500">ชำระด้วยบัญชี PayPal</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-4">
          <Image
            src="/mastercard.png"
            width={100}
            height={100}
            alt="TrueMoney"
            className="h-6 w-auto"
          />
          <div>
            <p className="text-bg-dark font-bold">ทรูมันนี่ วอลเล็ต</p>
            <p className="text-sm text-gray-500">ชำระด้วยบัญชี TrueMoney</p>
          </div>
        </div>
      </div>
    </div>
  );
}
