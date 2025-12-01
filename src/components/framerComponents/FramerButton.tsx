import { motion } from "framer-motion";
export default function ({ children, className, ...rest }) {
  return (
    <motion.button
      className={className}
      {...rest}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 1000, damping: 20 }}
    >
      {children}
    </motion.button>
  );
}
