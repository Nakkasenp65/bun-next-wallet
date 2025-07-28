"use client";
import { motion } from "framer-motion";
import React from "react";

export default function CtaButton({ children, ...props }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
      {...props}
      className={
        "cta-button cta-gradient-bg font-main relative z-10 w-full cursor-pointer overflow-hidden rounded-2xl p-4 text-lg font-bold text-white"
      }
    >
      {children}
    </motion.button>
  );
}
