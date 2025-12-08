import React, { useMemo } from "react";

// Helper function (can be outside the component)
const calculateSavingsPlans = (price) => {
  if (!price || price <= 0) return [];
  const daysIn6Months = 180;
  return [
    { label: "รายวัน", amount: price / daysIn6Months, period: "ต่อวัน" },
    {
      label: "รายสัปดาห์",
      amount: price / (daysIn6Months / 7),
      period: "ต่อสัปดาห์",
    },
    {
      label: "ราย 15 วัน",
      amount: price / (daysIn6Months / 15),
      period: "ต่อ 15 วัน",
    },
    { label: "รายเดือน", amount: price / 6, period: "ต่อเดือน" },
  ];
};

/**
 * A component that displays various savings plan options based on a selected goal's price.
 */
export default function SavingsPlanSelector({ goalPhone }) {
  // useMemo ensures that we only recalculate the plans when the phone's price changes.
  const savingsPlans = useMemo(
    () => calculateSavingsPlans(goalPhone.price),
    [goalPhone.price],
  );

  // If no goal is selected, we can show a placeholder or nothing at all.
  if (!goalPhone.price) {
    return (
      <div className="text-center text-neutral-500">
        กรุณาเลือกเป้าหมายการออมก่อน
      </div>
    );
  }

  return (
    <div id="setup-savings-plan-list" className="grid grid-cols-2 gap-3">
      {/* We map over the calculated plans to create a card for each one */}
      {savingsPlans.map((plan) => {
        // Format the amount to have commas and two decimal places, as requested.
        const formattedAmount = plan.amount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        return (
          <div
            key={plan.label} // The key is crucial for React lists
            className="hover:border-soft-purple cursor-pointer rounded-xl border-2 border-transparent bg-gray-100 p-4 text-center transition-colors"
          >
            <p className="text-bg-dark font-bold">{plan.label}</p>
            <p className="text-primary-pink my-1 text-xl font-bold">
              ฿{formattedAmount}
            </p>
            <p className="text-xs text-neutral-500">{plan.period}</p>
          </div>
        );
      })}
    </div>
  );
}

SavingsPlanSelector;
