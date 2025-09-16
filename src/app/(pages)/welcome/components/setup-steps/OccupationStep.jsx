"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase } from "lucide-react"; // Icon for Occupation
import DropDownComponent from "@/components/ui/DropDownComponent";

// --- Animation Variants (Internal to this component) ---
const contentVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } },
};

const inputVariants = {
  initial: { opacity: 0, y: -10, height: 0 },
  animate: {
    opacity: 1,
    y: 0,
    height: "auto",
    transition: { delay: 0.1, type: "spring", stiffness: 100 },
  },
  exit: { opacity: 0, y: -10, height: 0, transition: { duration: 0.2 } },
};

export const OccupationStep = ({ data, onChange, onValidationChange }) => {
  // --- STAGE 1: Configuration (remains the same) ---
  const fieldName = "occupation";
  const customFieldName = "customOccupation";
  const options = [
    { label: "นักศึกษา", value: "นักศึกษา" },
    { label: "ข้าราชการ / เจ้าหน้าที่รัฐ", value: "ข้าราชการ / เจ้าหน้าที่รัฐ" },
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

  const currentOccupation = data[fieldName] || "";
  const customOccupation = data[customFieldName] || "";

  // --- STAGE 2: Automatic Validation (remains the same) ---
  useEffect(() => {
    let isValid = false;
    if (currentOccupation && currentOccupation !== "อื่นๆ") {
      isValid = true;
    } else if (currentOccupation === "อื่นๆ" && customOccupation.trim() !== "") {
      isValid = true;
    }
    onValidationChange(isValid);
  }, [currentOccupation, customOccupation, onValidationChange]);

  // --- STAGE 3: Internal Event Handlers (remains the same) ---
  const handleDropdownChange = (selectedValue) => {
    onChange({ target: { name: fieldName, value: selectedValue } });
    if (selectedValue !== "อื่นๆ" && customOccupation) {
      onChange({ target: { name: customFieldName, value: "" } });
    }
  };

  // --- STAGE 4: The Re-Woven Rendering ---
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
          <Briefcase size={20} />
        </div>
        <h2 className="text-lg font-bold text-slate-800">อาชีพของคุณ</h2>
      </div>

      {/* --- The Polished Dropdown Component with an Icon --- */}
      <div className="relative w-full">
        <Briefcase className="pointer-events-none absolute top-1/2 left-4 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <DropDownComponent
          name={fieldName}
          value={currentOccupation}
          onChange={handleDropdownChange}
          options={options}
          placeholder="เลือกอาชีพของคุณ"
          buttonClassName="text-bg-dark focus:border-primary-pink w-full rounded-xl border-2 border-gray-200 bg-white p-4 pl-12 font-bold shadow-sm transition-all focus:ring-4 focus:ring-pink-200 focus:outline-none text-left"
          optionsContainerClassName="p-2 border border-gray-200"
          optionClassName="rounded-lg p-3 hover:bg-gray-100"
        />
      </div>

      {/* --- The Smoothly Animated Conditional Input --- */}
      <AnimatePresence>
        {currentOccupation === "อื่นๆ" && (
          <motion.div
            key="custom-occupation-input"
            variants={inputVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full" // Use w-full to match the dropdown's width
          >
            <div className="relative">
              <input
                name={customFieldName}
                type="text"
                placeholder="กรุณาระบุอาชีพ"
                value={customOccupation}
                onChange={onChange}
                className="text-bg-dark focus:border-primary-pink w-full rounded-xl border-2 border-gray-200 p-4 font-bold shadow-sm transition-all focus:ring-4 focus:ring-pink-200 focus:outline-none"
                autoFocus
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
