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
import SavingMission from "../Ui/SavingMission";
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
import { FcQuestions } from "react-icons/fc";
import Loading from "../StatusComponents/Loading";
import TransactionSkeleton from "../Ui/TransactionSkeleton";
import MissionCardSkeleton from "../SkeletonComponents/MissionCardSkeleton";
import MissionGridSkeleton from "../SkeletonComponents/MissionGridSkeleton";
import MyMissionCardSkeleton from "../SkeletonComponents/MyMissionCardSkeleton";

export default function MainPage({ liffProfile }) {
  const date = new Date();
  const router = useRouter();
  const {
    data: userData,
    isLoading: isUserDataLoading,
    error: isUserDataError,
    refetch: refetchUserData,
  } = useUser(liffProfile?.userId);

  const { data: notificationData, isLoading: notificationLoading } =
    useNotification(userData?.id);
  const claimRewardMutation = useClaimMission();

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

  console.log("userData main page: \n", userData);
  // console.log("notifications main page:\n", notificationData);

  // ดาวน์โทรศัพท์เมื่อยอดเงินถึงเป้าหมาย
  const confirmAndProceedToRedeem = () => {
    setShowRedeemModal(false);
    window
      .open(
        `http://app.no1.mobi/landing-page-installment/${userData.line_user_id}`,
        "_blank",
      )
      ?.focus();
  };

  // เปลี่ยนเป้าหมายตอนสถึงยอดดาวน์
  const handleChangeToCloserGoal = () => {
    setShowRedeemModal(false);
    toast("เก็บเงินเพิ่มอีกนิดเพื่อรางวัลที่ใหญ่กว่า!", { icon: "🚀" });
    setShowGoal(true);
  };

  // ฟังก์ชันรับภารกิจ

  // รับภารกิจ
  const handleClaimMission = ({ userId, userMissionId }) => {
    claimRewardMutation.mutate({ userId, userMissionId });
  };

  // ปุ่มรีเฟรชหน้า
  const handleRefresh = async () => {
    try {
      await refetchUserData();
    } catch (error) {
      toast.error("Failed to refresh data.");
    }
  };

  // กดทำภารกิจแบ่งตามประเภท
  const handleDoMission = (mission, location) => {
    if (!mission || !mission.type) return;

    console.log(`Executing mission type: ${mission.type}`);

    switch (mission.type) {
      case "ONBOARDING":
        if (location === "mainPage") setShowDeposit(true);
        else router.push("/homePage");
      case "ACCUMULATION":
        if (location === "mainPage") setShowDeposit(true);
        else router.push("/homePage");
        break;
      case "STREAK":
        // For these types, we open the deposit page.
        if (location === "mainPage") setShowDeposit(true);
        else router.push("/homePage");
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

      <div className="gradient-background font-main relative flex h-max min-h-dvh w-full flex-col overflow-x-hidden overflow-y-auto lg:mx-auto lg:max-w-[450px] lg:shadow-lg">
        <main className="relative overflow-y-auto">
          <section className="flex flex-col gap-10 px-4 py-4 pb-8">
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
                  isRefreshing={isUserDataLoading}
                  onRefresh={handleRefresh}
                />
              </>
            )}
            <ActionGrid
              setShowTransfer={setShowTransfer}
              setShowWithdraw={setShowWithdraw}
              setShowDeposit={setShowDeposit}
              setShowGoal={setShowGoal}
              role={userData?.role}
              line_user_id={userData?.line_user_id}
            />
          </section>
          <section className="relative flex min-h-[500px] flex-col items-center gap-8 rounded-t-3xl bg-white px-4 pt-10 pb-28 shadow-lg">
            <div className="absolute top-3 flex h-4 w-full items-center justify-center">
              <span className="h-1.5 w-10 rounded-full bg-gray-300" />
            </div>
            {isUserDataLoading ? (
              <div className="grid h-56 w-full grid-cols-1 items-center justify-center">
                <TransactionSkeleton />
                <TransactionSkeleton />
                <TransactionSkeleton />
                <TransactionSkeleton />
              </div>
            ) : (
              <>
                <MainTransactionList
                  transactions={transactions}
                  transactionLoading={transactionLoading}
                  transactionError={transactionError}
                />
                {myMissionLoading ? (
                  <MyMissionCardSkeleton />
                ) : (
                  <MyMissions
                    missions={myMission}
                    line_user_id={userData?.line_user_id}
                    userId={userData?.userId}
                    onDoMission={handleDoMission}
                    onClaim={handleClaimMission}
                  />
                )}
                {missionLoading ? (
                  <MyMissionCardSkeleton />
                ) : (
                  <SavingMission
                    userId={userData?.id}
                    line_user_id={userData?.line_user_id}
                    missions={availableMission}
                  />
                )}
              </>
            )}
          </section>
        </main>
        <BottomNav
          line_user_id={userData?.line_user_id}
          setShowContact={setShowContact}
        />
      </div>
    </>
  );
}
