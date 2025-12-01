"use client";
import React from "react";
import { motion } from "framer-motion";
import { IoIosArrowForward } from "react-icons/io";

const MenuItem = ({ icon, title, subtitle, onClick }) => {
  const variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.button
      variants={variants}
      onClick={onClick}
      className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-gray-100"
      whileTap={{ backgroundColor: "#f0f0f0" }}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600">
        {icon}
      </div>
      <div className="flex-grow">
        <p className="font-semibold text-gray-800">{title}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      <IoIosArrowForward className="text-xl text-gray-400" />
    </motion.button>
  );
};

export default MenuItem;
