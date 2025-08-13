"use client";
import React from "react";
import { useLiff } from "./LiffProvider";
import { useUser } from "@/hooks/useUser";
import LockScreen from "@/components/Ui/LockScreen";
import Loading from "../StatusComponents/Loading";

export default function AppGate({ children }) {
  const { liffProfile } = useLiff();

  const { data: user, isLoading, isError } = useUser(liffProfile?.userId);

  // Show a loading screen while LIFF is initializing or the user data is being fetched.
  if (isLoading || !liffProfile) {
    return <Loading message="กำลังเริ่มต้น..." />;
  }

  if (isError) {
    return children;
  }

  if (user?.isLocked) {
    return <LockScreen />;
  }

  // If the user is not locked, we render the actual application.
  return children;
}
