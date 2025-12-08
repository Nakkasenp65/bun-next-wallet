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
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/60 backdrop-blur-xl"
      >
        <motion.div
          // --- Interaction Choreographer: Entrance Animation ---
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="flex w-full max-w-xs flex-col items-center gap-8 p-8"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-orange-500 shadow-lg shadow-pink-500/30">
              <LockKeyhole className="text-white" size={28} />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                ใส่รหัสผ่าน
              </h1>
              <p className="mt-2 text-sm font-medium text-white/60">
                {isError
                  ? "รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่"
                  : "กรุณากรอกรหัส PIN 6 หลัก"}
              </p>
            </div>
          </div>

          {/* --- The Visual Transformation: From Input to PIN Dots --- */}
          <div className="relative w-full">
            <motion.div
              // --- Interaction Choreographer: Shake on Error ---
              animate={isError ? { x: [0, -10, 10, -10, 10, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-center gap-6"
              onClick={() => inputRef.current?.focus()} // Focus input when clicking the container
            >
              {pinCells.map((_, index) => {
                const hasValue = index < pin.length;
                return (
                  <div
                    key={index}
                    className={`h-4 w-4 rounded-full transition-all duration-300 ${
                      hasValue
                        ? "bg-gradient-to-br from-pink-500 to-orange-500 shadow-[0_0_10px_rgba(236,72,153,0.5)] scale-110"
                        : "bg-white/20"
                    } ${isError ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : ""}`}
                  />
                );
              })}
            </motion.div>

            {/* Loading Spinner */}
            {isPending && (
              <div className="absolute inset-0 flex items-center justify-center">
                <LoaderCircle
                  className="animate-spin text-white"
                  size={32}
                />
              </div>
            )}
          </div>

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
