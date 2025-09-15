"use client";

import CtaButton from "@/components/Ui/CtaButton";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLiff } from "@/components/provider/LiffProvider";
import toast from "react-hot-toast";
import { useCheckOkMobileUser, useCreateGoal, useMainServerUser } from "@/hooks/useUser";
import UserInputMonthly from "./components/UserInputMonthly";
import GoalSetter from "./components/GoalSetter";
import Loading from "@/components/StatusComponents/Loading";
import { useGetProducts, useGetWelcomeProduct } from "../../../hooks/useProduct";

// GET https://checkuserdb.vercel.app/api/check-user/:liffID เช็คว่าเป็นสมาชิกหรือยัง
// 1. Check ว่าเป็นสมาชิกกับ database เดิมไหม
// 2. เป็นสมาชิกแล้วไปต่อ
// 3. ไม่เป็นสมาชิกให้ redirect ไปสมัครที่ https://liff.line.me/2006703040-RYAyYAyA

export default function Page() {
  const router = useRouter();
  const { liffProfile, liffDecodedIdToken } = useLiff();
  const [isUserChecked, setIsUserChecked] = useState(false);
  const [goal, setGoal] = useState({});
  const [uiStep, setUiStep] = useState("input");
  const [userInputData, setUserInputData] = useState({
    email: "",
    age: "",
    occupation: "",
    customOccupation: "",
    monthlyPayment: "",
    referToCode: "",
  });
  const [suggestedPhone, setSuggestedPhone] = useState(null);
  const { data: okMobileUser } = useCheckOkMobileUser(liffProfile?.userId);
  const { data: mainServerUserProfile, isError } = useMainServerUser(liffProfile?.userId);
  const { mutate: createGoalMutate, isPending: createGoalPending } = useCreateGoal();
  const [maxPrice, setMaxPrice] = useState();
  const {
    data: productsData,
    isLoading: productDataLoading,
    error: productsDataError,
  } = useGetWelcomeProduct(
    // ใช้ค่า all | upgrade | affordable เพื่อระบุเอาราคามากกว่า น้อยกว่า หรือ เอา product ทั้งหมด
    maxPrice,
  );

  const handleGoalUpdate = useCallback((newGoal) => {
    setGoal((prev) => ({
      ...prev,
      mobileId: newGoal.mobileId,
      planId: newGoal.planId,
    }));
  }, []);

  const handleInputComplete = useCallback((finalDataFromWizard) => {
    console.log("Wizard has completed its mission. Final data:", finalDataFromWizard);
    setUserInputData(finalDataFromWizard);
    setMaxPrice(Number(finalDataFromWizard.monthlyPayment) * 6); // ระบะเวลา 6 เดือน
    setUiStep("main"); // <-- สั่งให้การแสดงเปลี่ยนไป
  }, []);

  const goBack = useCallback(() => {
    setTimeout(() => {
      setUiStep("input");
    }, 200);
  }, []);

  // สร้าง user ใหม่จากข้อมูล goal และ ข้อมูลบางส่วนจาก server หลัก
  const handleSetGoal = () => {
    try {
      console.log("Creating user with goal: ", goal);
      if (!goal.mobileId || !goal.planId) {
        toast.error("กรุณาเลือกเป้าหมายการออมให้ครบถ้วน");
        setUiStep("main");
        return;
      }
      // ข้อมูลจากไลน์
      const {
        userId: line_user_id,
        displayName: line_display_name,
        pictureUrl: line_profile_url,
      } = liffProfile;
      // ข้อมูลจากหน้าเลือกโทรศัพท์
      const { mobileId, planId } = goal;
      // ข้อมูลจากหน้า userInputMonthly (กรอกยอดเงินรายเดือน)
      const finalOccupation =
        userInputData.occupation === "อื่นๆ"
          ? userInputData.customOccupation
          : userInputData.occupation;
      // ข้อมูลจาก server หลัก
      const { fullname, phone, pin, chat_url } = mainServerUserProfile;

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

      // createGoalMutate = call mutation function -> useCreateGoal inside useUser.js
      setUiStep("final");
      createGoalMutate(dataToPost);
    } catch (error) {
      setUiStep("main");
      console.log(error);
    }
  };

  useEffect(() => {
    // เช็ค user
    if (okMobileUser) {
      toast.success("ยินดีต้อนรับเข้าสู่บริการออมดาวน์!");
      setIsUserChecked(true);
    }
  }, [okMobileUser]);

  if (createGoalPending || productDataLoading) {
    return <Loading />;
  }

  return (
    <main id="setup-page" className="flex min-h-dvh flex-col justify-center overflow-x-hidden">
      {uiStep === "input" && (
        <UserInputMonthly
          isOpen={uiStep === "input" ? true : false}
          initialData={userInputData}
          onComplete={handleInputComplete}
          initialEmail={liffDecodedIdToken?.email}
        />
      )}

      {uiStep === "main" && Array.isArray(productsData) && productsData.length > 0 && (
        <div className="flex flex-col bg-white">
          {/* HEADER */}
          <header className="from-primary-pink to-primary-orange flex flex-col items-center justify-center gap-2 rounded-b-4xl bg-gradient-to-br p-6 pt-14 text-white drop-shadow-lg">
            <h1 className="text-2xl font-bold text-white drop-shadow-md drop-shadow-black/30">
              ตั้งค่าเป้าหมายการออม
            </h1>
            <p className="text-xs">เลือกสิ่งที่คุณอยากได้ แล้วมาเริ่มวางแผนการออมกัน!</p>
          </header>
          {/* GOAL SETTER */}
          <GoalSetter products={productsData} onGoalChange={handleGoalUpdate} onBack={goBack} />
          <footer className="flex w-full items-center justify-center bg-white p-6 pb-12 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
            {/* CONFIRM BUTTON */}
            <CtaButton
              onClick={handleSetGoal}
              disabled={createGoalPending || !goal.mobileId || !goal.planId}
              className={"z-10 w-48 rounded-xl p-4 text-lg font-bold"}
            >
              {createGoalPending ? "กำลังบันทึก..." : "เริ่มต้นการออม"}
            </CtaButton>
          </footer>
        </div>
      )}
      {uiStep === "final" && <Loading message="กำลังประมวลผล..." />}
    </main>
  );
}
