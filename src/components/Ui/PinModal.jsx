"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import PinInput from "./PinInput";

const PinModal = ({
  isOpen,
  onClose,
  onComplete,
  recipient,
  amount,
  isPinDisabled,
}) => {
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
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col">
                <p className="text-sm text-gray-500">คุณกำลังจะโอนเงิน</p>
                <p className="text-4xl font-bold text-gray-800">
                  ฿
                  {parseFloat(amount || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  ให้กับ{" "}
                  <span className="font-bold">
                    {recipient?.line_display_name}
                  </span>
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <label className="font-bold text-gray-700">
                  กรุณายืนยันด้วยรหัส PIN
                </label>
                <PinInput
                  length={6}
                  onComplete={onComplete}
                  isPinDisabled={isPinDisabled}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PinModal;
