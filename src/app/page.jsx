"use client";
//REACT HOOKS AND LIBRARY IMPORT
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// PROVIDERS AND HOOKS
import { useLiff } from "@/components/provider/LiffProvider";
import { useLockStatus, useUser, useUserStatus } from "@/hooks/useUser";
import { useGetMyMissions, useGetAvailableMissions } from "@/hooks/useMission";
import { useSuccessTransactions } from "@/hooks/useTransactions";

// UI & PAGE COMPONENTS
import LockScreen from "@/components/Ui/LockScreen"; // <-- IMPORTANT: Import the lock screen
import Loading from "@/components/StatusComponents/Loading";
import ErrorComponent from "@/components/Ui/ErrorComponent";
import WalletHeader from "@/components/Ui/WalletHeader";
import SavingsGoalCard from "../components/Ui/SavingGoalCard";
import ActionGrid from "../components/Ui/ActionGrid";
import SavingsMission from "../components/Ui/SavingsMission";
import BottomNav from "../components/Ui/BottomNav";
import MyMissions from "@/components/Ui/MyMissions";
import MainTransactionList from "@/components/TransactionComponents/MainTransactionList";
import RedeemConfirmationModal from "@/components/Ui/RedeemConfirmation";
import TransferPage from "@/components/pages/TransferPage";
import WithdrawPage from "@/components/pages/WithdrawPage";
import DepositPage from "@/components/pages/DepositPage";
import GoalPage from "@/components/pages/GoalPage";
import NotificationPage from "@/components/pages/NotificationPage";
import ContactPage from "@/components/pages/ContactPage";

// SKELETONS
import WalletHeaderSkeleton from "@/components/SkeletonComponents/WalletHeaderSkeleton";
import SavingsGoalCardSkeleton from "@/components/SkeletonComponents/SavingGoalCardSkeleton";
import MainPage from "@/components/pages/MainPage";

export default function HomePage() {
  const router = useRouter();
  const { liffProfile, isLoggedIn } = useLiff();

  const [gateStatus, setGateStatus] = useState("CHECKING"); // CHECKING | REDIRECTING | LOCKED | ALLOWED
  const {
    data: userStatus,
    isLoading: isStatusLoading,
    error: statusError,
  } = useLockStatus(liffProfile?.userId);

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
    return (
      <ErrorComponent message="Failed to verify user status. Please try again." />
    );
  }

  if (gateStatus === "ALLOWED") {
    return <MainPage liffProfile={liffProfile} />;
  }

  return null;
}
