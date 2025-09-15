"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Gift } from "lucide-react"; // Optional: for decoration

// --- Animation Variants (Internal to this component) ---
const contentVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } },
};

export const ReferralStep = ({ data, onChange, onValidationChange }) => {
  // --- STAGE 1: การกำหนดค่าคงที่ (Configuration) ---
  const fieldName = "referToCode";
  const label = "โค้ดแนะนำเพื่อน (ถ้ามี)";
  const placeholder = "เช่น ABC123";

  // ดึงค่าปัจจุบันจาก "แหล่งความจริง" (Parent's state)
  const currentValue = data[fieldName] || "";

  // --- STAGE 2: การตรวจสอบความถูกต้องอัตโนมัติ (Automatic Validation) ---
  useEffect(() => {
    // Structural Integrity Check: Step นี้ไม่บังคับกรอก
    // ดังนั้นมันจะ "ถูกต้อง" (valid) เสมอ
    const isValid = true;

    // Mission Report: รายงานสถานะความถูกต้องกลับไปยัง "ศูนย์บัญชาการ"
    onValidationChange(isValid);
  }, [onValidationChange]); // Dependency array มีแค่ onValidationChange เพราะ isValid เป็นค่าคงที่

  // --- STAGE 3: การจัดการเหตุการณ์ภายใน (Internal Event Handler) ---
  // แปลงค่าเป็นตัวพิมพ์ใหญ่ก่อนส่งกลับขึ้นไป
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({
      target: {
        name: name,
        value: value.toUpperCase(), // <-- Enforce uppercase format
      },
    });
  };

  // --- STAGE 4: การแสดงผล (Rendering) ---
  return (
    <motion.div
      variants={contentVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex w-full flex-col items-center gap-2 text-center"
    >
      <div className="mb-2 flex flex-col items-center gap-2">
        <div className="from-primary-pink to-primary-orange rounded-full bg-gradient-to-br p-2 text-white">
          <Gift size={20} />
        </div>
        <label htmlFor={fieldName} className="text-bg-dark font-medium">
          {label}
        </label>
      </div>

      <input
        id={fieldName}
        name={fieldName}
        type="text"
        placeholder={placeholder}
        value={currentValue}
        onChange={handleInputChange} // <-- ใช้ handler ที่สร้างขึ้น
        autoCapitalize="characters"
        spellCheck={false}
        className="text-bg-dark focus:border-primary-pink w-full rounded-xl border-2 border-gray-200 p-4 text-center font-bold tracking-widest shadow-sm transition-all focus:ring-4 focus:ring-pink-200 focus:outline-none"
      />
      <p className="mt-1 text-xs text-gray-500">หากไม่มี สามารถกด "คำนวณ" ได้เลย</p>
    </motion.div>
  );
};
