// src/components/Ui/DropDownComponent.js (Final, Universal Version)

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

const dropdownVariants = {
  initial: { opacity: 0, y: -5, scale: 0.98 },
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, y: -5, scale: 0.98, transition: { duration: 0.1 } },
};

export default function DropDownComponent({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder,
  buttonClassName = "",
  optionsContainerClassName = "",
  optionClassName = "",
  labelClassName = "",
  icon,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // --- NEW: Check if the options are simple strings or objects ---
  // This makes the component backward compatible with your UserInputMonthly.jsx
  const isObjectOptions = options.length > 0 && typeof options[0] === "object";
  console.log(isObjectOptions);

  const getDisplayLabel = () => {
    if (isObjectOptions) {
      console.log(options);
      const selectedOption = options.find((option) => option.value === value);
      console.log(selectedOption);
      return selectedOption ? selectedOption.label : placeholder;
    }
    // For simple string arrays
    return value || placeholder;
  };

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
    console.log("OPTION VLAUE", optionValue);
    // --- NEW: Simulate the event object for backward compatibility ---
    // This is the key to making it work with UserInputMonthly's generic handleChange
    const simulatedEvent = {
      target: {
        name: name,
        value: optionValue,
      },
    };
    onChange(optionValue);
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
          className={clsx(
            "relative w-full text-left transition-all",
            buttonClassName,
          )}
        >
          <span className={value ? "text-gray-800" : "text-gray-400"}>
            {getDisplayLabel()}
          </span>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
            <motion.svg
              className="h-6 w-6 fill-current text-pink-500"
              viewBox="0 0 20 20"
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.1 }}
            >
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </motion.svg>
          </div>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              variants={dropdownVariants}
              initial="initial"
              animate="open"
              exit="exit"
              className={clsx(
                "ring-opacity-5 scrollbar-hide absolute z-20 mt-1 max-h-60 w-full origin-top list-none overflow-y-auto rounded-xl bg-white shadow-lg ring-1 focus:outline-none",
                optionsContainerClassName,
              )}
            >
              {options.map((option) => {
                // --- NEW: Handle both string and object options ---
                const optionValue = isObjectOptions ? option.value : option;
                const optionLabel = isObjectOptions ? option.label : option;

                return (
                  <li
                    key={optionValue} // Always use a unique primitive value for the key
                    onClick={() => handleOptionClick(optionValue)}
                    className={clsx(
                      "cursor-pointer p-3 font-medium text-gray-800 select-none hover:bg-pink-50/50",
                      optionClassName,
                    )}
                  >
                    {optionLabel} {/* Always display a readable label */}
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
