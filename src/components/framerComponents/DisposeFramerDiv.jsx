"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function DisposeFramerDiv({ isOpen, children, className }) {
  const variants = {
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
        <motion.div className={className} variants={variants} initial="hidden" animate="visible" exit="hidden">
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
