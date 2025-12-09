"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AlertTriangle, MessageCircleQuestion } from "lucide-react"; // Import icons

// --- Components ---
import CtaButton from "@/components/ui/CtaButton";
import UserInputMonthly, { UserInputData } from "./components/UserInputMonthly";
import GoalSetter from "./components/GoalSetter";
import Loading from "@/components/StatusComponents/Loading";

// --- Hooks ---
import { useLiff } from "@/components/provider/LiffProvider";
import { useCheckOkMobileUser, useMainServerUser } from "../../../hooks/useUser";
import { useGetWelcomeProduct } from "../../../hooks/useProduct";
import { useCreateGoal } from "../../../hooks/useGoal";

// --- Types ---
interface GoalState {
  mobileId?: string;
  planId?: string;
}

// 1. Update UiStep to include 'error'
type UiStep = "input" | "main" | "final" | "error";

export default function Page() {
  const router = useRouter();

  // --- Hooks & Data ---
  const { liffProfile, liffDecodedIdToken, actions } = useLiff();

  const { data: okMobileUser } = useCheckOkMobileUser(liffProfile?.userId);
  const { data: mainServerUserProfile } = useMainServerUser(liffProfile?.userId);

  // Assuming useCreateGoal returns standard React Query object
  const { mutate: createGoalMutate, isPending: createGoalPending } = useCreateGoal();

  // --- Local State ---
  const [isUserChecked, setIsUserChecked] = useState<boolean>(false);
  const [goal, setGoal] = useState<GoalState>({});
  const [uiStep, setUiStep] = useState<UiStep>("input");

  const [userInputData, setUserInputData] = useState<UserInputData>({
    email: "",
    age: "",
    occupation: "",
    customOccupation: "",
    monthlyPayment: "",
    referToCode: "",
  });

  const [maxPrice, setMaxPrice] = useState<number | undefined>();

  const {
    data: productsData,
    isLoading: productDataLoading,
    error: productsDataError,
  } = useGetWelcomeProduct(maxPrice || 0);

  // --- Handlers ---

  const handleGoalUpdate = useCallback((newGoal: { mobileId: string; planId: string }) => {
    setGoal((prev) => ({
      ...prev,
      mobileId: newGoal.mobileId,
      planId: newGoal.planId,
    }));
  }, []);

  const handleInputComplete = useCallback((finalDataFromWizard: UserInputData) => {
    setUserInputData(finalDataFromWizard);
    const calculatedMaxPrice = Number(finalDataFromWizard.monthlyPayment) * 6;
    setMaxPrice(calculatedMaxPrice);
    setUiStep("main");
  }, []);

  const goBack = useCallback(() => {
    setTimeout(() => {
      setUiStep("input");
    }, 200);
  }, []);

  const handleRetry = () => {
    // Reset to main step to allow trying again
    setUiStep("main");
  };

  const handleContactSupport = async () => {
    // Logic to open support chat (e.g., LIFF openWindow or external link)
    await actions.text("ติดต่อเจ้าหน้าที่");
    actions.closeWindow();
  };

  // Create user with goal and server data
  const handleSetGoal = () => {
    console.log("Creating user with goal: ", goal);

    if (!goal.mobileId || !goal.planId) {
      toast.error("กรุณาเลือกเป้าหมายการออมให้ครบถ้วน");
      return;
    }

    const { userId: line_user_id, displayName: line_display_name, pictureUrl: line_profile_url } = liffProfile || {};

    const { mobileId, planId } = goal;

    const finalOccupation =
      userInputData.occupation === "อื่นๆ" ? userInputData.customOccupation : userInputData.occupation;

    const { fullname, phone, pin, chat_url } = mainServerUserProfile || {};

    const dataToPost = {
      line_user_id,
      line_display_name,
      line_profile_url,
      email: userInputData.email,
      mobileId,
      planId,
      fullname,
      phone,
      pin,
      chat_url,
      referToCode: userInputData.referToCode,
      occupation: finalOccupation,
      ageRange: userInputData.age,
      monthlyPayment: userInputData.monthlyPayment,
    };

    setUiStep("final");

    // 2. Updated Mutation logic with onError callback
    createGoalMutate(dataToPost, {
      onSuccess: () => {
        toast.success("บันทึกข้อมูลสำเร็จ!");
        // Redirect or handle success state here
      },
      onError: (error) => {
        console.error("Registration failed:", error);
        // Switch to the error view instead of just a toast
        setUiStep("error");
      },
    });
  };

  // --- Effects ---
  useEffect(() => {
    if (okMobileUser) {
      toast.success("ยินดีต้อนรับเข้าสู่บริการออมดาวน์!");
      setIsUserChecked(true);
    }
  }, [okMobileUser]);

  // --- Render ---
  if (createGoalPending || productDataLoading) {
    return <Loading />;
  }

  // Handle Initial Data Loading Error
  if (uiStep === "main" && productsDataError) {
    return (
      <main className="relative flex h-dvh w-full flex-col items-center justify-center bg-gradient-to-b from-[#1e1b4b] via-[#312e81] to-[#1e1b4b] text-white">
        <div className="flex flex-col items-center gap-6 p-6 text-center">
          {/* Icon with Red Glow Effect */}
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-red-500/20 blur-xl"></div>
            <AlertTriangle className="relative h-20 w-20 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
          </div>

          {/* Text Content */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">โหลดข้อมูลสินค้าไม่สำเร็จ</h2>
            <p className="text-sm text-gray-300">
              ระบบไม่สามารถดึงรายการสินค้าได้ในขณะนี้ <br />
              กรุณาลองใหม่อีกครั้ง หรือกลับไปแก้ไขข้อมูล
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={goBack}
            className="mt-4 flex items-center gap-2 rounded-full bg-white px-8 py-3 font-bold text-[#1e1b4b] shadow-lg transition-transform hover:bg-gray-100 active:scale-95"
          >
            <span>←</span> กลับไปหน้าแรก
          </button>
        </div>
      </main>
    );
  }

  // 3. The Error UI Component (Matches screenshot)
  if (uiStep === "error") {
    return (
      <main className="relative flex h-dvh w-full flex-col items-center justify-center bg-gradient-to-b from-[#1e1b4b] via-[#312e81] to-[#1e1b4b] text-white">
        {/* Main Error Content */}
        <div className="flex flex-col items-center gap-6 p-6 text-center">
          {/* Red Alert Icon with Glow */}
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-red-500/20 blur-xl"></div>
            <AlertTriangle className="relative h-24 w-24 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold">เกิดข้อผิดพลาด</h1>
            <p className="text-gray-300">ไม่สามารถโหลดข้อมูลได้ในขณะนี้ กรุณาติดต่อเจ้าหน้าที่</p>
          </div>

          <button
            onClick={handleRetry}
            className="mt-4 flex items-center gap-2 rounded-full bg-white px-8 py-3 font-bold text-[#1e1b4b] shadow-lg transition-transform active:scale-95"
          >
            <span className="text-xl">↻</span> ลองใหม่อีกครั้ง
          </button>
        </div>

        {/* Floating Contact Button (Bottom Right) */}
        <button
          onClick={handleContactSupport}
          className="absolute right-6 bottom-6 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-400 to-pink-500 shadow-xl transition-transform hover:scale-105 active:scale-95"
        >
          {/* If you have the specific image asset, use <img /> here. Otherwise, an icon: */}
          <MessageCircleQuestion className="h-8 w-8 text-white" />
        </button>
      </main>
    );
  }

  return (
    <main id="setup-page" className="flex min-h-dvh flex-col justify-center overflow-x-hidden">
      {/* STEP 1: User Input Wizard */}
      {uiStep === "input" && (
        <UserInputMonthly
          initialData={userInputData}
          onComplete={handleInputComplete}
          initialEmail={liffDecodedIdToken?.email}
        />
      )}

      {/* STEP 2: Goal Setter */}
      {uiStep === "main" && Array.isArray(productsData) && productsData.length > 0 && (
        <div className="flex flex-col bg-white">
          <header className="from-primary-pink to-primary-orange flex flex-col items-center justify-center gap-2 rounded-b-4xl bg-gradient-to-br p-6 pt-14 text-white drop-shadow-lg">
            <h1 className="text-2xl font-bold text-white drop-shadow-md drop-shadow-black/30">ตั้งค่าเป้าหมายการออม</h1>
            <p className="text-xs">เลือกสิ่งที่คุณอยากได้ แล้วมาเริ่มวางแผนการออมกัน!</p>
          </header>

          <GoalSetter products={productsData} onGoalChange={handleGoalUpdate} onBack={goBack} showBack={true} />

          <footer className="flex w-full items-center justify-center bg-white p-6 pb-12 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
            <CtaButton
              onClick={handleSetGoal}
              disabled={createGoalPending || !goal.mobileId || !goal.planId}
              className="z-10 w-48 rounded-xl p-4 text-lg font-bold"
            >
              {createGoalPending ? "กำลังบันทึก..." : "เริ่มต้นการออม"}
            </CtaButton>
          </footer>
        </div>
      )}

      {/* STEP 3: Final / Loading State */}
      {uiStep === "final" && <Loading message="กำลังประมวลผล..." />}
    </main>
  );
}
