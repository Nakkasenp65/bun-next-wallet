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
import { useUserStatus } from "@/hooks/useUser";
import { useLiff } from "@/components/provider/LiffProvider";
import ContactPage from "@/components/pages/ContactPage";
import { useGetAvailableMissions, useGetMyMissions } from "@/hooks/useMission";
import MainTransactionList from "@/components/TransactionComponents/MainTransactionList";
import MyMissions from "@/components/Ui/MyMissions";
import { useSuccessTransactions } from "@/hooks/useTransactions";

export default function HomePage() {
  const router = useRouter();
  const date = new Date();
  const { liffProfile, isLoggedIn } = useLiff();
  const {
    data: userStatus,
    isLoading: isStatusLoading,
    error: statusError,
  } = useUserStatus(liffProfile?.userId);
  const {
    data: userData,
    isLoading: isUserDataLoading,
    error: isUserDataError,
  } = useUser(liffProfile?.userId);

  const {
    data: availableMission,
    isLoading: missionLoading,
    error: missionError,
  } = useGetAvailableMissions(userData?.id);
  const {
    data: myMission,
    isLoading: myMissionLoading,
    error: myMissionError,
  } = useGetMyMissions(userData?.id);
  const {
    data: transactions,
    isLoading: transactionLoading,
    error: transactionError,
  } = useSuccessTransactions(
    date.getFullYear(),
    date.getMonth(),
    userData?.wallet.id,
  );

  console.log(userData);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showGoal, setShowGoal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showContact, setShowContact] = useState(false);
  useEffect(() => {
    if (userStatus?.isNewUser) router.push("/welcome");
  }, [userStatus, liffProfile]);

  if (!liffProfile || !isLoggedIn || isStatusLoading || isUserDataLoading) {
    return (
      <div className="gradient-background flex h-dvh w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  if ((isUserDataError, statusError, missionError)) return <ErrorComponent />;
  if (userData)
    return (
      <>
        <NotificationPage
          userId={userData?.userId}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
        />
        <TransferPage
          userData={userData}
          showTransfer={showTransfer}
          setShowTransfer={setShowTransfer}
        />
        <WithdrawPage
          userData={userData}
          showWithdraw={showWithdraw}
          setShowWithdraw={setShowWithdraw}
        />
        <DepositPage
          userData={userData}
          showDeposit={showDeposit}
          setShowDeposit={setShowDeposit}
        />
        <GoalPage
          userData={userData}
          showGoal={showGoal}
          setShowGoal={setShowGoal}
        />
        <ContactPage
          showContact={showContact}
          setShowContact={setShowContact}
        />

        <div className="gradient-background font-main relative flex h-dvh w-full flex-col overflow-hidden lg:mx-auto lg:max-w-[450px] lg:shadow-lg">
          <main className="relative flex-grow overflow-y-auto">
            {/* Profile Part */}
            <section className="flex flex-col gap-10 px-6 py-4 pb-8">
              <WalletHeader
                userName={userData.line_display_name}
                profileUrl={userData.line_profile_url}
                setShowNotifications={setShowNotifications}
                notifications={userData.notifications}
                userLineId={userData.line_user_id}
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
            <section className="relative flex min-h-[400px] flex-col items-center gap-8 rounded-t-3xl bg-white px-6 pt-10 pb-28 shadow-lg">
              <div className="absolute top-3 flex h-2 w-full items-center justify-center">
                <span className="h-1.5 w-10 rounded-full bg-gray-300" />
              </div>

              <MyMissions missions={myMission} userId={userData?.id} />
              <SavingsMission
                missions={availableMission}
                userId={userData?.id}
              />
              <MainTransactionList transactions={transactions} />
            </section>
          </main>

          {/* Bottom Navbar */}
          <BottomNav
            userId={userData.line_user_id}
            setShowContact={setShowContact}
          />
        </div>
      </>
    );
}
