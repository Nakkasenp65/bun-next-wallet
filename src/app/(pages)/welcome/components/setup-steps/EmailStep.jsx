"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import clsx from "clsx"; // A utility for conditionally joining class names

// --- Animation Variants (Internal to this component) ---
const contentVariants = {
  initial: { opacity: 0, y: 10, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] } },
  exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.2, ease: [0.5, 0, 0.75, 0] } },
};

export const EmailStep = ({ data, onChange, onValidationChange, initialEmail }) => {
  // --- STAGE 1: Internal State Management ---
  const [mode, setMode] = useState(initialEmail ? "confirm" : "edit");
  const currentEmail = data.email || "";
  const [isValid, setIsValid] = useState(false);

  // --- STAGE 2: Automatic Validation ---
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validationResult = emailRegex.test(currentEmail);
    setIsValid(validationResult);
    onValidationChange(validationResult);
  }, [currentEmail, onValidationChange]);

  // Automatically set initial email on mount
  useEffect(() => {
    if (initialEmail) {
      onChange({ target: { name: "email", value: initialEmail } });
    }
  }, [initialEmail]);

  const handleSwitchToEditMode = () => {
    setMode("edit");
    onChange({ target: { name: "email", value: "" } });
  };

  // --- STAGE 3: Rendering ---
  return (
    <motion.div
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* --- Visual Futurist: Refined Header --- */}
      <div className="mb-6 flex flex-col items-center gap-2">
        <div className="from-primary-pink to-primary-orange rounded-full bg-gradient-to-br p-2 text-white shadow-md">
          <Mail size={20} />
        </div>
        <label className="text-lg font-bold text-slate-800">ยืนยันอีเมลของคุณ</label>
      </div>

      <AnimatePresence mode="wait">
        {mode === "confirm" && initialEmail ? (
          // --- The "Happy Path": Confirmation Mode ---
          <motion.div
            key="confirm"
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex w-full flex-col items-center gap-4"
          >
            <p className="text-sm text-slate-500">ใช้อีเมลที่ผูกกับ LINE นี้ใช่หรือไม่?</p>
            {/* --- A more prominent display for the suggested email --- */}
            <div className="flex w-full items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-left">
              <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
              <span className="truncate text-sm font-semibold text-green-800">{initialEmail}</span>
            </div>

            {/* The secondary action is more subtle */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSwitchToEditMode}
              className="mt-1 rounded-md px-3 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              ใช้อีเมลอื่น
            </motion.button>
          </motion.div>
        ) : (
          // --- The "Flexible Path": Edit Mode ---
          <motion.div
            key="edit"
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
          >
            <p className="mb-2 text-sm text-slate-500">กรุณากรอกอีเมลที่ใช้งานได้จริง</p>
            {/* --- An interactive and responsive input field --- */}
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                name="email"
                type="email"
                placeholder="example@email.com"
                value={currentEmail}
                onChange={onChange}
                className={clsx(
                  "text-bg-dark w-full rounded-xl border-2 p-2 pr-8 pl-10 text-left font-bold shadow-sm transition-all focus:ring-4 focus:outline-none",
                  {
                    "border-gray-200 focus:border-pink-400 focus:ring-pink-200": !currentEmail,
                    "border-red-500 focus:border-red-500 focus:ring-red-200":
                      currentEmail && !isValid,
                    "border-green-500 focus:border-green-500 focus:ring-green-200":
                      currentEmail && isValid,
                  },
                )}
                autoFocus
              />
              {currentEmail && isValid && (
                <CheckCircle className="pointer-events-none absolute top-1/2 right-2 h-5 w-5 -translate-y-1/2 text-green-500" />
              )}
              {currentEmail && !isValid && (
                <AlertCircle className="pointer-events-none absolute top-1/2 right-2 h-5 w-5 -translate-y-1/2 text-red-500" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
