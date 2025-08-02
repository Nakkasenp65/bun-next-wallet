"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// For a more modern, cohesive look, using icons from the popular 'react-icons' library
import { FaPaperPlane, FaWallet, FaPiggyBank, FaBullseye, FaStar } from "react-icons/fa6";

export default function ActionGrid({
  setShowTransfer,
  setShowWithdraw,
  setShowDeposit,
  setShowGoal,
}) {
  const router = useRouter();

  // A more scalable data structure that can handle both functions and links
  const actionItems = [
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
      label: "ออมเงิน",
      icon: FaPiggyBank,
      key: "deposit",
      action: () => setShowDeposit(true),
    },
    {
      label: "เป้าหมาย",
      icon: FaBullseye,
      key: "goal",
      action: () => setShowGoal(true),
    },
    {
      label: "ภารกิจ",
      icon: FaStar,
      key: "mission",
      action: () => router.push("/mission"), // Handles navigation directly
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

  // Animation variants for each grid item
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 150,
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
        <motion.div
          key={item.key}
          className="group flex cursor-pointer flex-col items-center gap-2"
          onClick={item.action}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }} // Subtle scale on hover for the whole group
        >
          <motion.div
            className="flex h-14 w-14 items-center justify-center rounded-xl bg-black/50 text-xl text-white/90 shadow-md transition-colors group-hover:bg-white/20"
            whileTap={{ scale: 0.9 }} // Bouncier, more satisfying tap effect
            transition={{ type: "spring", stiffness: 1500, damping: 17 }}
          >
            {/* The Icon component is rendered dynamically */}
            <item.icon />
          </motion.div>
          <span className="text-xs font-bold text-white/80 transition-colors group-hover:text-white">
            {item.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}
