"use client";
//REACT HOOKS AND LIBRARY IMPORT
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROVIDERS AND HOOKS
import { LiffProfile, useLiff } from "@/components/provider/LiffProvider";
import { useGetUser, useUserStatus } from "@/hooks/useUser";

// UI & PAGE COMPONENTS
import LockScreen from "@/components/ui/LockScreen"; // <-- IMPORTANT: Import the lock screen
import Loading from "@/components/StatusComponents/Loading";
import ErrorComponent from "@/components/ui/ErrorComponent";

// MAINPAGE COMPONENT
import MainPage from "@/components/pages/MainPage";

export default function HomePage() {
  const router = useRouter();
  const {
    liffProfile,
    isLoggedIn,
  }: { liffProfile: LiffProfile | null; isLoggedIn: boolean } = useLiff();
  const [gateStatus, setGateStatus] = useState<
    "CHECKING" | "REDIRECTING" | "LOCKED" | "ALLOWED" | "ERROR"
  >("CHECKING"); // CHECKING | REDIRECTING | LOCKED | ALLOWED
  const {
    data: userStatus,
    isLoading: isStatusLoading,
    error: statusError,
  } = useUserStatus(liffProfile?.userId);

  /* 
    Redundant data fetching removed. 
    MainPage component handles fetching its own data.
  */

  useEffect(() => {
    if (!isLoggedIn || isStatusLoading) {
      return;
    }

    if (statusError) {
      setGateStatus("ERROR");
      return;
    }

    if (userStatus) {
      // Rule 1: New users must be redirected. This is the highest priority.
      if (userStatus.isNewUser) {
        setGateStatus("REDIRECTING");
        router.replace("/welcome"); // Use replace to prevent user from navigating back.
        return;
      }

      // Rule 2: Existing users might be locked.
      if (userStatus.isLocked) {
        setGateStatus("LOCKED");
        return;
      }

      setGateStatus("ALLOWED");
    }
  }, [isLoggedIn, isStatusLoading, userStatus, statusError, router]);

  if (gateStatus === "CHECKING") {
    return (
      <div className="gradient-background flex h-dvh w-full items-center justify-center">
        <Loading message={"กำลังตรวจสอบสถานะ"} />
      </div>
    );
  }

  if (gateStatus === "REDIRECTING") {
    return (
      <div className="gradient-background flex h-dvh w-full items-center justify-center">
        <Loading message={"กำลังไปยังหน้าสมัครสมาชิก"} />
      </div>
    );
  }

  if (gateStatus === "LOCKED") {
    return <LockScreen />;
  }

  if (gateStatus === "ERROR") {
    return (
      <ErrorComponent message="Failed to verify user status. Please try again." />
    );
  }

  if (gateStatus === "ALLOWED") {
    return <MainPage liffProfile={liffProfile} />;
  }

  return null;
}
