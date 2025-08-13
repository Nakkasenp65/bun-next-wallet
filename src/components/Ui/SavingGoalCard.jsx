"use client";
import React, { useMemo } from "react";
import { IoMdTrophy } from "react-icons/io";
import Image from "next/image";
import CtaButton from "./CtaButton";

const fmtTHB = (n) =>
  (Number(n) || 0).toLocaleString("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
  });

export default function SavingsGoalCard({
  brand,
  name,
  target, // downPaymentAmount = เป้าหมายดาวน์
  balance = 0,
  imageUrl,
  handleRedeem,
  className = "",
}) {
  const { pct, remaining, achieved } = useMemo(() => {
    const t = Math.max(0, Number(target) || 0);
    const b = Math.max(0, Number(balance) || 0);
    const raw = t > 0 ? (b / t) * 100 : 0;
    return {
      pct: Math.max(0, Math.min(100, raw)),
      remaining: Math.max(0, t - b),
      achieved: b >= t && t > 0,
    };
  }, [target, balance]);

  return (
    <div
      id="savings-goal-card"
      className={[
        // your original soul
        "relative flex flex-col gap-3 overflow-hidden rounded-3xl p-6",
        "text-light-text shadow-neon-purple inset-shadow-lg inset-shadow-black/36",
        "drop-shadow-primary-pink/50 drop-shadow-lg [background:linear-gradient(45deg,_#230640_0%,_#402E99_100%)]",
        className,
      ].join(" ")}
    >
      {/* soft vignette for readability */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(transparent,rgba(0,0,0,0.35))]"
      />

      {/* floating product visual (kept your animation/placement) */}
      <div className="pointer-events-none absolute -right-22 -bottom-14 w-[225px] -rotate-6 sm:-bottom-12 sm:w-[300px] sm:-rotate-10">
        {imageUrl ? (
          <Image
            className="animate-floating drop-shadow-primary-pink/50 drop-shadow-2xl"
            src={imageUrl}
            alt={`${brand} ${name}`}
            width={500}
            height={500}
            priority
          />
        ) : (
          // use <img> for animated gif (Next/Image strips the anim on some setups)
          <img
            className="animate-floating drop-shadow-primary-pink/50"
            src="/videos/moneyLoading.gif"
            alt="กำลังโหลดรูปสินค้า"
            width={300}
            height={300}
          />
        )}
      </div>

      {/* title area */}
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-1">
            <IoMdTrophy className="text-accent-gold drop-shadow-accent-gold/50 h-4 w-4" />
            <span className="text-xs text-white/80">เป้าหมายดาวน์</span>
          </div>
          <h3 className="truncate text-base leading-snug font-semibold">
            {brand} {name}
          </h3>
        </div>

        {/* progress pill */}
        <span
          className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold text-white/90 ring-1 ring-white/20"
          aria-live="polite"
        >
          {Math.round(pct)}%
        </span>
      </div>

      {/* current balance */}
      <div className="mt-1">
        <div className="text-xs text-white/60">ยอดเงินปัจจุบัน</div>
        <div className="from-primary-pink bg-gradient-to-r to-amber-500 bg-clip-text text-3xl font-extrabold text-transparent drop-shadow">
          {fmtTHB(balance)}
        </div>
      </div>

      {/* progress bar + figures */}
      <div className="mt-1 w-[65%] max-w-xs">
        <div
          className="h-3 w-full rounded-full bg-black/45 shadow-inner ring-1 ring-white/10"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct)}
          aria-label="ความคืบหน้าการออม"
        >
          <div
            className="h-full rounded-full transition-[width] duration-700 [background:linear-gradient(90deg,_var(--gold-accent)_0%,_var(--primary-pink)_100%)]"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-[10px] text-white/90">
          <span className="rounded-full bg-black/40 px-2 py-1 ring-1 ring-white/10">
            ดาวน์: {fmtTHB(target)}
          </span>
          <span className="rounded-full bg-black/40 px-2 py-1 ring-1 ring-white/10">
            {achieved ? "สำเร็จแล้ว!" : `อีก: ${fmtTHB(remaining)}`}
          </span>
        </div>
      </div>

      {/* CTA */}
      {achieved && (
        <div className="mt-2">
          <CtaButton
            onClick={handleRedeem}
            className="z-10 w-48 rounded-xl p-4 text-sm font-bold"
            aria-label="เริ่มขั้นตอนการดาวน์"
          >
            เริ่มการดาวน์!
          </CtaButton>
        </div>
      )}
    </div>
  );
}
