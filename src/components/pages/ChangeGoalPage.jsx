"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import CtaButton from "../Ui/CtaButton";
import GoalPhoneComponent from "../Ui/GoalPhoneComponent";
import FramerDiv from "../framerComponents/FramerDiv";

function formatPrice(value, digit = 0) {
  if (value === null || value === undefined || isNaN(value)) return "N/A";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: digit,
    maximumFractionDigits: digit,
  }).format(value);
}

function calculateSavingsPlans(price) {
  if (!price || price <= 0) return [];
  const daysIn6Months = 180;
  return [
    { label: "รายวัน", variable: "daily", amount: Math.ceil(price / daysIn6Months) },
    { label: "รายสัปดาห์", variable: "weekly", amount: Math.ceil(price / (daysIn6Months / 7)) },
    { label: "ราย 15 วัน", variable: "15", amount: Math.ceil(price / (daysIn6Months / 15)) },
    { label: "รายเดือน", variable: "monthly", amount: Math.ceil(price / 6) },
  ];
}

export default function ChangeGoalPage({ className, isEditing, setIsEditing }) {
  const [newGoal, setNewGoal] = useState({ brand: "empty", price: 0, plan: "none" });
  const phones = [
    { brand: "iPhone 16 Pro", price: 48900.0 },
    { brand: "Samsung Galaxy S25 Ultra", price: 52900.0 },
    { brand: "Google Pixel 9 Pro", price: 41500.0 },
  ];
  const savingsPlans = calculateSavingsPlans(newGoal.price);

  return (
    <FramerDiv
      isOpen={isEditing}
      id="change-goal-overlay"
      className={clsx("bg-bg-dark/80 fixed inset-0 z-50 flex flex-col backdrop-blur-sm", className)}
    >
      {/* Page Header */}
      <header className="flex flex-shrink-0 items-center border-b border-white/20 px-5 pt-10 pb-4">
        <button
          onClick={() => setIsEditing(false)}
          className="text-secondary-text text-2xl transition-colors hover:text-white"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <h2 className="from-primary-pink to-primary-orange flex-grow bg-gradient-to-r bg-clip-text text-center text-xl font-bold text-transparent">
          แก้ไขเป้าหมาย
        </h2>
        <div className="w-6"></div> {/* Spacer to keep title centered */}
      </header>

      {/* Scrollable Content Area */}
      <div className="relative flex-grow overflow-y-auto rounded-t-[30px] bg-white p-6 pb-28">
        {/* Step 1: Phone Selection */}
        <div className="mb-6">
          <h2 className="mb-4 text-lg font-bold text-neutral-800">1. เลือกเป้าหมายใหม่ของคุณ</h2>
          <div id="edit-phone-list" className="grid grid-cols-1 gap-4">
            {phones.map((phone) => (
              <GoalPhoneComponent
                key={phone.brand}
                phoneDetails={phone}
                selected={newGoal.brand === phone.brand}
                handleSelected={(details) => setNewGoal({ ...details, plan: null })}
                formatPrice={formatPrice}
              />
            ))}
          </div>
        </div>

        {/* Step 2: Plan Selection (appears after a phone is selected) */}
        <div className={clsx("border-divider border-t pt-5", { hidden: !newGoal.brand })}>
          <h2 className="mb-4 text-lg font-bold text-neutral-800">2. เลือกแผนการออมใหม่ (ระยะเวลา 6 เดือน)</h2>
          <div id="edit-savings-plan-list" className="grid grid-cols-2 gap-3">
            {savingsPlans.map((plan) => (
              <div
                key={plan.label}
                className={clsx(
                  "hover:border-soft-purple flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl p-4 text-center transition",
                  newGoal.plan === plan.variable
                    ? "border-primary-pink border-2 bg-pink-50 shadow-md"
                    : "border border-gray-200 bg-gray-50"
                )}
                onClick={() => setNewGoal((prev) => ({ ...prev, plan: plan.variable }))}
              >
                <p className="text-bg-dark font-bold">{plan.label}</p>
                <p className="text-primary-pink my-1 text-xl font-bold">฿{plan.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="absolute right-0 bottom-0 left-0 bg-white p-6 pt-5 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <CtaButton disabled={newGoal.plan === null}>บันทึกการเปลี่ยนแปลง</CtaButton>
      </div>
    </FramerDiv>
  );
}
