"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

interface SlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export default function SlipModal({ isOpen, onClose, imageUrl }: SlipModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] max-w-md w-full overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-10 rounded-full bg-black/50 p-2 text-white backdrop-blur-md transition-colors hover:bg-black/70"
            >
              <X size={20} />
            </button>
            
            <div className="relative aspect-[3/4] w-full bg-gray-100">
              <Image
                src={imageUrl}
                alt="Transaction Slip"
                fill
                className="object-contain p-2"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
