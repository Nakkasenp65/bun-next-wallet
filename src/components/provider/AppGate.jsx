import React from "react";
import { useLockContext } from "../context/LockContext"; // Adjust path
import LockScreen from "@/components/Ui/LockScreen";
import Loading from "../StatusComponents/Loading";

export default function AppGate({ children }) {
  const { isCheckingStatus, status, isLocked, isError } = useLockContext();

  if (isCheckingStatus) {
    return <Loading message={"Verifying user access..."} />;
  }

  if (isError) {
    return (
      <Loading message={"Could not verify user status. Please try again."} />
    );
  }

  if (status?.isNewUser) {
    return children;
  }

  if (isLocked) {
    return <LockScreen />;
  }

  return children;
}
