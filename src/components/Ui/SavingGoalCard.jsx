"use client";
import React, { useMemo, useState } from "react";
import { IoMdTrophy } from "react-icons/io";
import Image from "next/image";
import CtaButton from "./CtaButton";
import { IoMdRefresh } from "react-icons/io";
import { MdOutlineStar } from "react-icons/md";

const fmtTHB = (n) =>
  (Number(n) || 0).toLocaleString("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
  });

/**
 * SavingsGoalCard
 * - ใช้ logic ออมดาวน์: totalForRedeem = balance + bonusBalance
 * - แสดงความคืบหน้าเป็น % ของ (balance + bonusBalance) ต่อเป้าหมาย down payment
 * - ปุ่ม Redeem โชว์เมื่อรวม >= เป้าหมาย (เผื่อกรณีเกินเป้าหมาย)
 */
export default function SavingsGoalCard({
  brand,
  name,
  target, // downPaymentAmount
  balance = 0,
  bonusBalance = 0,
  imageUrl,
  handleRedeem,
  className = "",
  isRefreshing,
  onRefresh,
}) {
  const [refreshAnimation, setRefreshAnimation] = useState(false);
  const handleOnClickRefresh = async () => {
    setRefreshAnimation(true);
    onRefresh();
    setTimeout(() => {
      // Checking if the userData is still fetching
      if (!isRefreshing) setRefreshAnimation(false);
    }, 1945);
  };
  const {
    pctTotal,
    pctBase,
    pctBonusOnly,
    remaining,
    totalForRedeem,
    achieved,
  } = useMemo(() => {
    const t = Math.max(0, Number(target) || 0);
    const b = Math.max(0, Number(balance) || 0);
    const bonus = Math.max(0, Number(bonusBalance) || 0);
    const total = b + bonus;

    const clampPct = (x) => Math.max(0, Math.min(100, x));
    const pctBaseRaw = t > 0 ? (b / t) * 100 : 0;
    const pctTotalRaw = t > 0 ? (total / t) * 100 : 0;

    const pctBase = clampPct(pctBaseRaw);
    const pctTotal = clampPct(pctTotalRaw);
    const pctBonusOnly = clampPct(pctTotal - pctBase);

    return {
      pctTotal,
      pctBase,
      pctBonusOnly,
      remaining: Math.max(0, t - total),
      totalForRedeem: total,
      // โชว์ CTA เมื่อถึงหรือเกินเป้าหมาย (กันกรณีเงินเกิน)
      achieved: t > 0 ? total >= t : false,
    };
  }, [target, balance, bonusBalance]);

  return (
    <div
      id="savings-goal-card"
      className={[
        "relative flex flex-col gap-2 overflow-hidden rounded-4xl p-6",
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

      {/* Angled product visual (robust for any ratio via object-contain) */}
      <div className="pointer-events-none absolute -right-10 -bottom-14">
        <div className="relative aspect-square w-[160px] sm:w-[300px]">
          {imageUrl && (
            <Image
              fill
              sizes="(min-width: 640px) 300px, 225px"
              className="animate-floating drop-shadow-primary-orange/90 object-contain drop-shadow-2xl"
              src={imageUrl}
              alt={`${brand} ${name}`}
              priority
            />
          )}
        </div>
      </div>

      {/* title area */}
      <div className="flex items-start justify-between">
        {/* title */}
        <div className="w-full">
          <div className="flex w-full items-center justify-between gap-1">
            <div className="flex gap-1">
              <IoMdTrophy className="text-accent-gold drop-shadow-accent-gold/50 h-4 w-4" />
              <span className="text-xs text-white/80">เป้าหมายดาวน์</span>
            </div>
            {/* Refresh Button */}
            <span
              className="text-xs text-white/50"
              aria-live="polite"
              title="เปอร์เซ็นต์ความคืบหน้า (รวมโบนัส)"
            >
              <button className="flex items-center gap-0.5">
                <IoMdRefresh
                  onClick={handleOnClickRefresh}
                  className={`${refreshAnimation ? "animate-spin" : null}`}
                  size={16}
                />
                รีเฟรช
              </button>
            </span>
          </div>
          <h3 className="mt-2 truncate text-xl leading-snug font-semibold">
            {brand === "vivo" ? null : brand} {name}
          </h3>
        </div>

        {/* progress pill = % ของ (balance + bonus) */}
      </div>

      {/* balances */}
      <div className="mt-1 grid max-w-md grid-cols-2 gap-2">
        <div className="rounded-xl bg-black/35 px-3 py-2 ring-1 ring-white/10">
          <div className="text-[10px] text-white/70">เงินสะสม</div>
          <div className="from-primary-pink bg-gradient-to-r to-amber-500 bg-clip-text text-xl font-extrabold text-transparent drop-shadow">
            {fmtTHB(balance)}
          </div>
        </div>
        <div className="rounded-xl bg-black/35 px-3 py-2 ring-1 ring-white/10">
          <div className="text-[10px] text-white/70">โบนัส</div>
          <div className="to-accent-gold via-accent-gold bg-gradient-to-r from-green-500 bg-clip-text text-xl font-extrabold text-transparent drop-shadow">
            {fmtTHB(bonusBalance)}
          </div>
        </div>
      </div>

      {/* total and target */}
      <div className="mt-1 flex w-4/6 max-w-md items-center justify-between">
        <span className="flex gap-0.5 rounded-full bg-black/40 px-2 py-1 text-[10px] text-white/90 ring-1 ring-white/10">
          {remaining > 0 ? `อีก: ${fmtTHB(remaining)}` : "พร้อมแลกแล้ว"}
        </span>
        <span className="flex items-center gap-0.5 rounded-full bg-black/40 px-2 py-1 text-[10px] text-white/90 ring-1 ring-white/10">
          <MdOutlineStar className="text-accent-gold mt-0.5" size={12} />
          ดาวน์: <strong>{fmtTHB(target)}</strong>
        </span>
      </div>

      {/* stacked progress bar: base + bonus overlay */}
      <div className="mt-2 w-4/6 max-w-xs">
        <div
          className="relative h-3 w-full overflow-hidden rounded-full bg-black/45 shadow-inner ring-1 ring-white/10"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pctTotal)}
          aria-label="ความคืบหน้าการออม (รวมโบนัส)"
        >
          {/* base (เงินสะสม) */}
          <div
            className="from-primary-pink to-accent-gold absolute inset-y-0 left-0 rounded-l-full bg-gradient-to-r"
            style={{ width: `${pctBase}%` }}
          />
          {/* bonus (ทับส่วนที่เกินจากฐาน) */}
          <div
            className="from-accent-gold absolute inset-y-0 rounded-r-full bg-gradient-to-r via-green-500 to-green-500"
            style={{
              left: `${pctBase}%`,
              width: `${pctBonusOnly}%`,
            }}
            aria-hidden
            title="ส่วนโบนัส"
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-[10px] text-white/90">
          <span className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2 w-3 rounded-sm [background:linear-gradient(90deg,_var(--gold-accent)_0%,_var(--primary-pink)_100%)]" />
              เงินสะสม
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2 w-3 rounded-sm bg-gradient-to-r from-green-500 to-lime-500" />
              โบนัส
            </span>
          </span>
        </div>
      </div>

      {/* CTA */}
      {achieved && (
        <div className="mt-2">
          <CtaButton
            onClick={handleRedeem}
            className="z-10 w-4/6 rounded-xl p-4 text-sm font-bold"
            aria-label="เริ่มขั้นตอนการดาวน์"
          >
            เริ่มการดาวน์!
          </CtaButton>
        </div>
      )}
    </div>
  );
}
