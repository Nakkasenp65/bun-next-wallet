"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { RiExternalLinkFill } from "react-icons/ri";
export default function ({ backgroundColor, link, children, icon }) {
  return (
    <motion.div
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 1000, damping: 20 }}
    >
      <Link
        href={link}
        className={`${backgroundColor} flex items-center gap-1 rounded-lg px-2 py-2 text-xs font-semibold text-white`}
      >
        {children}
        {icon}
      </Link>
    </motion.div>
  );
}
