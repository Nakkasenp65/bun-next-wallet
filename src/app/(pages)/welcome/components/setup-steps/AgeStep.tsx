"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- Types ---
interface AgeStepProps {
  data: Record<string, string>; // Assuming data values are strings
  onChange: (e: { target: { name: string; value: string } }) => void;
  onValidationChange: (isValid: boolean) => void;
}

interface Option {
  label: string;
  value: string;
}

const contentVariants = {
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
} as const;

export const AgeStep = ({
  data,
  onChange,
  onValidationChange,
}: AgeStepProps) => {
  // --- STAGE 1: Configuration ---
  const fieldName = "age";
  const options: Option[] = [
    { label: "15-20 ปี", value: "15-20" },
    { label: "21-30 ปี", value: "21-30" },
    { label: "31-40 ปี", value: "31-40" },
    { label: "41-50 ปี", value: "41-50" },
    { label: "51-60 ปี", value: "51-60" },
    { label: "มากกว่า 60 ปี", value: "60+" },
  ];

  // Ensure we pass undefined to Select if the string is empty to show placeholder correctly
  const currentValue = data[fieldName] || "";

  // --- STAGE 2: Automatic Validation ---
  useEffect(() => {
    const isValid = currentValue.trim() !== "";
    onValidationChange(isValid);
  }, [currentValue, onValidationChange]);

  // --- STAGE 3: Internal Event Handler ---
  // Shadcn Select provides the value string directly
  const handleValueChange = (value: string) => {
    onChange({
      target: {
        name: fieldName,
        value: value,
      },
    });
  };

  // --- STAGE 4: Rendering with Shadcn UI ---
  return (
    <motion.div
      variants={contentVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex w-full flex-col items-center gap-4"
    >
      {/* --- Header Section --- */}
      <div className="flex flex-col items-center gap-2">
        <div className="from-primary-pink to-primary-orange rounded-full bg-gradient-to-br p-2 text-white shadow-md">
          <CalendarDays size={20} />
        </div>
        <h2 className="text-lg font-bold text-slate-800">ช่วงอายุของคุณ</h2>
      </div>

      {/* --- Shadcn Select Component --- */}
      <div className="relative w-full">
        {/* Absolute Icon Layer */}
        <CalendarDays className="pointer-events-none absolute top-1/2 left-4 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />

        <Select
          value={currentValue || undefined}
          onValueChange={handleValueChange}
        >
          <SelectTrigger
            className="focus:border-primary-pink w-full rounded-xl border-2 border-gray-200 bg-white p-4 py-6 pl-12 font-bold text-slate-900 shadow-sm transition-all focus:ring-4 focus:ring-pink-200 focus:outline-none"
            // Note: 'py-6' added to match the height feel of custom inputs
            // 'pl-12' ensures text doesn't overlap the icon
          >
            <SelectValue placeholder="เลือกช่วงอายุของคุณ" />
          </SelectTrigger>
          <SelectContent className="border-gray-200">
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="cursor-pointer rounded-lg p-3 hover:bg-gray-100 focus:bg-gray-100 focus:text-slate-900"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
};
