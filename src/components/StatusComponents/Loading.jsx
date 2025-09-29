"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Loading({ message }) {
  return (
    <div className="gradient-bg flex h-dvh w-full flex-col items-center justify-center gap-8 overflow-hidden px-6">
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 opacity-20"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 0.2 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-purple-500 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-pink-500 blur-3xl" />
      </motion.div>

      {/* Main loading image with entrance animation */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: [0.34, 1.56, 0.64, 1], // Bouncy easing
        }}
        className="relative z-10"
      >
        <Image
          src={"/assets/images/loading-bank.gif"}
          width={1440}
          height={1440}
          alt="moving coin loading"
          className="h-auto w-72"
          priority
        />

        {/* Glow effect around image */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 opacity-10 blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Loading dots indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="z-10 mt-4 flex gap-2"
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="h-3 w-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* Message with staggered animation */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative z-10"
        >
          <motion.div
            className="animate-shining from-primary-pink flex items-center justify-center gap-2 overflow-hidden bg-gradient-to-r via-purple-600 to-[#ff0073] bg-[length:200%_100%] bg-clip-text px-4 text-center text-2xl font-bold text-transparent"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {message}
          </motion.div>
        </motion.div>
      )}

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-white opacity-40"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [null, -50, null],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
