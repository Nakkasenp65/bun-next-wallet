"use client";

import { useEffect, ChangeEvent } from "react";
import { motion, Variants } from "framer-motion";
import { Wallet } from "lucide-react";
import { Input } from "@/components/ui/input"; // Using Shadcn Input
import { cn } from "@/lib/utils"; // Using Shadcn utility for cleaner class merging

// --- Types ---
interface MonthlyPaymentStepProps {
  data: Record<string, string>;
  onChange: (e: { target: { name: string; value: string } }) => void;
  onValidationChange: (isValid: boolean) => void;
}

// --- Animation Variants ---
const contentVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

export const MonthlyPaymentStep = ({
  data,
  onChange,
  onValidationChange,
}: MonthlyPaymentStepProps) => {
  // --- STAGE 1: Configuration ---
  const fieldName = "monthlyPayment";
  const label = "คุณต้องการออมเดือนละเท่าไหร่?";
  const placeholder = "ขั้นต่ำ 500 บาท";
  const MINIMUM_AMOUNT = 500;

  const currentValue = data[fieldName] || "";

  // --- STAGE 2: Automatic Validation ---
  useEffect(() => {
    // 1. Must be a number
    // 2. Must be >= MINIMUM_AMOUNT
    const numericValue = Number(currentValue);
    const isValid =
      !isNaN(numericValue) &&
      numericValue >= MINIMUM_AMOUNT &&
      currentValue !== "";

    onValidationChange(isValid);
  }, [currentValue, onValidationChange]);

  // --- STAGE 3: Internal Event Handler ---
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Allow empty string (for deletion) but strip non-numeric chars
    const numericOnlyValue = value.replace(/[^0-9]/g, "");

    onChange({
      target: {
        name: name,
        value: numericOnlyValue,
      },
    });
  };

  // --- STAGE 4: Rendering ---
  return (
    <motion.div
      variants={contentVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex w-full flex-col items-center gap-4 text-center"
    >
      {/* --- Header Section --- */}
      <div className="flex flex-col items-center gap-2">
        <div className="from-primary-pink to-primary-orange rounded-full bg-gradient-to-br p-2 text-white shadow-md">
          <Wallet size={20} />
        </div>
        <label htmlFor={fieldName} className="text-lg font-bold text-slate-800">
          {label}
        </label>
      </div>

      {/* --- Shadcn Input Component --- */}
      <div className="w-full">
        <Input
          id={fieldName}
          name={fieldName}
          type="text"
          inputMode="numeric" // Shows number pad on mobile
          pattern="[0-9]*"
          placeholder={placeholder}
          value={currentValue}
          onChange={handleInputChange}
          className={cn(
            "w-full rounded-xl border-2 py-6 text-center text-base font-bold text-slate-900 shadow-sm transition-all placeholder:font-normal placeholder:text-slate-400",
            // Focus states to match your theme
            "focus-visible:border-primary-pink focus-visible:ring-4 focus-visible:ring-pink-200 focus-visible:ring-offset-0",
            // Default border color
            "border-gray-200",
          )}
        />

        {/* --- Validation Message --- */}
        {currentValue.length > 0 && Number(currentValue) < MINIMUM_AMOUNT && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm font-medium text-red-500"
          >
            ยอดออมขั้นต่ำคือ {MINIMUM_AMOUNT.toLocaleString()} บาท
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};
