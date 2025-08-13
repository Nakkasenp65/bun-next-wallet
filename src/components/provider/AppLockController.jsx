"use client";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLiff } from "./LiffProvider";
import { useUserStatus } from "@/hooks/useUser";
import { useLockContext } from "../context/LockContext";
import LockScreen from "@/components/Ui/LockScreen";

// List of routes that should NOT trigger the lock screen
const UNLOCKED_ROUTES = ["/welcome", "/register"]; // Add any other public routes

export default function AppLockController({ children }) {
  const { liffProfile, isReady } = useLiff();
  const pathname = usePathname();
  const { lockApp, isLocked } = useLockContext();

  // Fetch the user's status from the backend, which should include `isLocked`
  const { data: userStatus, isLoading } = useUserStatus(liffProfile?.userId);

  useEffect(() => {
    // If the user status from the backend says they are locked,
    // update our global context state to show the lock screen.
    if (userStatus?.isLocked) {
      lockApp();
    }
  }, [userStatus, lockApp]);

  // Determine if the lock screen should be shown
  const shouldShowLockScreen =
    isLocked && !UNLOCKED_ROUTES.includes(pathname) && isReady && !isLoading;

  return (
    <>
      {shouldShowLockScreen && <LockScreen />}
      {children}
    </>
  );
}
