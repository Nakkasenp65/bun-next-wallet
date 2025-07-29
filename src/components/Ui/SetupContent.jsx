import React, { useState } from "react";
import GoalPhoneComponent from "./GoalPhoneComponent";
import { IoIosArrowBack } from "react-icons/io";

export default function SetupContent({ goal, setGoal, isGoalSelected }) {
  const phones = [
    {
      brand: "iPhone 16 Pro",
      price: 48900.0,
      mobileId: "6881f553ca2899c984e09d07",
    },
    {
      brand: "Samsung Galaxy S25 Ultra",
      price: 52900.0,
      mobileId: "6881f553ca2899c984e09d08",
    },
    {
      brand: "Google Pixel 9 Pro",
      price: 41500.0,
      mobileId: "6881f553ca2899c984e09d07",
    },
    {
      brand: "Xiaomi 15 Pro",
      price: 35990.0,
      mobileId: "6881f553ca2899c984e09d08",
    },
  ];

  function formatPrice(value, digit = 0) {
    if (value === null || value === undefined || isNaN(value)) {
      return "N/A"; // Or handle as appropriate
    }
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: digit,
      maximumFractionDigits: digit,
    }).format(value);
  }

  function calculateSavingsPlans(price) {
    if (!price || price <= 0) {
      return [];
    }

    const DAY_SIX_MONTH = 180;
    const PLANS = [
      {
        label: "รายวัน",
        amount: formatPrice(Math.round(price / DAY_SIX_MONTH)),
        variable: "daily",
        planId: "6881f45dca2899c984e09cf8",
      },
      {
        label: "รายสัปดาห์",
        amount: formatPrice(Math.round(price / (DAY_SIX_MONTH / 7))),
        variable: "weekly",
        planId: "6881f45dca2899c984e09cf9",
      },
      {
        label: "ราย 15 วัน",
        amount: formatPrice(Math.round(price / (DAY_SIX_MONTH / 15))),
        variable: "15",
        planId: "6881f45eca2899c984e09cfa",
      },
      {
        label: "รายเดือน",
        amount: formatPrice(Math.round(price / 6)),
        variable: "monthly",
        planId: "6881f45eca2899c984e09cfb",
      },
    ];

    return PLANS;
  }

  const plans = calculateSavingsPlans(goal.price);

  function handlePhoneSelected({ brand, price, mobileId }) {
    setGoal((prevGoal) => ({
      ...prevGoal,
      brand: brand,
      price: price,
      mobileId: mobileId,
    }));
  }

  function handlePlan(plan, planId) {
    setGoal((prevGoal) => ({
      ...prevGoal,
      plan: plan,
      planId: planId,
    }));
  }

  const [formData, setFormData] = useState({
    amount: "",
    recipient: "",
    account: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="flex grow flex-col gap-6 p-6">
      <div id="setup-phone-list" className="flex flex-col gap-6 border">
        <h2 className="text-lg font-bold text-neutral-800">1. เลือกเป้าหมายของคุณ</h2>

        {phones.map((phone) => (
          <GoalPhoneComponent
            key={phone.brand}
            phoneDetails={phone}
            handleSelected={handlePhoneSelected}
            formatPrice={formatPrice}
            selected={
              // current loop is phone the goal which is the form is goal.brand
              // if the current goal brand(selected) match the phone brand = this phone is selected
              goal.brand === phone.brand
            }
          />
        ))}
      </div>
      {goal.brand && (
        <div className="border-divider border-t py-6">
          <h2 className="mb-6 text-lg font-bold text-neutral-800">2. เลือกแผนการออม (ระยะเวลา 6 เดือน)</h2>

          <div id="setup-savings-plan-list" className="grid grid-cols-2 gap-3">
            {plans.map((plan) => (
              <div
                key={plan.label}
                className={`hover:border-soft-purple flex w-full cursor-pointer flex-col items-center justify-center gap-[5px] rounded-xl p-4 text-center duration-300 ease-out hover:-translate-y-1 ${
                  goal.plan === plan.variable
                    ? "border-primary-pink bg-light-pink-bg shadow-pink-glow animate-pulse-border border-2"
                    : "border-divider border-2 bg-white"
                }`}
                onClick={() => handlePlan(plan.variable, plan.planId)}
              >
                <p className="text-bg-dark font-bold">{plan.label}</p>
                <p className="text-primary-pink my-1 text-xl font-bold">฿{plan.amount}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
