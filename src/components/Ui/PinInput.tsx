"use client";
import React, { useState, useRef, useEffect } from "react";

interface PinInputProps {
  length?: number;
  onComplete: (pin: string) => void;
  isPinDisabled?: boolean;
}

const PinInput = ({ length = 6, onComplete, isPinDisabled }: PinInputProps) => {
  const [pin, setPin] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (!/^[0-9]$/.test(value) && value !== "") return; // Only allow numbers

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newPin.every((digit) => digit !== "")) {
      onComplete(newPin.join(""));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-1">
      {pin.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          disabled={isPinDisabled}
          className="h-12 w-10 rounded-xl border-2 border-gray-300 text-center text-2xl font-bold text-gray-800 focus:border-pink-500 focus:ring-pink-500"
        />
      ))}
    </div>
  );
};

export default PinInput;
