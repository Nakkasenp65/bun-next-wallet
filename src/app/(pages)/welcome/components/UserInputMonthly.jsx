"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CtaButton from "@/components/ui/CtaButton";
import ProgressIndicator from "./ProgressIndicator";

// --- นำเข้า "หน่วยปฏิบัติการพิเศษ" ทั้งหมด ---
import { EmailStep } from "./setup-steps/EmailStep";
import { AgeStep } from "./setup-steps/AgeStep";
import { OccupationStep } from "./setup-steps/OccupationStep";
import { ReferralStep } from "./setup-steps/ReferralStep";
import { MonthlyPaymentStep } from "./setup-steps/MonthlyPaymentStep"; // (สมมติว่าสร้างไฟล์นี้แล้ว)

// --- Animation Variants (Internal to this component) ---
const variants = {
  enter: (direction) => ({ x: direction > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (direction) => ({ zIndex: 0, x: direction < 0 ? "100%" : "-100%", opacity: 0 }),
};

export default function UserInputMonthly({ initialData, onComplete, initialEmail }) {
  // --- STAGE 1: สถานะภายใน (Internal State Management) ---
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false);

  // Wizard จะจัดการข้อมูลของตัวเอง โดยเริ่มต้นจาก initialData ที่ได้รับมา
  const [formData, setFormData] = useState(initialData || {});

  // --- STAGE 2: การจัดการเหตุการณ์ (Event Handler) ---
  // Handler กลางที่สามารถรับ event object มาตรฐานจาก HTML elements ได้
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- STAGE 3: กำหนดการแสดง (The Performance Lineup) ---
  const pages = [
    { component: EmailStep, props: { initialEmail } },
    { component: AgeStep },
    { component: OccupationStep },
    { component: MonthlyPaymentStep },
    { component: ReferralStep },
  ];

  const CurrentStepComponent = pages[page].component;
  const currentStepProps = pages[page].props || {};
  const isFinalStep = page === pages.length - 1;

  // --- STAGE 4: การควบคุมการเปลี่ยนหน้า (Navigation Control) ---
  const handleNext = () => {
    if (!isCurrentStepValid) return;
    setDirection(1);
    setPage((p) => p + 1);
  };

  const handleBack = () => {
    setDirection(-1);
    setPage((p) => p - 1);
  };

  const handleSubmit = () => {
    if (!isCurrentStepValid) return;
    // Mission Complete: ส่งมอบข้อมูลที่สมบูรณ์กลับไปยัง "วาทยกร"
    onComplete(formData);
  };

  return (
    <div className="gradient-background relative flex h-dvh flex-col items-center justify-center p-6">
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-sm rounded-2xl bg-white shadow-2xl backdrop-blur-lg"
      >
        <div className="relative p-6 py-10">
          <ProgressIndicator totalSteps={pages.length} currentStep={page} />
          <div className="relative h-48">
            {" "}
            {/* เพิ่มความสูงเล็กน้อยสำหรับ OccupationStep */}
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <CurrentStepComponent
                key={page}
                data={formData}
                onChange={handleChange}
                onValidationChange={setIsCurrentStepValid}
                {...currentStepProps}
                custom={direction}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute flex w-full flex-col gap-2"
              />
            </AnimatePresence>
          </div>
        </div>

        <div className="flex w-full justify-between rounded-b-2xl p-6">
          {page > 0 ? (
            <button onClick={handleBack} className="w-24 rounded-lg px-2 py-1 text-black">
              ย้อนกลับ
            </button>
          ) : (
            <div />
          )}

          <CtaButton
            onClick={isFinalStep ? handleSubmit : handleNext}
            disabled={!isCurrentStepValid}
            className="w-24 rounded-lg px-2 py-1"
          >
            {isFinalStep ? "คำนวณ" : "ต่อไป"}
          </CtaButton>
        </div>
      </motion.div>
    </div>
  );
}
