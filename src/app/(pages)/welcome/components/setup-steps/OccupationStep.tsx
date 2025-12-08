"use client";

import { useEffect, ChangeEvent } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Briefcase } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// --- Types ---
interface OccupationStepProps {
  data: Record<string, string>;
  onChange: (
    e:
      | ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } },
  ) => void;
  onValidationChange: (isValid: boolean) => void;
}

interface Option {
  label: string;
  value: string;
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

const inputVariants: Variants = {
  initial: { opacity: 0, y: -10, height: 0 },
  animate: {
    opacity: 1,
    y: 0,
    height: "auto",
    transition: { delay: 0.1, type: "spring", stiffness: 100 },
  },
  exit: { opacity: 0, y: -10, height: 0, transition: { duration: 0.2 } },
};

export const OccupationStep = ({
  data,
  onChange,
  onValidationChange,
}: OccupationStepProps) => {
  // --- STAGE 1: Configuration ---
  const fieldName = "occupation";
  const customFieldName = "customOccupation";

  const options: Option[] = [
    { label: "นักศึกษา", value: "นักศึกษา" },
    {
      label: "ข้าราชการ / เจ้าหน้าที่รัฐ",
      value: "ข้าราชการ / เจ้าหน้าที่รัฐ",
    },
    { label: "พนักงานบริษัท", value: "พนักงานบริษัท" },
    { label: "ธุรกิจส่วนตัว / ค้าขาย", value: "ธุรกิจส่วนตัว / ค้าขาย" },
    { label: "ฟรีแลนซ์", value: "ฟรีแลนซ์" },
    { label: "แพทย์ / พยาบาล", value: "แพทย์ / พยาบาล" },
    { label: "สถาปนิก / วิศวกร", value: "สถาปนิก / วิศวกร" },
    { label: "นักการตลาด / PR", value: "นักการตลาด / PR" },
    { label: "ศิลปิน / นักออกแบบ", value: "ศิลปิน / นักออกแบบ" },
    { label: "เกษตรกร", value: "เกษตรกร" },
    { label: "อื่นๆ", value: "อื่นๆ" },
  ];

  // Handle undefined values gracefully
  const currentOccupation = data[fieldName] || "";
  const customOccupation = data[customFieldName] || "";

  // --- STAGE 2: Automatic Validation ---
  useEffect(() => {
    let isValid = false;
    if (currentOccupation && currentOccupation !== "อื่นๆ") {
      isValid = true;
    } else if (
      currentOccupation === "อื่นๆ" &&
      customOccupation.trim() !== ""
    ) {
      isValid = true;
    }
    onValidationChange(isValid);
  }, [currentOccupation, customOccupation, onValidationChange]);

  // --- STAGE 3: Internal Event Handlers ---

  // Handler for Shadcn Select (returns string directly)
  const handleSelectChange = (value: string) => {
    onChange({ target: { name: fieldName, value: value } });

    // Clear custom occupation if user switches away from "Others"
    if (value !== "อื่นๆ" && customOccupation) {
      onChange({ target: { name: customFieldName, value: "" } });
    }
  };

  // --- STAGE 4: Rendering ---
  return (
    <motion.div
      variants={contentVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex w-full flex-col items-center gap-4"
    >
      {/* --- Header --- */}
      <div className="flex flex-col items-center gap-2">
        <div className="from-primary-pink to-primary-orange rounded-full bg-gradient-to-br p-2 text-white shadow-md">
          <Briefcase size={20} />
        </div>
        <h2 className="text-lg font-bold text-slate-800">อาชีพของคุณ</h2>
      </div>

      {/* --- Shadcn Select Component --- */}
      <div className="relative w-full">
        {/* Absolute Icon */}
        <Briefcase className="pointer-events-none absolute top-1/2 left-4 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />

        <Select
          value={currentOccupation || undefined}
          onValueChange={handleSelectChange}
        >
          <SelectTrigger
            className={cn(
              "w-full rounded-xl border-2 bg-white py-6 pr-4 pl-12 font-bold text-slate-900 shadow-sm transition-all",
              "focus:border-primary-pink border-gray-200 focus:ring-4 focus:ring-pink-200 focus:outline-none",
            )}
          >
            <SelectValue placeholder="เลือกอาชีพของคุณ" />
          </SelectTrigger>
          <SelectContent className="max-h-60 border-gray-200">
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

      {/* --- Conditional Custom Input (Shadcn Input) --- */}
      <AnimatePresence>
        {currentOccupation === "อื่นๆ" && (
          <motion.div
            key="custom-occupation-input"
            variants={inputVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full overflow-hidden" // overflow-hidden prevents animation glitches
          >
            <Input
              name={customFieldName}
              type="text"
              placeholder="กรุณาระบุอาชีพ"
              value={customOccupation}
              onChange={onChange} // Pass event directly for Input
              autoFocus
              className={cn(
                "w-full rounded-xl border-2 py-6 text-base font-bold shadow-sm transition-all",
                "focus-visible:border-primary-pink border-gray-200 focus-visible:ring-4 focus-visible:ring-pink-200 focus-visible:ring-offset-0",
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
