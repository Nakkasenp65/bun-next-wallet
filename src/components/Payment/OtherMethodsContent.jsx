"use client";
import React from "react";
import { FaPaypal, FaLine } from "react-icons/fa";

export default function OtherMethodsContent() {
  return (
    <div className="p-4 pt-6">
      <h2 className="text-xl font-bold text-gray-800">
        <span className="text-red-500">...</span> ช่องทางการชำระเงินอื่นๆ
      </h2>

      <div className="mt-6 rounded-2xl bg-pink-600 p-4 text-center text-white shadow-lg">
        <p className="text-sm">ยอดชำระ:</p>
        <p className="text-3xl font-bold tracking-wider">1,770.00 บาท</p>
      </div>

      <p className="mt-4 text-center font-semibold text-gray-600">ช่องทางนี้ยังไม่เปิดให้บริการในขณะนี้</p>

      <div className="mt-6 space-y-3 opacity-50">
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-4">
          <FaLine className="text-5xl text-green-500" />
          <div>
            <p className="font-bold">LINE Pay</p>
            <p className="text-sm text-gray-500">ชำระผ่านแอปพลิเคชัน LINE</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-4">
          <FaPaypal className="text-5xl text-blue-800" />
          <div>
            <p className="font-bold">PayPal</p>
            <p className="text-sm text-gray-500">ชำระด้วยบัญชี PayPal</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-4">
          <img
            src="https://www.truemoney.com/wp-content/uploads/2021/01/truemoney-wallet-logo.png"
            alt="TrueMoney"
            className="h-12"
          />
          <div>
            <p className="font-bold">ทรูมันนี่ วอลเล็ต</p>
            <p className="text-sm text-gray-500">ชำระด้วยบัญชี TrueMoney</p>
          </div>
        </div>
      </div>
    </div>
  );
}
