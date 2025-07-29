"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";

import Loading from "@/components/Loading";
import WalletHeader from "../components/Ui/WalletHeader";
import SavingsGoalCard from "../components/Ui/SavingGoalCard";
import ActionGrid from "../components/Ui/ActionGrid";
import TransactionList from "../components/TransactionComponents/TransactionList";
import SavingsMissionCard from "../components/Ui/SavingsMissionCard";
import BottomNav from "../components/Ui/BottomNav";

import TransferPage from "@/components/pages/TransferPage";
import WithdrawPage from "@/components/pages/WithdrawPage";
import DepositPage from "@/components/pages/DepositPage";
import GoalPage from "@/components/pages/GoalPage";
import NotificationPage from "@/components/pages/NotificationPage";
import ErrorComponent from "@/components/Ui/ErrorComponent";
import { useUserStatus } from "@/hooks/useUserStatus";
import { useLiff } from "@/components/provider/LiffProvider";
import ContactPage from "@/components/pages/ContactPage";

export default function HomePage() {
  const router = useRouter();
  const { liffProfile, isLoggedIn } = useLiff();
  const [showTransfer, setShowTransfer] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showGoal, setShowGoal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const missionData = {
    title: "First Savings Ever",
    description: "ออมเงินครั้งแรก",
    currentProgress: 0,
    targetProgress: 1,
    rewardAmount: 20,
  };
  const { data: userStatus, isLoading: isStatusLoading, error: statusError } = useUserStatus(liffProfile?.userId);
  const { data: userData, isLoading, error } = useUser(liffProfile?.userId);

  console.log(userStatus);
  console.log("User Data: ", userData);

  useEffect(() => {
    if (!isStatusLoading && liffProfile && userStatus && (userStatus.isNewUser || userStatus.firstTime)) {
      router.push("/welcome");
    }
  }, [userStatus, isStatusLoading, liffProfile, router]);

  if (!liffProfile || !isLoggedIn) {
    return (
      <div className="bg-bg-dark flex h-dvh w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error || statusError) {
    return <ErrorComponent />;
  }

  if (isLoading || isStatusLoading || !userData) {
    return (
      <div className="bg-bg-dark flex h-dvh w-full items-center justify-center">
        <Loading />
      </div>
    );
  } else
    return (
      <>
        <NotificationPage userId={userData.userId} showNotifications={showNotifications} setShowNotifications={setShowNotifications} />
        <TransferPage userData={userData} showTransfer={showTransfer} setShowTransfer={setShowTransfer} />
        <WithdrawPage userData={userData} showWithdraw={showWithdraw} setShowWithdraw={setShowWithdraw} />
        <DepositPage userData={userData} showDeposit={showDeposit} setShowDeposit={setShowDeposit} />
        <GoalPage userData={userData} showGoal={showGoal} setShowGoal={setShowGoal} />
        <ContactPage showContact={showContact} setShowContact={setShowContact} />

        <div className="bg-bg-dark font-main relative flex h-dvh w-full flex-col overflow-hidden lg:mx-auto lg:max-w-[450px] lg:shadow-lg">
          <main className="flex-grow overflow-y-auto">
            {/* Profile Part */}
            <section className="flex flex-col gap-8 px-6 py-4">
              <WalletHeader
                userName={userData.username}
                profileUrl={userData.userProfilePicUrl}
                setShowNotifications={setShowNotifications}
                notifications={userData.notifications}
              />
              <SavingsGoalCard
                brand={userData.goal.mobileModel.brand.name}
                name={userData.goal.mobileModel.name}
                target={userData.goal.mobileModel.price}
                balance={userData.wallet.balance}
              />
              <ActionGrid
                setShowTransfer={setShowTransfer}
                setShowWithdraw={setShowWithdraw}
                setShowDeposit={setShowDeposit}
                setShowGoal={setShowGoal}
              />
            </section>

            {/* Transaction Part */}
            <section className="relative flex flex-col items-center gap-4 rounded-t-3xl bg-white px-6 pt-6 pb-28 shadow-lg">
              <div className="absolute top-3 flex h-2 w-full items-center justify-center">
                <span className="h-1.5 w-10 rounded-full bg-gray-300" />
              </div>
              <TransactionList walletId={userData.wallet.id} />
              <SavingsMissionCard
                title={missionData.title}
                description={missionData.description}
                currentProgress={missionData.currentProgress}
                targetProgress={missionData.targetProgress}
                rewardAmount={missionData.rewardAmount}
              />
            </section>
          </main>

          {/* Bottom Navbar */}
          <BottomNav setShowContact={setShowContact} />
        </div>
      </>
    );
}
