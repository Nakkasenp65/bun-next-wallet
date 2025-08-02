"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";

import Loading from "@/components/StatusComponents/Loading";
import WalletHeader from "../components/Ui/WalletHeader";
import SavingsGoalCard from "../components/Ui/SavingGoalCard";
import ActionGrid from "../components/Ui/ActionGrid";
import SavingsMission from "../components/Ui/SavingsMission";
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
import { useGetMissions } from "@/hooks/useMission";
import MainTransactionList from "@/components/TransactionComponents/MainTransactionList";

export default function HomePage() {
  const router = useRouter();
  const { liffProfile, isLoggedIn } = useLiff();
  const { data: userData, isLoading: isUserDataLoading, error: isUserDataError } = useUser(liffProfile?.userId);
  const { data: userStatus, isLoading: isStatusLoading, error: statusError } = useUserStatus(liffProfile?.userId);
  const { data: missionData, isLoading: missionLoading, error: missionError } = useGetMissions();

  const [showTransfer, setShowTransfer] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showGoal, setShowGoal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showContact, setShowContact] = useState(false);

  console.log("userdata: ", userData);
  console.log("userStatus: ", userStatus);

  useEffect(() => {
    if (userStatus?.isNewUser) {
      router.push("/welcome");
    }
    // else setIsLoggedIn(true);
  }, [userStatus, isStatusLoading, liffProfile]);

  if (!liffProfile || !isLoggedIn || isStatusLoading || isUserDataLoading || missionLoading) {
    return (
      <div className="gradient-background flex h-dvh w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isUserDataError || statusError) {
    return <ErrorComponent />;
  }

  if (userData)
    return (
      <>
        <NotificationPage
          userId={userData.userId}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
        />
        <TransferPage userData={userData} showTransfer={showTransfer} setShowTransfer={setShowTransfer} />
        <WithdrawPage userData={userData} showWithdraw={showWithdraw} setShowWithdraw={setShowWithdraw} />
        <DepositPage userData={userData} showDeposit={showDeposit} setShowDeposit={setShowDeposit} />
        <GoalPage userData={userData} showGoal={showGoal} setShowGoal={setShowGoal} />
        <ContactPage showContact={showContact} setShowContact={setShowContact} />

        <div className="gradient-background font-main relative flex h-dvh w-full flex-col overflow-hidden lg:mx-auto lg:max-w-[450px] lg:shadow-lg">
          <main className="flex-grow overflow-y-auto">
            {/* Profile Part */}
            <section className="flex flex-col gap-8 px-6 py-4 pb-8">
              <WalletHeader
                userName={userData.username}
                profileUrl={userData.userProfilePicUrl}
                setShowNotifications={setShowNotifications}
                notifications={userData.notifications}
              />
              <SavingsGoalCard
                brand={userData.goal.product.brand}
                name={userData.goal.product.model}
                target={userData.goal.product.price}
                balance={userData.wallet.balance}
                imageUrl={userData.goal.product.imageUrl}
              />
              <ActionGrid
                setShowTransfer={setShowTransfer}
                setShowWithdraw={setShowWithdraw}
                setShowDeposit={setShowDeposit}
                setShowGoal={setShowGoal}
              />
            </section>

            {/* Transaction Part */}
            <section className="relative flex flex-col items-center gap-6 rounded-t-3xl bg-white px-6 pt-10 pb-28 shadow-lg">
              <div className="absolute top-3 flex h-2 w-full items-center justify-center">
                <span className="h-1.5 w-10 rounded-full bg-gray-300" />
              </div>

              <SavingsMission missions={missionData} />
              <MainTransactionList walletId={userData.wallet.id} />
            </section>
          </main>

          {/* Bottom Navbar */}
          <BottomNav setShowContact={setShowContact} />
        </div>
      </>
    );
}
