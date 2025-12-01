"use client";
import React, { useState, useRef, useEffect } from "react";
import { useLiff } from "@/components/provider/LiffProvider";
import { useUnlockApp } from "@/hooks/useUser";
import { AnimatePresence, motion } from "framer-motion";
import { LockKeyhole, LoaderCircle } from "lucide-react"; // --- Visual Futurist: Upgraded Icons

export default function LockScreen() {
  const [pin, setPin] = useState("");
  const { liffProfile } = useLiff();

  // --- We'll assume the hook provides isError and a reset function for the error state
  const { mutate: unlock, isPending, isError, reset } = useUnlockApp();
  const inputRef = useRef(null);

  // --- Reset pin on error ---
  useEffect(() => {
    if (isError) {
      // Clear the pin after the shake animation completes
      const timer = setTimeout(() => {
        setPin("");
        reset(); // Reset the error state in the hook
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isError, reset]);

  const submit = (pinValue: string) => {
    if (!pinValue || pinValue.length !== 6 || !liffProfile?.userId) return;
    unlock({ line_user_id: liffProfile.userId, pin: pinValue });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value.replace(/\D/g, "").slice(0, 6);
    setPin(next);
    if (next.length === 6 && !isPending) {
      submit(next);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = (e.clipboardData.getData("text") || "")
      .replace(/\D/g, "")
      .slice(0, 6);
    setPin(pasted);
    if (pasted.length === 6 && !isPending) {
      submit(pasted);
    }
  };

  // --- The array to render our 6 PIN cells ---
  const pinCells = Array.from({ length: 6 });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/60 backdrop-blur-md"
      >
        <motion.div
          // --- Interaction Choreographer: Entrance Animation ---
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
          className="flex w-11/12 max-w-sm flex-col items-center gap-6 rounded-2xl bg-white p-8 shadow-2xl"
        >
          <div className="from-primary-pink to-primary-orange rounded-full bg-gradient-to-br p-3 text-white">
            <LockKeyhole size={32} />
          </div>
          <h1 className="text-xl font-bold text-slate-800">กรุณาใส่รหัส PIN</h1>

          {/* --- The Visual Transformation: From Input to PIN Cells --- */}
          <div className="relative">
            <motion.div
              // --- Interaction Choreographer: Shake on Error ---
              animate={isError ? { x: [0, -10, 10, -10, 10, 0] } : { x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-2"
              onClick={() => inputRef.current?.focus()} // Focus input when clicking the container
            >
              {pinCells.map((_, index) => {
                const hasValue = index < pin.length;
                const isActive = index === pin.length;
                return (
                  <div
                    key={index}
                    className={`flex h-16 w-12 items-center justify-center rounded-lg border-2 text-2xl font-bold text-slate-800 transition-all duration-200 ${isError ? "border-red-500" : ""} ${isActive && !isError ? "scale-105 border-pink-500" : "border-slate-300"} ${hasValue && !isActive && !isError ? "border-slate-400" : ""} `}
                  >
                    {hasValue && "●"}
                  </div>
                );
              })}
            </motion.div>

            {/* Loading Spinner */}
            {isPending && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                <LoaderCircle
                  className="animate-spin text-pink-500"
                  size={32}
                />
              </div>
            )}
          </div>

          <p className="text-sm text-slate-500">
            {isError
              ? "รหัส PIN ไม่ถูกต้อง"
              : "กรอกรหัส PIN 6 หลักเพื่อเข้าสู่ระบบ"}
          </p>

          {/* --- The Hidden Input: The key to a seamless UX --- */}
          <input
            ref={inputRef}
            type="password" // Use password to prevent keyboard suggestions
            inputMode="numeric"
            autoComplete="one-time-code"
            value={pin}
            onChange={handleChange}
            onPaste={handlePaste}
            disabled={isPending}
            className="absolute h-1 w-1 opacity-0" // Visually hidden but still focusable
            autoFocus
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
