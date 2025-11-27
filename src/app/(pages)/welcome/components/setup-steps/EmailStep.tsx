"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import clsx from "clsx";
import { Input } from "@/components/ui/input";

// --- Types ---
interface EmailStepProps {
  data: Record<string, string>;
  onChange: (
    e:
      | ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } },
  ) => void;
  onValidationChange: (isValid: boolean) => void;
  initialEmail?: string | null;
}

// --- Animation Variants ---
// Explicitly typed as 'Variants' to prevent TS errors
const contentVariants: Variants = {
  initial: { opacity: 0, y: 10, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: { duration: 0.2, ease: [0.5, 0, 0.75, 0] },
  },
};

export const EmailStep = ({
  data,
  onChange,
  onValidationChange,
  initialEmail,
}: EmailStepProps) => {
  // --- STAGE 1: Internal State Management ---
  // If initialEmail exists, start in 'confirm' mode, otherwise 'edit'
  const [mode, setMode] = useState<"confirm" | "edit">(
    initialEmail ? "confirm" : "edit",
  );
  const currentEmail = data.email || "";
  const [isValid, setIsValid] = useState(false);

  // --- STAGE 2: Automatic Validation ---
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validationResult = emailRegex.test(currentEmail);
    setIsValid(validationResult);
    onValidationChange(validationResult);
  }, [currentEmail, onValidationChange]);

  // Automatically set initial email on mount if provided
  useEffect(() => {
    if (initialEmail) {
      onChange({ target: { name: "email", value: initialEmail } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialEmail]);

  const handleSwitchToEditMode = () => {
    setMode("edit");
    // Clear the value to let user type a new one
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
        <label className="text-lg font-bold text-slate-800">
          ยืนยันอีเมลของคุณ
        </label>
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
            <p className="text-sm text-slate-500">
              ใช้อีเมลที่ผูกกับ LINE นี้ใช่หรือไม่?
            </p>
            {/* --- Display for the suggested email --- */}
            <div className="flex w-full items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-left">
              <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
              <span className="truncate text-sm font-semibold text-green-800">
                {initialEmail}
              </span>
            </div>

            {/* Change Email Button */}
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
            <p className="mb-2 text-sm text-slate-500">
              กรุณากรอกอีเมลที่ใช้งานได้จริง
            </p>

            {/* --- Shadcn Input Component --- */}
            <div className="relative">
              {/* Icon */}
              <Mail className="pointer-events-none absolute top-1/2 left-4 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <Input
                name="email"
                type="email"
                placeholder="example@email.com"
                value={currentEmail}
                onChange={onChange}
                autoFocus
                className={clsx(
                  "w-full rounded-xl border-2 py-6 pr-10 pl-12 text-base font-bold text-slate-900 shadow-sm transition-all focus-visible:ring-4 focus-visible:ring-offset-0",
                  {
                    // Default State
                    "focus-visible:border-primary-pink border-gray-200 focus-visible:ring-pink-200":
                      !currentEmail,
                    // Error State
                    "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200":
                      currentEmail && !isValid,
                    // Success State
                    "border-green-500 focus-visible:border-green-500 focus-visible:ring-green-200":
                      currentEmail && isValid,
                  },
                )}
              />

              {/* Validation Icons (Absolute Positioned) */}
              {currentEmail && isValid && (
                <CheckCircle className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-green-500" />
              )}
              {currentEmail && !isValid && (
                <AlertCircle className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-red-500" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
