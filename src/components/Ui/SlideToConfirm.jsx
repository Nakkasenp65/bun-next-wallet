"use client";
import React, { useRef, useState } from "react";
import { motion, useMotionValue, animate, useTransform } from "framer-motion";
import { FaArrowRight } from "react-icons/fa6";

const HANDLE_WIDTH = 50;
const TRACK_PADDING = 8;

export default function SlideToConfirm({ onConfirm }) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const trackRef = useRef(null);
  const x = useMotionValue(0);

  const opacity = useTransform(x, [0, 100], [0, 0.8]);

  const handleDragEnd = (event, info) => {
    if (isConfirmed) return;

    const track = trackRef.current;
    if (!track) return;

    const trackWidth = track.offsetWidth;
    const maxDragDistance = trackWidth - HANDLE_WIDTH - TRACK_PADDING;
    const dragOffset = info.offset.x;

    if (dragOffset > maxDragDistance * 0.9) {
      setIsConfirmed(true);

      animate(x, maxDragDistance, {
        type: "spring",
        stiffness: 400,
        damping: 40,
        onComplete: () => {
          onConfirm();
        },
      });
    } else {
      animate(x, 0, {
        type: "spring",
        stiffness: 400,
        damping: 40,
      });
    }
  };

  return (
    <div
      ref={trackRef}
      className="relative w-64 h-14 bg-gray-200/50 dark:bg-zinc-800 rounded-full flex items-center p-1 overflow-hidden shadow-neon-pink"
    >
      {/* Gradient background that appears when sliding */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-pink-500 via-orange-500 to-purple-500 "
        style={{
          opacity,
          backgroundSize: "200% 200%",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute h-12 w-12 rounded-full cursor-grab flex items-center justify-center text-white  z-10 "
        style={{
          x,
          background: "linear-gradient(45deg, #ec4899, #f97316, #a855f7)",
        }}
        drag="x"
        dragConstraints={trackRef}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        whileDrag={{ scale: 1.1 }}
      >
        <FaArrowRight size={18} />

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.3, 0],
            left: ["-50%", "150%", "150%"],
            top: ["-50%", "150%", "150%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            times: [0, 0.5, 1],
          }}
          style={{
            background:
              "linear-gradient(to bottom right, transparent 0%, transparent 45%, rgba(255,255,255,0.3) 50%, transparent 55%, transparent 100%)",
            transform: "rotate(30deg)",
          }}
        />
      </motion.div>

      <span className="absolute left-1/2 -translate-x-1/2 text-white  font-medium pointer-events-none z-0">
        Slide to Confirm
      </span>
    </div>
  );
}
