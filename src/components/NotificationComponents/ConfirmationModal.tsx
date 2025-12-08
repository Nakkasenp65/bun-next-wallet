// file: components/ConfirmationModal.js (หรือตามโครงสร้างของคุณ)

"use client";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, LoaderCircle } from "lucide-react";
import { useEffect } from "react";

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isConfirming = false,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          // --- The Backdrop ---
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            // --- The Modal Panel ---
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            className="relative w-11/12 max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl"
          >
            {/* --- Visual Futurist: Icon & Typography --- */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-slate-800">{title}</h2>
            <p className="mt-2 text-sm text-slate-500">{message}</p>

            {/* --- Interaction Choreographer: Action Buttons --- */}
            <div className="mt-6 flex gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="h-12 flex-1 rounded-xl bg-slate-100 font-semibold text-slate-700 transition-colors hover:bg-slate-200"
              >
                ยกเลิก
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onConfirm}
                disabled={isConfirming}
                className="relative h-12 flex-1 rounded-xl bg-red-600 font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
              >
                {isConfirming ? (
                  <LoaderCircle className="absolute top-1/2 left-1/2 -mt-3 -ml-3 h-6 w-6 animate-spin" />
                ) : (
                  "ยืนยัน"
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
