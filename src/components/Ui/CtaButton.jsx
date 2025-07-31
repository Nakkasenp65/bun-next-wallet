"use client";
import clsx from "clsx";
import { motion } from "framer-motion";
import React from "react";

export default function CtaButton({ children, className, ...props }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
      {...props}
      className={clsx(
        "cta-button cta-gradient-bg relative cursor-pointer overflow-hidden text-white",
        className,
      )}
    >
      {children}
    </motion.button>
  );
}
