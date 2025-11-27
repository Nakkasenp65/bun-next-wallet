"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// --- Components ---
import CtaButton from "@/components/ui/CtaButton";
// Import the component AND the Interface from the component file
import UserInputMonthly, { UserInputData } from "./components/UserInputMonthly";
import GoalSetter from "./components/GoalSetter";
import Loading from "@/components/StatusComponents/Loading";

// --- Hooks ---
import { useLiff } from "@/components/provider/LiffProvider";
import {
  // Assuming CreateGoalPayload is defined in your hook file
  // CreateGoalPayload,
  useCheckOkMobileUser,
  useCreateGoal,
  useMainServerUser,
} from "../../../hooks/useUser";
import { useGetWelcomeProduct } from "../../../hooks/useProduct";

// --- Types ---
// The shape of the Goal state
interface GoalState {
  mobileId?: string;
  planId?: string;
}

// UI Steps enum
type UiStep = "input" | "main" | "final";

export default function Page() {
  const router = useRouter();

  // --- Hooks & Data ---
  const { liffProfile, liffDecodedIdToken } = useLiff();

  const { data: okMobileUser } = useCheckOkMobileUser(liffProfile?.userId);
  const { data: mainServerUserProfile } = useMainServerUser(
    liffProfile?.userId,
  );
  const { mutate: createGoalMutate, isPending: createGoalPending } =
    useCreateGoal();

  // --- Local State ---
  const [isUserChecked, setIsUserChecked] = useState<boolean>(false);
  const [goal, setGoal] = useState<GoalState>({});
  const [uiStep, setUiStep] = useState<UiStep>("input");

  // Initialize with the interface imported from UserInputMonthly
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

  const handleGoalUpdate = useCallback(
    (newGoal: { mobileId: string; planId: string }) => {
      setGoal((prev) => ({
        ...prev,
        mobileId: newGoal.mobileId,
        planId: newGoal.planId,
      }));
    },
    [],
  );

  const handleInputComplete = useCallback(
    (finalDataFromWizard: UserInputData) => {
      console.log(
        "Wizard has completed its mission. Final data:",
        finalDataFromWizard,
      );
      setUserInputData(finalDataFromWizard);

      // Calculate max price: Monthly Payment * 6 Months
      const calculatedMaxPrice = Number(finalDataFromWizard.monthlyPayment) * 6;
      setMaxPrice(calculatedMaxPrice);

      setUiStep("main");
    },
    [],
  );

  const goBack = useCallback(() => {
    setTimeout(() => {
      setUiStep("input");
    }, 200);
  }, []);

  // Create user with goal and server data
  const handleSetGoal = () => {
    try {
      console.log("Creating user with goal: ", goal);

      if (!goal.mobileId || !goal.planId) {
        toast.error("กรุณาเลือกเป้าหมายการออมให้ครบถ้วน");
        setUiStep("main");
        return;
      }

      const {
        userId: line_user_id,
        displayName: line_display_name,
        pictureUrl: line_profile_url,
      } = liffProfile || {};

      const { mobileId, planId } = goal;

      const finalOccupation =
        userInputData.occupation === "อื่นๆ"
          ? userInputData.customOccupation
          : userInputData.occupation;

      const { fullname, phone, pin, chat_url } = mainServerUserProfile || {};

      // Ensure dataToPost matches the payload expected by useCreateGoal
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
      createGoalMutate(dataToPost);
    } catch (error) {
      setUiStep("main");
      console.error(error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    }
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

  if (uiStep === "main" && productsDataError) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center">
        <p className="text-red-500">เกิดข้อผิดพลาดในการโหลดข้อมูลสินค้า</p>
        <button onClick={goBack} className="mt-4 text-blue-500 underline">
          กลับไปหน้าแรก
        </button>
      </div>
    );
  }

  return (
    <main
      id="setup-page"
      className="flex min-h-dvh flex-col justify-center overflow-x-hidden"
    >
      {/* STEP 1: User Input Wizard */}
      {uiStep === "input" && (
        <UserInputMonthly
          initialData={userInputData}
          onComplete={handleInputComplete}
          initialEmail={liffDecodedIdToken?.email}
        />
      )}

      {/* STEP 2: Goal Setter */}
      {uiStep === "main" &&
        Array.isArray(productsData) &&
        productsData.length > 0 && (
          <div className="flex flex-col bg-white">
            <header className="from-primary-pink to-primary-orange flex flex-col items-center justify-center gap-2 rounded-b-4xl bg-gradient-to-br p-6 pt-14 text-white drop-shadow-lg">
              <h1 className="text-2xl font-bold text-white drop-shadow-md drop-shadow-black/30">
                ตั้งค่าเป้าหมายการออม
              </h1>
              <p className="text-xs">
                เลือกสิ่งที่คุณอยากได้ แล้วมาเริ่มวางแผนการออมกัน!
              </p>
            </header>

            <GoalSetter
              products={productsData}
              onGoalChange={handleGoalUpdate}
              onBack={goBack}
              showBack={true}
            />

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
