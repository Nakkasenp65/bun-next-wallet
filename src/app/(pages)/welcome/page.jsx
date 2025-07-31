"use client";

import CtaButton from "@/components/Ui/CtaButton";
import React, { useEffect, useState } from "react";
import SetupContent from "@/components/Ui/SetupContent";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useLiff } from "@/components/provider/LiffProvider";
import toast from "react-hot-toast";
import { useCreateGoal } from "@/hooks/useUser";
import UserInputMonthly from "@/components/pages/UserInputMonthly";
import Loading from "@/components/Loading";
import ProductTabs from "@/components/welcomeComponents/ProductTabs";
import GoalSetter from "@/components/Ui/GoalSetter";

// GET https://checkuserdb.vercel.app/api/check-user/:liffID เช็คว่าเป็นสมาชิกหรือยัง
// 1. Check ว่าเป็นสมาชิกกับ database เดิมไหม
// 2. เป็นสมาชิกให้เลือก Goal ได้เลย
// 3. ไม่เป็นสมาชิกให้ redirect ไปสมัครที่ https://liff.line.me/2006703040-RYAyYAyA

export default function Page() {
  // const { liffProfile } = useLiff();
  const [liffProfile, setLiffProfile] = useState({
    userId: "U5d2998909721fdea596f8e9e91e7bf85",
    displayName: "Long👁️‍🗨️",
    pictureUrl:
      "https://profile.line-scdn.net/0hPsTqIBJhD1x5CB7EtsVxYglYDDZaeVZOVjxHahgOUGhMPU9ZVDxIORwJAj5BOhxZAWxBakoIV21bTUB3DWgHYz9BU24mUxsKPhhEezdwJwJNQTdDFRZGXRB2BRAsbhxKUDFHXDVTUDIMbD5jU2oBcTpMFWpFQCxrN19jCnw6Yd8WCngJVG9EPUQAVmrA",
  });
  const router = useRouter();
  const [goal, setGoal] = useState({});
  const [uiStep, setUiStep] = useState("input");
  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [suggestedPhone, setSuggestedPhone] = useState(null);
  const { mutate: createGoalMutate, isPending: createGoalPending } = useCreateGoal();

  const handleGoalUpdate = (newGoal) => {
    setGoal((prev) => ({ ...prev, mobileId: newGoal.mobileId, planId: newGoal.planId }));
    console.log(goal);
  };

  const handleSetGoal = () => {
    console.log(goal);
    if (!goal.mobileId || !goal.planId) {
      toast.error("กรุณาเลือกเป้าหมายการออมให้ครบถ้วน");
    }
    const { userId: liffId, displayName, pictureUrl } = liffProfile;
    const { mobileId, planId } = goal;
    // console.log({ liffId, displayName, pictureUrl, mobileId, planId });
    createGoalMutate({ liffId, displayName, pictureUrl, mobileId, planId });
  };

  const handleUserRedirect = async (userId) => {
    try {
      // const response = await axios.get(`https://checkuserdb.vercel.app/api/check-user/${userId} `);
      // if (response) toast.success("ยินดีต้อนรับสู่บริการออมดาวน์!");
    } catch (error) {
      console.log("new user: ", error.status === 404);
      // router.replace("https://liff.line.me/2006703040-RYAyYAyA");
    }
  };

  const handleCalculateClick = async () => {
    if (!monthlyPayment || monthlyPayment < 500) {
      toast.error("กรุณาระบุจำนวนเงิน: ขั้นต่ำ 500 บาท");
      return;
    }

    const potentialPrice = monthlyPayment * 6;
    const phones = await axios.get(`http://localhost:4000/v1/product?maxPrice=${potentialPrice}`);
    const { data } = phones;
    console.log(data);
    setSuggestedPhone(data);
    console.log("Converted: ", suggestedPhone);
    setUiStep("calculate");
  };

  console.log("GOAL FROM WELCOME PAGE: ", goal);

  useEffect(() => {
    handleUserRedirect(liffProfile?.userId);
  }, [liffProfile]);

  useEffect(() => {
    if (uiStep === "calculate") setTimeout(() => setUiStep("main"), 4000);
  }, [uiStep]);

  console.log(goal);

  return (
    <main id="setup-page" className="flex min-h-dvh flex-col overflow-x-hidden bg-white">
      {uiStep === "input" && (
        <UserInputMonthly
          isOpen={uiStep === "input" ? true : false}
          monthlyPayment={monthlyPayment}
          setMonthlyPayment={setMonthlyPayment}
          onCalculate={handleCalculateClick}
        />
      )}

      {uiStep === "calculate" && <Loading message={"กำลังประมวลผล..."} />}
      {uiStep === "main" && suggestedPhone && (
        <div className="flex flex-col gap-4">
          <header className="from-primary-pink to-primary-orange flex flex-col items-center justify-center gap-2 rounded-b-4xl bg-gradient-to-br p-6 pt-14 text-white drop-shadow-lg">
            <h1 className="text-2xl font-bold text-white drop-shadow-md drop-shadow-black/30">
              ตั้งค่าเป้าหมายการออม
            </h1>
            <p className="text-xs">เลือกสิ่งที่คุณอยากได้ แล้วมาเริ่มวางแผนการออมกัน!</p>
          </header>

          {/* <SetupContent goal={goal} setGoal={setGoal} /> */}
          {/* <ProductTabs products={suggestedPhone} /> */}
          <GoalSetter products={suggestedPhone} onGoalChange={handleGoalUpdate} />

          <footer className="flex w-full items-center justify-center bg-white p-6 pb-12 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
            <CtaButton
              onClick={handleSetGoal}
              disabled={createGoalPending}
              className={"z-10 w-48 rounded-xl p-4 text-lg font-bold"}
            >
              {createGoalPending ? "กำลังบันทึก..." : "เริ่มต้นการออม"}
            </CtaButton>
          </footer>
        </div>
      )}
    </main>
  );
}
