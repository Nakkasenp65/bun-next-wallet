"use client";

import React, { useState, useEffect, useRef } from "react";
import { Edit, CalendarClock, Target, CheckCircle } from "lucide-react";
import clsx from "clsx";

import CtaButton from "../ui/CtaButton";
import ChangeGoalPage from "./ChangeGoalPage";
import FramerDiv from "../framerComponents/FramerDiv";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";

interface Product {
  downPaymentAmount?: number;
  imageUrl?: string;
  brand?: string;
  model?: string;
}

interface Plan {
  displayName?: string;
}

interface GoalPageProps {
  userData: any;
  showGoal: boolean;
  setShowGoal: (show: boolean) => void;
  balance: number;
  product?: Product;
  plan?: Plan;
}

export default function GoalPage({
  userData,
  showGoal,
  setShowGoal,
  balance,
  product = {},
  plan = {},
}: GoalPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const savedAmount = Number(balance);
  const targetPrice = Number(product?.downPaymentAmount || 0); // keeping your existing target
  const progressRaw = targetPrice > 0 ? (savedAmount / targetPrice) * 100 : 0;
  const progressPercentage = Math.max(0, Math.min(100, progressRaw));
  const isCompleted = progressPercentage >= 100;
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

  console.log(remainingAmount);

  const remainingText = isCompleted
    ? "สำเร็จแล้ว!"
    : `อีก ${fmtTHB(remainingAmount)} บาท`;

  return (
    <>
      <ChangeGoalPage
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        userData={userData}
        balance={balance}
      />

      <FramerDiv
        isOpen={showGoal}
        className="fixed inset-0 z-20 flex flex-col overflow-hidden bg-slate-900"
      >
        {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

        {/* --- 1. Immersive Background --- */}
        {product?.imageUrl && (
          <div className="absolute inset-0">
            <Image
              src={product.imageUrl}
              alt="Goal Background"
              layout="fill"
              objectFit="cover"
              className="scale-110 opacity-20 blur-lg"
            />
            <div className="bg-bg-dark absolute inset-0" />
          </div>
        )}

        {/* Header */}
        <header className="relative z-10 flex items-center p-4 pt-10">
          <button
            onClick={() => setShowGoal(false)}
            className="rounded-full p-2 text-white transition-colors hover:bg-white/10"
            aria-label="ย้อนกลับ"
          >
            <ChevronLeft size={28} />
          </button>
          <h2 className="from-primary-pink to-primary-orange mx-auto bg-gradient-to-r bg-clip-text text-lg font-extrabold tracking-tight text-transparent">
            เป้าหมายของฉัน
          </h2>
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-full p-2 text-white transition-colors hover:bg-white/10"
            aria-label="แก้ไขเป้าหมาย"
          >
            <Edit size={20} />
          </button>
        </header>

        {/* Content */}
        <div className="relative z-10 mx-auto flex w-full max-w-xl flex-grow flex-col gap-6 rounded-t-3xl bg-white p-6 pb-8">
          {/* Hero product card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center gap-4"
          >
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100 p-2">
              {product?.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  width={100}
                  height={100}
                  alt={product?.model || "Product"}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                  ไม่มีรูป
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <span className="truncate text-sm font-semibold text-slate-500">
                {product?.brand || "-"}
              </span>
              <h3 className="truncate text-lg font-extrabold text-slate-900">
                {product?.model || "ไม่พบชื่อรุ่น"}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                เป้าหมาย:{" "}
                <span className="font-semibold text-slate-800">
                  {fmtTHB(targetPrice)}
                </span>
              </p>
            </div>
          </motion.div>

          {/* --- 2. A True Progress Bar --- */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          >
            <div className="relative h-16 w-full overflow-hidden rounded-2xl bg-slate-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className={clsx(
                  "absolute top-0 left-0 h-full",
                  isCompleted
                    ? "bg-green-500"
                    : "bg-gradient-to-r from-pink-500 to-orange-400",
                )}
              />
              <div className="absolute inset-0 flex items-center justify-between px-4 text-sm">
                <span
                  className={clsx(
                    "font-bold",
                    progressPercentage > 55 ? "text-white" : "text-pink-700",
                  )}
                >
                  ออมแล้ว {fmtTHB(savedAmount)}
                </span>
                <span
                  className={clsx(
                    "font-semibold",
                    progressPercentage > 15 ? "text-white" : "text-slate-500",
                  )}
                >
                  {Math.round(progressPercentage)}%
                </span>
              </div>
            </div>
          </motion.div>

          {/* --- 3. Insightful Plan Card --- */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="rounded-lg bg-slate-50 p-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <CalendarClock size={14} /> <span>แผนการออม</span>
              </div>
              <p className="text-md mt-1 font-bold text-slate-800">
                {plan?.displayName || "-"}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Target size={14} /> <span>สถานะ</span>
              </div>
              <p className="gap text-md mt-1 flex items-center font-bold text-slate-800">
                {isCompleted && (
                  <CheckCircle size={16} className="text-green-500" />
                )}
                {remainingText}
              </p>
            </div>
          </motion.div>

          {/* CTA */}
          <div className="mt-auto flex justify-center pt-4">
            <CtaButton
              onClick={() => setIsEditing(true)}
              className="w-full rounded-xl py-4 text-base font-bold"
            >
              เปลี่ยนเป้าหมายการออม
            </CtaButton>
          </div>
        </div>
      </FramerDiv>
    </>
  );
}
