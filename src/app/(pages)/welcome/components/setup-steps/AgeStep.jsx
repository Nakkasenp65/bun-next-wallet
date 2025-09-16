"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react"; // Icon for context
import DropDownComponent from "@/components/ui/DropDownComponent"; // Reverting to the Dropdown

const contentVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } },
};

export const AgeStep = ({ data, onChange, onValidationChange }) => {
  // --- STAGE 1: Configuration (remains the same) ---
  const fieldName = "age";
  const options = [
    { label: "15-20 ปี", value: "15-20" },
    { label: "21-30 ปี", value: "21-30" },
    { label: "31-40 ปี", value: "31-40" },
    { label: "41-50 ปี", value: "41-50" },
    { label: "51-60 ปี", value: "51-60" },
    { label: "มากกว่า 60 ปี", value: "60+" },
  ];
  const currentValue = data[fieldName] || "";

  // --- STAGE 2: Automatic Validation (remains the same) ---
  useEffect(() => {
    const isValid = currentValue.trim() !== "";
    onValidationChange(isValid);
  }, [currentValue, onValidationChange]);

  // --- STAGE 3: Internal Event Handler (remains the same) ---
  const handleSelectionChange = (selectedValue) => {
    onChange({
      target: {
        name: fieldName,
        value: selectedValue,
      },
    });
  };

  // --- STAGE 4: The Re-Woven Rendering (Polished Dropdown Version) ---
  return (
    <motion.div
      variants={contentVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex w-full flex-col items-center gap-4"
    >
      {/* --- Visual Futurist: A clear, friendly header --- */}
      <div className="flex flex-col items-center gap-2">
        <div className="from-primary-pink to-primary-orange rounded-full bg-gradient-to-br p-2 text-white shadow-md">
          <CalendarDays size={20} />
        </div>
        <h2 className="text-lg font-bold text-slate-800">ช่วงอายุของคุณ</h2>
      </div>

      {/* --- The Polished Dropdown Component with an Icon --- */}
      <div className="relative w-full">
        {/* The icon is placed absolutely within this wrapper */}
        <CalendarDays className="pointer-events-none absolute top-1/2 left-4 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />

        <DropDownComponent
          // The label is now the H2, so we don't need the component's label
          name={fieldName}
          value={currentValue}
          onChange={handleSelectionChange}
          options={options}
          placeholder="เลือกช่วงอายุของคุณ"
          buttonClassName="text-bg-dark focus:border-primary-pink w-full rounded-xl border-2 border-gray-200 bg-white p-4 pl-12 font-bold shadow-sm transition-all focus:ring-4 focus:ring-pink-200 focus:outline-none text-left" // [CRITICAL] text-left and pl-12
          optionsContainerClassName="p-2 border border-gray-200"
          optionClassName="rounded-lg p-3 hover:bg-gray-100"
        />
      </div>
    </motion.div>
  );
};
