"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Wallet } from "lucide-react"; // Optional: for decoration

// --- Animation Variants (Internal to this component) ---
const contentVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } },
};

/**
 * [Specialist Unit] A self-contained step for gathering and validating
 * the user's desired monthly payment amount.
 * @param {object} props
 * @param {object} props.data - The current form data object from the parent.
 * @param {function} props.onChange - The function to call to update the parent's form data.
 * @param {function} props.onValidationChange - The function to call to inform the parent of validity status.
 */
export const MonthlyPaymentStep = ({ data, onChange, onValidationChange }) => {
  // --- STAGE 1: การกำหนดค่าคงที่ (Configuration) ---
  const fieldName = "monthlyPayment";
  const label = "คุณต้องการออมเดือนละเท่าไหร่?";
  const placeholder = "ขั้นต่ำ 500 บาท";
  const MINIMUM_AMOUNT = 500;

  // ดึงค่าปัจจุบันจาก "แหล่งความจริง" (Parent's state)
  const currentValue = data[fieldName] || "";

  // --- STAGE 2: การตรวจสอบความถูกต้องอัตโนมัติ (Automatic Validation) ---
  useEffect(() => {
    // Structural Integrity Check:
    // 1. ต้องเป็นตัวเลขที่ถูกต้อง (is a Number)
    // 2. และต้องมากกว่าหรือเท่ากับค่าขั้นต่ำ
    const numericValue = Number(currentValue);
    const isValid = !isNaN(numericValue) && numericValue >= MINIMUM_AMOUNT;

    // Mission Report: รายงานสถานะความถูกต้องกลับไปยัง "ศูนย์บัญชาการ"
    onValidationChange(isValid);
  }, [currentValue, onValidationChange]);

  // --- STAGE 3: การจัดการเหตุการณ์ภายใน (Internal Event Handler) ---
  // กรองให้รับเฉพาะตัวเลข
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // อนุญาตให้เป็นค่าว่างได้ (เพื่อให้ผู้ใช้ลบทั้งหมดได้) แต่กรองตัวอักษรออก
    const numericOnlyValue = value.replace(/[^0-9]/g, "");
    onChange({
      target: {
        name: name,
        value: numericOnlyValue,
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
          <Wallet size={20} />
        </div>
        <label htmlFor={fieldName} className="text-bg-dark font-medium">
          {label}
        </label>
      </div>

      <input
        id={fieldName}
        name={fieldName}
        type="text" // ใช้ type="text" เพื่อควบคุม inputMode และป้องกันปัญหา UI ของ number input
        inputMode="numeric" // แสดงแป้นพิมพ์ตัวเลขบนมือถือ
        pattern="[0-9]*" // ช่วยในการ validation ของเบราว์เซอร์
        placeholder={placeholder}
        value={currentValue}
        onChange={handleInputChange} // <-- ใช้ handler ที่กรองตัวเลข
        className="text-bg-dark focus:border-primary-pink w-full rounded-xl border-2 border-gray-200 p-4 text-center font-bold tracking-wider shadow-sm transition-all focus:ring-4 focus:ring-pink-200 focus:outline-none"
      />

      {/* แสดงข้อความเตือนเมื่อผู้ใช้เริ่มพิมพ์และค่ายังไม่ถึงขั้นต่ำ */}
      {currentValue.length > 0 && Number(currentValue) < MINIMUM_AMOUNT && (
        <p className="mt-1 text-xs text-red-500">
          ยอดออมขั้นต่ำคือ {MINIMUM_AMOUNT.toLocaleString()} บาท
        </p>
      )}
    </motion.div>
  );
};
