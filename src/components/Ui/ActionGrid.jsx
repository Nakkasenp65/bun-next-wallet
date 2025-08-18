"use client";

import React from "react";
import { motion } from "framer-motion";

import {
  FaBullseye,
  FaArrowRightFromBracket,
  FaMoneyBillWave,
  FaPiggyBank,
} from "react-icons/fa6";
import ActionButton from "./ActionButton";
import { MdManageAccounts } from "react-icons/md";
import Link from "next/link";

export default function ActionGrid({
  setShowTransfer,
  setShowWithdraw,
  setShowDeposit,
  setShowGoal,
  role = "USER",
  line_user_id = "",
}) {
  const actionItems = [
    {
      label: "ออมเงิน",
      icon: FaPiggyBank,
      key: "deposit",
      action: () => setShowDeposit(true),
    },
    {
      label: "โอนเงิน",
      icon: FaArrowRightFromBracket,
      key: "transfer",
      action: () => setShowTransfer(true),
    },
    {
      label: "ถอนเงิน",
      icon: FaMoneyBillWave,
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

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // ทำให้ปุ่มค่อยๆ ทยอยปรากฏตัว
      },
    },
  };

  return (
    <motion.div
      id="actions-grid"
      className="flex items-center justify-around gap-2"
      variants={gridVariants}
      initial="hidden"
      animate="visible"
      transition={{ ease: "easeInOut", duration: 0.5, delay: 0.2 }}
    >
      {actionItems.map((item) => (
        // เรียกใช้ ActionButton สำหรับแต่ละ item
        <ActionButton key={item.key} item={item} />
      ))}
      {role === "ADMIN" && (
        <Link
          className="group flex cursor-pointer flex-col items-center justify-center gap-2"
          href={`/admin/${line_user_id}`}
        >
          <motion.div
            initial="initial"
            whileTap={"tapping"}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--card-bg-dark)] text-xl text-white/90 drop-shadow-lg drop-shadow-black/50 backdrop-blur-2xl"
          >
            <MdManageAccounts size={32} />
          </motion.div>
          <span className="text-sm font-bold text-[var(--light-text)] transition-colors group-hover:text-white">
            แอดมิน
          </span>
        </Link>
      )}
    </motion.div>
  );
}
