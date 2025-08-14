"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import { useLiff } from "../provider/LiffProvider"; // Adjust path if needed
import { useLockStatus } from "@/hooks/useUser"; // Adjust path if needed

const LockContext = createContext(null);

export function LockProvider({ children }) {
  const { liffProfile } = useLiff();

  // Fetch the authoritative status from the server
  const {
    data: serverStatus,
    isLoading,
    isFetching,
    isError,
  } = useLockStatus(liffProfile?.userId);

  // This state holds the UI's current lock status.
  // Default to true for security until we hear back from the server.
  const [isLocked, setIsLocked] = useState(true);

  // This effect syncs the server's status with our UI state once it's fetched.
  useEffect(() => {
    if (serverStatus) {
      setIsLocked(serverStatus.isLocked);
    }
  }, [serverStatus]);

  // like LockScreen
  const lockApp = () => setIsLocked(true);
  const unlockApp = () => setIsLocked(false);

  // The overall "checking" state for the entire authentication flow
  const isCheckingStatus = !liffProfile || isLoading || isFetching;

  const value = {
    isLocked, // The current UI lock state
    lockApp, // Function to lock the UI
    unlockApp, // Function to unlock the UI
    isCheckingStatus, // Is the initial check still running?
    status: serverStatus, // The full status object from the server ({isLocked, isNewUser})
    isError, // Was there an error fetching the status?
  };

  return <LockContext.Provider value={value}>{children}</LockContext.Provider>;
}

export function useLockContext() {
  const context = useContext(LockContext);
  if (!context) {
    throw new Error("useLockContext must be used within a LockProvider");
  }
  return context;
}
