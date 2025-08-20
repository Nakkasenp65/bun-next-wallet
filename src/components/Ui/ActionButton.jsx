"use client";

import React from "react";
import { motion, useAnimationControls } from "framer-motion";

// --- 💜💛 Animation Variants ของปุ่ม ---
const buttonVariants = {
  initial: {
    background: "var(--card-bg-dark, #2D3748)",
  },
  gradientAnimate: {
    background: [
      "linear-gradient(to top right, #4F46E5 0%, #4F46E5 100%)",
      "linear-gradient(to top right, #a855f7 0%, #eab308 100%)",
      "linear-gradient(to top right, #eab308 0%, #eab308 100%)",
    ],
    transition: { duration: 0.5, ease: "easeInOut" },
  },
  hover: {
    scale: 1.1,
    backgroundColor: "#FFFFFF20",
    transition: { duration: 0.2 },
  },
};

export default function ActionButton({ item }) {
  const controls = useAnimationControls();

  // ฟังก์ชันที่จะทำงานเมื่อมีการคลิก
  const handleClick = async () => {
    controls.start("gradientAnimate");
    item.action();
    await new Promise((resolve) => setTimeout(resolve, 600)); // รอ 0.6 วินาที
    controls.start("initial");
  };

  return (
    <div
      className="group flex cursor-pointer flex-col items-center justify-center gap-2"
      onClick={handleClick}
    >
      <motion.div
        initial="initial"
        animate={controls} // เชื่อมต่อตัวควบคุมเข้ากับ component
        variants={buttonVariants}
        whileTap={"tapping"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--card-bg-dark)] text-xl text-white/90 drop-shadow-lg drop-shadow-black/50 backdrop-blur-2xl"
      >
        <item.icon size={28} className="text-[var(--light-text)]" />
      </motion.div>
      <span className="text-sm font-bold text-[var(--light-text)] transition-colors group-hover:text-white">
        {item.label}
      </span>
    </div>
  );
}
