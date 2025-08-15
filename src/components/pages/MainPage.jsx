"use client";
//REACT HOOKS AND LIBRARY IMPORT
import { useState } from "react";
import toast from "react-hot-toast";

// PROVIDERS AND HOOKS
import { useUser } from "@/hooks/useUser";
import {
  useGetMyMissions,
  useGetAvailableMissions,
  useClaimMission,
} from "@/hooks/useMission";
import { useSuccessTransactions } from "@/hooks/useTransactions";

// UI & PAGE COMPONENTS
import ErrorComponent from "../Ui/ErrorComponent";
import WalletHeader from "../Ui/WalletHeader";
import SavingsGoalCard from "../Ui/SavingGoalCard";
import ActionGrid from "../Ui/ActionGrid";
import SavingsMission from "../Ui/SavingsMission";
import BottomNav from "../Ui/BottomNav";
import MyMissions from "../Ui/MyMissions";
import MainTransactionList from "@/components/TransactionComponents/MainTransactionList";
import RedeemConfirmationModal from "@/components/Ui/RedeemConfirmation";
import TransferPage from "./TransferPage";
import WithdrawPage from "./WithdrawPage";
import DepositPage from "./DepositPage";
import GoalPage from "./GoalPage";
import NotificationPage from "./NotificationPage";
import ContactPage from "./ContactPage";

// SKELETONS
import WalletHeaderSkeleton from "@/components/SkeletonComponents/WalletHeaderSkeleton";
import SavingsGoalCardSkeleton from "../SkeletonComponents/SavingGoalCardSkeleton";
import { useNotification } from "@/hooks/useNotification";
import { useRouter } from "next/navigation";

export default function MainPage({ liffProfile }) {
  const date = new Date();
  const router = useRouter();
  const {
    data: userData,
    isLoading: isUserDataLoading,
    error: isUserDataError,
  } = useUser(liffProfile?.userId);

  const { data: notificationData, isLoading: notificationLoading } =
    useNotification(userData?.id);

  console.log("userData main page: \n", userData);

  const {
    data: transactions,
    isLoading: transactionLoading,
    error: transactionError,
  } = useSuccessTransactions(
    date.getFullYear(),
    date.getMonth(),
    userData?.wallet.id,
  );

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

  const [showTransfer, setShowTransfer] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showGoal, setShowGoal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const confirmAndProceedToRedeem = () => {
    setShowRedeemModal(false);
    window
      .open(
        `http://app.no1.mobi/landing-page-installment/${userData.line_user_id}`,
        "_blank",
      )
      ?.focus();
  };

  const handleChangeToCloserGoal = () => {
    setShowRedeemModal(false);
    toast("เก็บเงินเพิ่มอีกนิดเพื่อรางวัลที่ใหญ่กว่า!", { icon: "🚀" });
    setShowGoal(true);
  };
  const claimRewardMutation = useClaimMission();

  const handleClaimMission = ({ userId, userMissionId }) => {
    claimRewardMutation.mutate({ userId, userMissionId });
  };

  const handleDoMission = (mission, location) => {
    if (!mission || !mission.type) return;

    console.log(`Executing mission type: ${mission.type}`);

    switch (mission.type) {
      case "ONBOARDING":
        if (location === "mainPage") setShowDeposit(true);
        else router.push("/");
      case "ACCUMULATION":
        if (location === "mainPage") setShowDeposit(true);
        else router.push("/");
        break;
      case "STREAK":
        // For these types, we open the deposit page.
        if (location === "mainPage") setShowDeposit(true);
        else router.push("/");
        break;

      case "REFERRAL":
        // For this type, we construct a link and copy it to the clipboard.
        const referralLink = `https://lin.ee/0ab3Rcl`;
        navigator.clipboard
          .writeText(referralLink)
          .then(() => {
            toast.success("คัดลอกลิงก์แนะนำเพื่อนแล้ว!");
          })
          .catch((err) => {
            console.error("Failed to copy text: ", err);
            toast.error("ไม่สามารถคัดลอกลิงก์ได้");
          });
        break;

      default:
        // Optional: handle any other mission types or do nothing.
        console.log(`No action defined for mission type: ${mission.type}`);
        break;
    }
  };

  if (isUserDataError || missionError || transactionError)
    return <ErrorComponent />;

  return (
    <>
      {isUserDataLoading ? null : (
        <>
          <RedeemConfirmationModal
            isOpen={showRedeemModal}
            onClose={() => setShowRedeemModal(false)}
            onConfirmRedeem={confirmAndProceedToRedeem}
            onChangeGoal={handleChangeToCloserGoal}
            currentBalance={userData?.wallet?.balance || 0}
            goalProduct={userData?.goal?.product}
          />
          <NotificationPage
            userId={userData?.id}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            notificationData={notificationData}
            notificationLoading={notificationLoading}
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
        </>
      )}

      <div className="gradient-background font-main relative flex h-dvh w-full flex-col overflow-hidden lg:mx-auto lg:max-w-[450px] lg:shadow-lg">
        <main className="relative flex-grow overflow-y-auto">
          <section className="flex flex-col gap-10 px-6 py-4 pb-8">
            {isUserDataLoading ? (
              <>
                <WalletHeaderSkeleton /> <SavingsGoalCardSkeleton />{" "}
              </>
            ) : (
              <>
                <WalletHeader
                  userName={userData.line_display_name}
                  profileUrl={userData.line_profile_url}
                  setShowNotifications={setShowNotifications}
                  notifications={notificationData}
                  userLineId={userData.line_user_id}
                />
                <SavingsGoalCard
                  brand={userData?.goal.product.brand}
                  name={userData?.goal.product.model}
                  target={userData?.goal.product.downPaymentAmount}
                  balance={userData?.wallet.balance}
                  bonusBalance={userData?.wallet.bonusBalance}
                  imageUrl={userData?.goal.product.imageUrl}
                  handleRedeem={() => setShowRedeemModal(true)}
                />
              </>
            )}
            <ActionGrid
              setShowTransfer={setShowTransfer}
              setShowWithdraw={setShowWithdraw}
              setShowDeposit={setShowDeposit}
              setShowGoal={setShowGoal}
            />
          </section>
          <section className="relative flex min-h-[400px] flex-col items-center gap-8 rounded-t-3xl bg-white px-6 pt-10 pb-28 shadow-lg">
            <div className="absolute top-3 flex h-2 w-full items-center justify-center">
              <span className="h-1.5 w-10 rounded-full bg-gray-300" />
            </div>
            {isUserDataLoading ? null : (
              <>
                <MyMissions
                  missions={myMission}
                  userData={userData}
                  onDoMission={handleDoMission}
                  onClaim={handleClaimMission}
                />
                <SavingsMission
                  missions={availableMission}
                  userData={userData}
                />
                <MainTransactionList
                  transactions={transactions}
                  transactionLoading={transactionLoading}
                  transactionError={transactionError}
                />
              </>
            )}
          </section>
        </main>
        <BottomNav
          userId={userData?.line_user_id}
          setShowContact={setShowContact}
        />
      </div>
    </>
  );
}
