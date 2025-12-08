"use client";

import { useState, ChangeEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CtaButton from "@/components/ui/CtaButton";
import ProgressIndicator from "./ProgressIndicator";

// --- Import Steps ---
import { EmailStep } from "./setup-steps/EmailStep";
import { AgeStep } from "./setup-steps/AgeStep";
import { OccupationStep } from "./setup-steps/OccupationStep";
import { ReferralStep } from "./setup-steps/ReferralStep";
import { MonthlyPaymentStep } from "./setup-steps/MonthlyPaymentStep";

// --- 1. DEFINE THE DATA SHAPE HERE AND EXPORT IT ---
export interface UserInputData {
  email: string;
  age: string;
  occupation: string;
  customOccupation: string;
  monthlyPayment: string;
  referToCode: string;
  // Index signature allows dynamic access like formData[name]
  [key: string]: string;
}

interface UserInputMonthlyProps {
  // Make initialData required or provide a default in the component
  initialData: UserInputData;
  onComplete: (data: UserInputData) => void;
  initialEmail?: string | null;
}

export default function UserInputMonthly({
  initialData,
  onComplete,
  initialEmail,
}: UserInputMonthlyProps) {
  // --- State Management ---
  const [page, setPage] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [isCurrentStepValid, setIsCurrentStepValid] = useState<boolean>(false);

  // Initialize state directly with initialData
  const [formData, setFormData] = useState<UserInputData>(initialData);

  // --- Handlers ---
  const handleChange = (
    e:
      | ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } },
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
    onComplete(formData);
  };

  // --- Step Configuration ---
  const pages = [
    { component: EmailStep, props: { initialEmail } },
    { component: AgeStep, props: {} },
    { component: OccupationStep, props: {} },
    { component: MonthlyPaymentStep, props: {} },
    { component: ReferralStep, props: {} },
  ];

  const CurrentStepComponent = pages[page].component;
  const currentStepProps = pages[page].props;
  const isFinalStep = page === pages.length - 1;

  return (
    <div className="gradient-background relative flex h-dvh flex-col items-center justify-center p-6">
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-sm rounded-2xl bg-white shadow-2xl backdrop-blur-lg"
      >
        <div className="relative p-6 py-10">
          <ProgressIndicator totalSteps={pages.length} currentStep={page} />

          <div className="relative flex min-h-[14rem] flex-col justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <CurrentStepComponent
                key={page}
                data={formData}
                onChange={handleChange}
                onValidationChange={setIsCurrentStepValid}
                {...currentStepProps}
              />
            </AnimatePresence>
          </div>
        </div>

        <div className="flex w-full justify-between rounded-b-2xl p-6">
          {page > 0 ? (
            <button
              onClick={handleBack}
              className="rounded-lg px-2 py-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
            >
              ย้อนกลับ
            </button>
          ) : (
            <div />
          )}

          <CtaButton
            onClick={isFinalStep ? handleSubmit : handleNext}
            disabled={!isCurrentStepValid}
            className="w-28 rounded-lg px-4 py-2 shadow-lg"
          >
            {isFinalStep ? "คำนวณ" : "ต่อไป"}
          </CtaButton>
        </div>
      </motion.div>
    </div>
  );
}
