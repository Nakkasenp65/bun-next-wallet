"use client";
import React, { useState } from "react";
import { useLiff } from "@/components/provider/LiffProvider";
import { useUnlockApp } from "@/hooks/useUser";
import { MdLock } from "react-icons/md";
import CtaButton from "./CtaButton";

export default function LockScreen() {
  const [pin, setPin] = useState("");
  const { liffProfile } = useLiff();
  const { mutate: unlock, isPending } = useUnlockApp();

  const submit = (pinValue) => {
    if (!pinValue || pinValue.length !== 6 || !liffProfile?.userId) return;
    unlock({ line_user_id: liffProfile.userId, pin: pinValue });
  };

  const handleChange = (e) => {
    // only digits, cap at 6
    const next = e.target.value.replace(/\D/g, "").slice(0, 6);
    setPin(next);

    // auto-submit as soon as 6 digits are entered (and not already fetching)
    if (next.length === 6 && !isPending) submit(next);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = (e.clipboardData.getData("text") || "")
      .replace(/\D/g, "")
      .slice(0, 6);
    setPin(pasted);
    if (pasted.length === 6 && !isPending) submit(pasted);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submit(pin);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        aria-busy={isPending}
        className="flex w-11/12 max-w-sm flex-col items-center gap-6 rounded-2xl bg-white p-8 shadow-2xl"
      >
        <MdLock className="text-primary-pink text-5xl" />
        <h1 className="text-xl font-bold text-slate-800">กรุณาใส่รหัส PIN</h1>

        <input
          type="password"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          maxLength={6}
          value={pin}
          onChange={handleChange}
          onPaste={handlePaste}
          disabled={isPending}
          className="w-full rounded-lg border-2 border-slate-300 p-4 text-center text-2xl tracking-[1rem] text-slate-900 focus:border-pink-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          autoFocus
        />

        <CtaButton
          type="submit"
          disabled={isPending || pin.length !== 6}
          aria-disabled={isPending || pin.length !== 6}
          className="w-full rounded-xl p-4 text-lg font-bold disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "กำลังตรวจสอบ..." : "ปลดล็อค"}
        </CtaButton>
      </form>
    </div>
  );
}
