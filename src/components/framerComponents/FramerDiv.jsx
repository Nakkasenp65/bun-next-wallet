// file: framerComponents/FramerDiv.jsx (The Re-Woven Version)

"use client";

import { motion, AnimatePresence } from "framer-motion";

// --- 1. The Animation Blueprint ---
// เราได้สร้าง "พิมพ์เขียว" ของ Animation รูปแบบต่างๆ ที่เราจะใช้บ่อยๆ
const variantsBlueprint = {
  slide: {
    right: { hidden: { x: "100%" }, visible: { x: 0 } },
    left: { hidden: { x: "-100%" }, visible: { x: 0 } },
    bottom: { hidden: { y: "100%" }, visible: { y: 0 } },
    top: { hidden: { y: "-100%" }, visible: { y: 0 } },
  },
  fade: {
    in: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  },
};

// --- 2. The Optimized Component ---
// เราได้ลบ `memo` ออก เพราะ Framer Motion จัดการ Performance ได้ดีอยู่แล้ว
// และเพิ่ม props ใหม่เพื่อความยืดหยุ่น
export default function FramerDiv({
  isOpen,
  children,
  className,
  type = "slide", // 'slide' or 'fade'
  direction = "right", // 'right', 'left', 'bottom', 'top' (for slide type)
  transitionProps = { duration: 0.4, ease: "easeInOut" }, // --- 3. Centralized Transition ---
}) {
  // --- 4. Dynamic Variant Selection ---
  // เลือก "พิมพ์เขียว" ที่ถูกต้องตาม props ที่ส่งเข้ามา
  const selectedVariant =
    variantsBlueprint[type]?.[direction] || variantsBlueprint.fade.in;

  const variants = {
    hidden: {
      ...selectedVariant.hidden,
      transition: transitionProps,
    },
    visible: {
      ...selectedVariant.visible,
      transition: transitionProps,
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
          // --- 5. Performance Boost ---
          // บอกให้ Browser เตรียมเร่งความเร็ว Animation ที่เกี่ยวกับ transform และ opacity
          style={{ willChange: "transform, opacity" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
