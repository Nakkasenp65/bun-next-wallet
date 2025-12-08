import { motion } from "framer-motion";
export default function InputButton({ amount, setAmount }) {
  return (
    <motion.button
      onClick={() => setAmount(amount)}
      className="text-bg-dark/80 h-12 w-full rounded-lg bg-stone-100 font-bold"
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      ฿{amount}
    </motion.button>
  );
}
