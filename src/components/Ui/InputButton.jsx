import { motion } from "framer-motion";
export default function InputButton({ amount, setAmount }) {
  return (
    <motion.button
      onClick={() => setAmount(amount)}
      className="w-full h-12 text-bg-dark/80 font-bold rounded-lg bg-stone-100"
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      ฿{amount}
    </motion.button>
  );
}
