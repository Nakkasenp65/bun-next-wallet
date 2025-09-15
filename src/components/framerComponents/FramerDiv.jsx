"use client";

import { motion, AnimatePresence } from "framer-motion";
import { memo } from "react";

const FramerDiv = memo(({ isOpen, children, className }) => {
  const variants = {
    hidden: {
      x: "100%",
      transition: {
        // 👇 ปรับแก้ตรงนี้
        duration: 0.3, // กำหนดระยะเวลา (หน่วยเป็นวินาที)
        ease: "easeInOut", // กำหนด easing function
      },
    },
    visible: {
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
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
});

export default FramerDiv;
