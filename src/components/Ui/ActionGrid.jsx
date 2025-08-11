"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// For a more modern, cohesive look, using icons from the popular 'react-icons' library
import { FaPaperPlane, FaBullseye, FaWallet } from "react-icons/fa6";
import { FaExternalLinkAlt } from "react-icons/fa";

export default function ActionGrid({
  setShowTransfer,
  setShowWithdraw,
  setShowDeposit,
  setShowGoal,
}) {
  // A more scalable data structure that can handle both functions and links
  const actionItems = [
    {
      label: "ออมเงิน",
      icon: FaExternalLinkAlt,
      key: "deposit",
      action: () => setShowDeposit(true),
    },
    {
      label: "โอนเงิน",
      icon: FaPaperPlane,
      key: "transfer",
      action: () => setShowTransfer(true),
    },
    {
      label: "ถอนเงิน",
      icon: FaWallet,
      key: "withdraw",
      action: () => setShowWithdraw(true),
    },

    {
      label: "เป้าหมาย",
      icon: FaBullseye,
      key: "goal",
      action: () => setShowGoal(true),
    },
  ];

  // Animation variants for the container to orchestrate children animations
  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Each child will animate 0.05s after the previous one
      },
    },
  };

  return (
    <motion.div
      id="actions-grid"
      className="grid grid-cols-4 gap-2" // Changed to grid-cols-5 for perfect alignment
      variants={gridVariants}
      initial="hidden"
      animate="visible"
    >
      {actionItems.map((item) => (
        <div
          key={item.key}
          className={`group flex cursor-pointer flex-col items-center gap-2`}
          onClick={item.action}
        >
          <motion.div
            className={`flex h-14 w-14 items-center justify-center rounded-full bg-(--card-bg-dark) text-xl text-white/90 shadow-md transition-colors group-hover:bg-white/20 backdrop:blur-2xl`}
            whileTap={{ scale: 0.9 }} // Bouncier, more satisfying tap effect
            transition={{ type: "spring", stiffness: 1500, damping: 17 }}
          >
            {/* The Icon component is rendered dynamically */}
            <item.icon size={28} className="text-(--light-text)" />
          </motion.div>
          <span className="text-xs font-bold text-(--light-text) transition-colors group-hover:text-white">
            {item.label}
          </span>
        </div>
      ))}
    </motion.div>
  );
}
