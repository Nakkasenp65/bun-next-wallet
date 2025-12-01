"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowRightLong } from "react-icons/fa6";
interface FramerLinkProps {
  link: string;
  children: React.ReactNode;
  iconColor: string;
}

export default function FramerLink({ link, children, iconColor }: FramerLinkProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 1000, damping: 20 }}
      className={`rounded-full bg-${iconColor}/5 p-3`}
    >
      <Link
        href={link}
        className={`flex items-center gap-1 text-sm font-semibold text-white`}
      >
        {children}
        <FaArrowRightLong className={`text-${iconColor}`} size={16} />
      </Link>
    </motion.div>
  );
}
