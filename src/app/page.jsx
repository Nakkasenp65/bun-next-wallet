"use client";
//REACT HOOKS AND LIBRARY IMPORT
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROVIDERS AND HOOKS
import { useLiff } from "@/components/provider/LiffProvider";
import { useGetUser, useUserStatus } from "@/hooks/useUser";

// UI & PAGE COMPONENTS
import LockScreen from "@/components/ui/LockScreen"; // <-- IMPORTANT: Import the lock screen
import Loading from "@/components/StatusComponents/Loading";
import ErrorComponent from "@/components/ui/ErrorComponent";

// MAINPAGE COMPONENT
import MainPage from "@/components/pages/MainPage";
import { useGetGoal } from "../hooks/useGoal";
import { useGetWallet } from "../hooks/useWallet";
import { useSuccessTransactions } from "../hooks/useTransactions";
import { useGetAvailableMissions, useGetMyMissions } from "../hooks/useMission";

export default function HomePage() {
  const router = useRouter();
  const { liffProfile, isLoggedIn } = useLiff();
  const [gateStatus, setGateStatus] = useState("CHECKING"); // CHECKING | REDIRECTING | LOCKED | ALLOWED
  const {
    data: userStatus,
    isLoading: isStatusLoading,
    error: statusError,
  } = useUserStatus(liffProfile?.userId);

  const {
    data: userData,
    isLoading: isUserDataLoading,
    error: isUserDataError,
    refetch: refetchUserData,
  } = useGetUser(liffProfile?.userId);

  // ดึงข้อมูล wallet ของ user
  const {
    data: wallet,
    isLoading: walletLoading,
    error: walletError,
    refetch: refetchWallet,
  } = useGetWallet(liffProfile?.userId);

  // ดึงข้อมูล goal ของ user
  const { data: goal, isLoading: goalLoading, error: goalError } = useGetGoal(liffProfile?.userId);

  const date = new Date();

  const {
    data: transactions,
    isLoading: transactionLoading,
    error: transactionError,
  } = useSuccessTransactions(date.getFullYear(), date.getMonth(), wallet?.id);

  const {
    data: availableMission,
    isLoading: missionLoading,
    error: missionError,
  } = useGetAvailableMissions(userData?.id);

  // ดึงข้อมูลภารกิจที่ลงทะเบียนแล้ว
  const {
    data: myMission,
    isLoading: myMissionLoading,
    error: myMissionError,
  } = useGetMyMissions(userData?.id);

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
        <Loading message={"Verifying user status..."} />
      </div>
    );
  }

  if (gateStatus === "REDIRECTING") {
    return (
      <div className="gradient-background flex h-dvh w-full items-center justify-center">
        <Loading message={"Redirecting to registration..."} />
      </div>
    );
  }

  if (gateStatus === "LOCKED") {
    return <LockScreen />;
  }

  if (gateStatus === "ERROR") {
    return <ErrorComponent message="Failed to verify user status. Please try again." />;
  }

  if (gateStatus === "ALLOWED") {
    return <MainPage liffProfile={liffProfile} />;
  }

  return null;
}
