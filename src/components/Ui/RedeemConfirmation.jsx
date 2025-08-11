"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import CtaButton from "./CtaButton";
import { FaTrophy, FaGift } from "react-icons/fa";
import Image from "next/image";

export default function RedeemConfirmationModal({
  isOpen,
  onClose,
  onConfirmRedeem,
  onChangeGoal,
  currentBalance,
  goalProduct,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-sm rounded-2xl bg-white p-6 pt-12 text-center shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon on top */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 p-4 text-white shadow-lg">
              <FaTrophy size={32} />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold text-gray-800">ยินดีด้วย!</h2>
                <p className="text-gray-600">คุณออมเงินถึงเป้าหมายแล้ว</p>
              </div>

              {/* Goal Info */}
              <div className="flex flex-col items-center gap-2 rounded-lg bg-gray-100 p-3">
                <Image
                  src={goalProduct.imageUrl}
                  alt={goalProduct.model}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-md object-contain"
                />
                <p className="font-semibold text-gray-800">
                  {goalProduct.brand} {goalProduct.model}
                </p>
                <p className="text-sm text-gray-500">
                  ยอดเงินปัจจุบัน:{" "}
                  <span className="font-bold text-green-600">
                    ฿
                    {currentBalance.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </p>
              </div>

              <p className="text-base font-semibold text-gray-700">
                คุณต้องการทำอะไรต่อ?
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <CtaButton
                  onClick={onConfirmRedeem}
                  className={
                    "z-10 w-full rounded-xl p-4 py-3 text-base font-bold"
                  }
                >
                  แลกรับโทรศัพท์เครื่องนี้
                </CtaButton>
                <button
                  onClick={onChangeGoal}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-100 py-3 font-bold text-purple-700 transition-colors hover:bg-purple-200"
                >
                  <FaGift />
                  <span>ดูเป้าหมายที่ใกล้ขึ้น</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
