"use client";
import React, { createContext, useState, useContext } from "react";

const LockContext = createContext(null);

export function LockProvider({ children }) {
  const [isLocked, setIsLocked] = useState(false);

  const lockApp = () => setIsLocked(true);
  const unlockApp = () => setIsLocked(false);

  return (
    <LockContext.Provider value={{ isLocked, lockApp, unlockApp }}>
      {children}
    </LockContext.Provider>
  );
}

export function useLockContext() {
  const context = useContext(LockContext);
  if (!context) {
    throw new Error("useLockContext must be used within a LockProvider");
  }
  return context;
}
