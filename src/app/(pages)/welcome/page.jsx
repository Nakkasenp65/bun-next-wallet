"use client";

import CtaButton from "@/components/Ui/CtaButton";
import React, { use, useEffect, useState } from "react";
import SetupContent from "@/components/Ui/SetupContent";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useLiff } from "@/components/provider/LiffProvider";
import toast from "react-hot-toast";
import { useCreateGoal } from "@/hooks/useUser";
import UserInputMonthly from "@/components/pages/UserInputMonthly";
import Loading from "@/components/StatusComponents/Loading";
import ProductTabs from "@/components/welcomeComponents/ProductTabs";
import GoalSetter from "@/components/Ui/GoalSetter";

// GET https://checkuserdb.vercel.app/api/check-user/:liffID เช็คว่าเป็นสมาชิกหรือยัง
// 1. Check ว่าเป็นสมาชิกกับ database เดิมไหม
// 2. เป็นสมาชิกให้เลือก Goal ได้เลย
// 3. ไม่เป็นสมาชิกให้ redirect ไปสมัครที่ https://liff.line.me/2006703040-RYAyYAyA

export default function Page() {
  // const { liffProfile } = useLiff();
  const liffProfile = {
    userId: "U5d2998909721fdea596f8e9e91e7bf85",
    displayName: "Long👁️‍🗨️",
    pictureUrl:
      "https://profile.line-scdn.net/0hPsTqIBJhD1x5CB7EtsVxYglYDDZaeVZOVjxHahgOUGhMPU9ZVDxIORwJAj5BOhxZAWxBakoIV21bTUB3DWgHYz9BU24mUxsKPhhEezdwJwJNQTdDFRZGXRB2BRAsbhxKUDFHXDVTUDIMbD5jU2oBcTpMFWpFQCxrN19jCnw6Yd8WCngJVG9EPUQAVmrA",
  };
  const router = useRouter();
  const [goal, setGoal] = useState({});
  const [uiStep, setUiStep] = useState("input");
  const [inputData, setInputData] = useState({
    age: "",
    occupation: "",
    monthlyPayment: "",
    customOccupation: "",
  });
  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [suggestedPhone, setSuggestedPhone] = useState(null);
  const { mutate: createGoalMutate, isPending: createGoalPending } = useCreateGoal();

  const handleGoalUpdate = (newGoal) => {
    setGoal((prev) => ({ ...prev, mobileId: newGoal.mobileId, planId: newGoal.planId }));
  };

  const goBack = () => {
    setTimeout(() => {
      setUiStep("input");
    }, 200);
  };

  const handleSetGoal = () => {
    if (!goal.mobileId || !goal.planId) {
      toast.error("กรุณาเลือกเป้าหมายการออมให้ครบถ้วน");
    }
    const { userId: liffId, displayName, pictureUrl } = liffProfile;
    const { mobileId, planId } = goal;

    const finalOccupation =
      inputData.occupation === "อื่นๆ" ? inputData.customOccupation : inputData.occupation;

    const dataToPost = {
      liffId,
      displayName,
      pictureUrl,
      mobileId,
      planId,
      occupation: finalOccupation,
      ageRange: inputData.age,
      monthlyPayment: inputData.monthlyPayment,
    };

    // const {occupation, age-range} = inputData
    // createGoalMutate = call mutation function -> useCreateGoal inside useUser.js
    createGoalMutate(dataToPost);
  };

  const handleUserRedirect = async (userId) => {
    // ตรวจสอบว่าเป็น user บน NUMBER 1 MOBI ไหม
    try {
      // const response = await axios.get(`https://checkuserdb.vercel.app/api/check-user/${userId} `);
      // ตอบมา = เป็น ไม่ตอบหรือ 404 คือไม่เป็นสมาชิก หรือ server offline
      // if (response) toast.success("ยินดีต้อนรับสู่บริการออมดาวน์!");
    } catch (error) {
      console.log("new user: ", error.status === 404);
      console.log("new user: ", error.status === 500);

      // if (error.status === 404) router.replace("https://liff.line.me/2006703040-RYAyYAyA");
      // else if (error.status === 500) toast.error("ขออภัย ขณะเกิดข้อผิดพลาดระหว่างการดำเนินการ!");
    }
  };

  const handleCalculateClick = async () => {
    // use in UserInputMonthly.jsx get product list based on user downPayment capability
    const potentialPrice = inputData.monthlyPayment * 6;
    toast.loading("กำลังประมวลผล โปรดรอสักครู่");
    setUiStep("calculate");
    const phones = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/product?maxPrice=${potentialPrice}`,
    );
    if (!phones) {
      toast.error("เกิดความผิดพลาดในการประมวลผล");
      setUiStep("input");
    }
    const { data } = phones;
    setSuggestedPhone(data);
  };

  useEffect(() => {
    // ถ้า LiffProfile มีการเปลี่ยนแปลง(line ตอบกลับมา login liffInit()) ให้เช็ค user
    handleUserRedirect(liffProfile?.userId);
  }, [liffProfile]);

  useEffect(() => {
    if (uiStep === "calculate") setTimeout(() => setUiStep("main"), 4000);
  }, [uiStep]);

  console.log("LINE 99 INPUTDATA:", inputData);

  return (
    <main id="setup-page" className="flex min-h-dvh flex-col overflow-x-hidden bg-white">
      {uiStep === "input" && (
        <UserInputMonthly
          isOpen={uiStep === "input" ? true : false}
          inputData={inputData}
          setInputData={setInputData}
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
          <GoalSetter products={suggestedPhone} onGoalChange={handleGoalUpdate} onBack={goBack} />

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
