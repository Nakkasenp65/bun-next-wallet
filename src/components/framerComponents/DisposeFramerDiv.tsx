"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";

interface DisposeFramerDivProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
}

export default function DisposeFramerDiv({
  isOpen,
  children,
  className,
  variants,
}: DisposeFramerDivProps) {
  const defaultVariants: Variants = {
    hidden: {
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
    visible: {
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={className}
          variants={variants || defaultVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
