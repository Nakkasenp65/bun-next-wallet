import { motion } from "framer-motion";

export default function ProgressIndicator({ totalSteps, currentStep }) {
  return (
    <div className="flex w-full justify-center gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <motion.div
          key={index}
          className="mb-8 h-2 rounded-full"
          initial={false}
          animate={{
            width: index === currentStep ? "2rem" : "0.5rem",
            backgroundColor: index <= currentStep ? "#ff2d96" : "#e5e7eb", // Pink for active/done, gray for upcoming
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      ))}
    </div>
  );
}
