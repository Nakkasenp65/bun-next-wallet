"use client";

import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faPenToSquare,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import CtaButton from "../Ui/CtaButton";
import ChangeGoalPage from "./ChangeGoalPage";
import FramerDiv from "../framerComponents/FramerDiv";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import Image from "next/image";

export default function GoalPage({
  userData,
  showGoal,
  setShowGoal,
  balance,
  product = {},
  plan = {},
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const savedAmount = Number(balance);
  const targetPrice = Number(product?.downPaymentAmount || 0); // keeping your existing target
  const progressRaw = targetPrice > 0 ? (savedAmount / targetPrice) * 100 : 0;
  const progressPercentage = Math.max(0, Math.min(100, progressRaw));
  const remainingAmount = Math.max(0, targetPrice - savedAmount);

  // trigger confetti on 25/50/75/100 crossings (with a little tolerance)
  const prevPct = useRef(progressPercentage);
  useEffect(() => {
    const milestones = [25, 50, 75, 100];
    const crossed = milestones.some(
      (m) => prevPct.current < m && progressPercentage >= m,
    );
    if (crossed) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 2200);
      return () => clearTimeout(t);
    }
    prevPct.current = progressPercentage;
  }, [progressPercentage]);

  const fmtTHB = (n) =>
    (Number(n) || 0).toLocaleString("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  return (
    <>
      <ChangeGoalPage
        userData={userData}
        balance={balance}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />

      <FramerDiv
        isOpen={showGoal}
        id="product-goal-overlay"
        className="fixed inset-0 z-40 flex flex-col overflow-hidden bg-gradient-to-br from-rose-50 via-white to-orange-50"
      >
        {showConfetti && <Confetti />}

        {/* Header - glassy gradient */}
        <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-white/40 bg-white/60 px-5 pt-10 pb-4 backdrop-blur-md">
          <button
            onClick={() => setShowGoal(false)}
            className="text-xl text-gray-600 transition-colors hover:text-gray-900"
            aria-label="ย้อนกลับ"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <h2 className="from-primary-pink to-primary-orange mx-auto bg-gradient-to-r bg-clip-text text-lg font-extrabold tracking-tight text-transparent">
            เป้าหมายการออม
          </h2>
          <button
            onClick={() => setIsEditing(true)}
            className="text-lg text-gray-600 transition-colors hover:text-gray-900"
            aria-label="แก้ไขเป้าหมาย"
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </header>

        {/* Decorative background */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-pink-200/30 blur-3xl" />
          <div className="absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-orange-200/30 blur-3xl" />
        </div>

        {/* Content */}
        <div className="mx-auto flex w-full max-w-xl flex-grow flex-col gap-6 px-6 pt-6 pb-8">
          {/* Hero product card */}
          <motion.div
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur"
          >
            <div className="flex items-center gap-4">
              <div className="relative h-28 w-28 overflow-hidden rounded-2xl bg-white">
                {/* fallback if no image */}
                {product?.imageUrl ? (
                  // using <img> to match your current codebase
                  <Image
                    src={product.imageUrl}
                    width={200}
                    height={200}
                    alt={product?.model || "Product"}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                    ไม่มีรูปสินค้า
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-gray-500">
                    {product?.brand || "-"}
                  </span>
                  {progressPercentage >= 75 && (
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-bold text-yellow-700">
                      ใกล้แล้ว!
                    </span>
                  )}
                </div>
                <h3 className="truncate text-lg font-extrabold text-gray-900">
                  {product?.model || "ไม่พบชื่อรุ่น"}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  ราคาสินค้า:{" "}
                  <span className="font-semibold text-gray-800">
                    {fmtTHB(targetPrice)}
                  </span>
                </p>
              </div>
            </div>

            {/* progress bar */}
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-gray-500">ความคืบหน้า</span>
                <span className="font-semibold text-pink-600">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.9, ease: "easeInOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-orange-400"
                />
              </div>

              {/* stat chips */}
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-pink-200/60 bg-pink-50 px-3 py-2 text-pink-700">
                  ออมแล้ว
                  <div className="text-base font-extrabold text-pink-700">
                    {fmtTHB(savedAmount)}
                  </div>
                </div>
                <div className="rounded-xl border border-orange-200/60 bg-orange-50 px-3 py-2 text-orange-700">
                  ขาดอีก
                  <div className="text-base font-extrabold text-orange-700">
                    {fmtTHB(remainingAmount)}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Plan card */}
          <motion.div
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
            className="rounded-3xl border border-white/60 bg-white/80 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <FontAwesomeIcon
                  icon={faCalendarCheck}
                  className="text-primary-pink"
                />
                <span>แผนการออม</span>
              </div>
              <div className="truncate font-bold text-gray-900">
                {plan?.displayName || "-"}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-gray-50 px-3 py-3">
                <div className="text-xs text-gray-500">ยอดเป้าหมาย</div>
                <div className="text-lg font-extrabold text-gray-900">
                  {fmtTHB(targetPrice)}
                </div>
              </div>
              <div className="rounded-xl bg-gray-50 px-3 py-3">
                <div className="text-xs text-gray-500">คืบหน้า</div>
                <div className="text-lg font-extrabold text-gray-900">
                  {Math.round(progressPercentage)}%
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <div className="mt-auto flex items-center justify-center pt-2">
            <CtaButton
              id="add-savings-btn"
              className="w-max rounded-xl bg-gradient-to-r from-pink-500 to-orange-400 px-6 py-4 text-base font-bold text-white shadow-lg shadow-pink-500/20 transition-transform hover:-translate-y-0.5 focus:ring-2 focus:ring-pink-300 focus:outline-none"
              onClick={() => setIsEditing(true)}
            >
              ตรวจสอบเป้าหมายที่ใกล้เคียง!
            </CtaButton>
          </div>
        </div>
      </FramerDiv>
    </>
  );
}
