"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function FramerDiv({ isOpen, children, className }) {
  const variants = {
    hidden: {
      y: "100%",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
    visible: {
      y: 0,
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
          variants={variants}
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
