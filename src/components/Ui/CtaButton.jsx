"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import React from "react";

export default function CtaButton({ children, ...props }) {
  return (
    <motion.button
      whileTap={{
        scale: 0.9,
        transition: { type: "spring", stiffness: 100, damping: 10 },
      }}
      {...props}
      className={clsx(
        "cta-button cta-gradient-bg font-main relative z-10 w-full cursor-pointer overflow-hidden rounded-[15px] p-[18px] text-lg font-bold text-white transition-all duration-300 ease-in-out",
        props.className
      )}
    >
      {children}
    </motion.button>
  );
}
