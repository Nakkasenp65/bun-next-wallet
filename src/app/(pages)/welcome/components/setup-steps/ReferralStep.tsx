"use client";

import { useEffect, ChangeEvent } from "react";
import { motion, Variants } from "framer-motion";
import { Gift } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// --- Types ---
interface ReferralStepProps {
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

export const ReferralStep = ({
  data,
  onChange,
  onValidationChange,
}: ReferralStepProps) => {
  // --- STAGE 1: Configuration ---
  const fieldName = "referToCode";
  const label = "โค้ดแนะนำเพื่อน (ถ้ามี)";
  const placeholder = "เช่น ABC123";

  const currentValue = data[fieldName] || "";

  // --- STAGE 2: Automatic Validation ---
  useEffect(() => {
    // This step is optional, so it is always valid.
    onValidationChange(true);
  }, [onValidationChange]);

  // --- STAGE 3: Internal Event Handler ---
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({
      target: {
        name: name,
        value: value.toUpperCase(), // Enforce uppercase
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
      className="flex w-full flex-col items-center gap-2 text-center"
    >
      {/* --- Header --- */}
      <div className="from-primary-pink to-primary-orange rounded-full bg-gradient-to-br p-2 text-white shadow-md">
        <Gift size={20} />
      </div>
      <label htmlFor={fieldName} className="text-lg font-bold text-slate-800">
        {label}
      </label>

      {/* --- Shadcn Input Component --- */}
      <div className="flex w-full flex-col items-center gap-2">
        <Input
          id={fieldName}
          name={fieldName}
          type="text"
          placeholder={placeholder}
          value={currentValue}
          onChange={handleInputChange}
          autoCapitalize="characters"
          spellCheck={false}
          className={cn(
            "w-full rounded-xl border-2 py-6 text-center text-base text-slate-900 uppercase shadow-sm transition-all",
            "border-gray-200 placeholder:tracking-normal placeholder:text-slate-400 placeholder:normal-case",
            // Focus styles
            "focus-visible:border-primary-pink focus-visible:ring-4 focus-visible:ring-pink-200 focus-visible:ring-offset-0",
          )}
        />

        <p className="mt-3 text-sm text-slate-500">
          หากไม่มี สามารถกด "คำนวณ" ได้เลย
        </p>
      </div>
    </motion.div>
  );
};
