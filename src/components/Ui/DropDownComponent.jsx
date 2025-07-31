// src/components/Ui/DropDownComponent.js

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Animation for the dropdown menu
const dropdownVariants = {
  initial: { opacity: 0, y: -5, scale: 0.98 },
  open: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 25 } },
  exit: { opacity: 0, y: -5, scale: 0.98, transition: { duration: 0.1 } },
};

export default function DropDownComponent({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  // New props to allow complete style overrides
  buttonClassName = "",
  optionsContainerClassName = "",
  optionClassName = "",
  labelClassName = "",
  icon,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleOptionClick = (optionValue) => {
    // Simulate the event object for the parent's handleChange
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
  };

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className={labelClassName}>
          {label}
        </label>
      )}
      <div className="relative w-full" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-full text-left transition-all ${buttonClassName}`}
        >
          {value || placeholder}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
            {icon || (
              <motion.svg
                className="h-6 w-6 fill-current text-pink-500"
                viewBox="0 0 20 20"
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </motion.svg>
            )}
          </div>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              variants={dropdownVariants}
              initial="initial"
              animate="open"
              exit="exit"
              className={`ring-opacity-5 scrollbar-hide absolute z-20 mt-1 max-h-60 w-full origin-top list-none overflow-y-auto rounded-xl bg-white shadow-lg ring-1 focus:outline-none ${optionsContainerClassName}`}
            >
              {options.map((option) => (
                <li
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  className={`cursor-pointer p-3 font-medium text-gray-800 select-none hover:bg-pink-50/50 ${optionClassName}`}
                >
                  {option}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
