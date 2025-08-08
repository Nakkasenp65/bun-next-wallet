"use client";

import CtaButton from "@/components/Ui/CtaButton";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { useLiff } from "@/components/provider/LiffProvider";
import toast from "react-hot-toast";
import { useCreateGoal, useMainServerUser } from "@/hooks/userUser";
import UserInputMonthly from "@/components/pages/UserInputMonthly";
import GoalSetter from "@/components/Ui/GoalSetter";
import MiniLoading from "@/components/StatusComponents/MiniLoading";

// GET https://checkuserdb.vercel.app/api/check-user/:liffID เช็คว่าเป็นสมาชิกหรือยัง
// 1. Check ว่าเป็นสมาชิกกับ database เดิมไหม
// 2. เป็นสมาชิกให้เลือก Goal ได้เลย
// 3. ไม่เป็นสมาชิกให้ redirect ไปสมัครที่ https://liff.line.me/2006703040-RYAyYAyA

export default function Page() {
  const { liffProfile } = useLiff();
  const { data: mainServerUserProfile } = useMainServerUser(
    liffProfile?.userId,
  );
  const router = useRouter();
  const [goal, setGoal] = useState({});
  const [uiStep, setUiStep] = useState("input");
  const [inputData, setInputData] = useState({
    age: "",
    occupation: "",
    monthlyPayment: "",
    customOccupation: "",
  });
  const [suggestedPhone, setSuggestedPhone] = useState(null);
  const { mutate: createGoalMutate, isPending: createGoalPending } =
    useCreateGoal();
  // ใช้เป็นค่าตรวจสอบ user จาก server หลัก
  const [isRegistered, setIsRegistered] = useState(false);

  const handleGoalUpdate = (newGoal) => {
    setGoal((prev) => ({
      ...prev,
      mobileId: newGoal.mobileId,
      planId: newGoal.planId,
    }));
  };

  const goBack = () => {
    setTimeout(() => {
      setUiStep("input");
    }, 200);
  };

  // สร้าง user ใหม่จากข้อมูล goal และ ข้อมูลบางส่วนจาก server หลัก
  const handleSetGoal = () => {
    if (!goal.mobileId || !goal.planId) {
      toast.error("กรุณาเลือกเป้าหมายการออมให้ครบถ้วน");
    }
    // ข้อมูลจากไลน์
    const {
      userId: line_user_id,
      displayName: line_display_name,
      pictureUrl: line_profile_url,
    } = liffProfile;
    // ข้อมูลจากหน้าเลือกโทรศัพท์
    const { mobileId, planId } = goal;
    // ข้อมูลจากหน้า userInputMonthLy (กรอกยอดเงินรายเดือน)
    const finalOccupation =
      inputData.occupation === "อื่นๆ"
        ? inputData.customOccupation
        : inputData.occupation;
    // ข้อมูลจาก server หลัก
    const { fullname, phone, pin, chat_url } = mainServerUserProfile;
    let notHavingData = {
      fullname: "test",
      phone: "test",
      pin: "test",
      chat_url: "test",
    };
    if (!fullname || !phone || !pin || !chat_url) {
      const dataToPost = {
        line_user_id,
        line_display_name,
        line_profile_url,
        mobileId,
        planId,
        fullname: notHavingData.fullname,
        phone: notHavingData.phone,
        pin: notHavingData.chat_url,
        chat_url: notHavingData.chat_url,
        occupation: finalOccupation,
        ageRange: inputData.age,
        monthlyPayment: inputData.monthlyPayment,
      };
      console.log("TEST PRODUCTION: NO MOBI INFO");
      createGoalMutate(dataToPost);
      return;
    }

    const dataToPost = {
      line_user_id,
      line_display_name,
      line_profile_url,
      mobileId,
      planId,
      fullname,
      phone,
      pin,
      chat_url,
      occupation: finalOccupation,
      ageRange: inputData.age,
      monthlyPayment: inputData.monthlyPayment,
    };

    // createGoalMutate = call mutation function -> useCreateGoal inside useUser.js
    createGoalMutate(dataToPost);
  };

  // ตรวจสอบการเป็นสมาชิกกับ server หลักว่าเป็นสมาชิกไหมและ redirect ไปสมัครสมาชิก
  const handleUserRedirect = async (lineUserId) => {
    // ตรวจสอบว่าเป็น user บน NUMBER 1 MOBI ไหม
    try {
      const response = await axios.get(
        `https://checkuserdb.vercel.app/api/check-user/${lineUserId} `,
      );
      // 404 คือไม่เป็นสมาชิก
      if (response) {
        toast.success("ยินดีต้อนรับสู่บริการออมดาวน์!");
        setIsRegistered(true); // สมัครสมาชิกกับ server หลักแล้ว
      }
    } catch (error) {
      if (error.status === 404)
        // router.replace("https://liff.line.me/2006703040-RYAyYAyA");
        toast.success("ยินดีต้อนรับสู่บริการออมดาวน์!");
      else if (error.status === 500)
        toast.error("ขออภัย ขณะเกิดข้อผิดพลาดระหว่างการดำเนินการ!");
    }
  };

  // คำนวณเงินดาวน์ของผู้ใช้ในเวลา 6 เดือน
  const handleCalculateClick = async () => {
    // คำนวณเงินดาวน์จากค่างวด
    const potentialPrice = inputData.monthlyPayment * 6;
    toast.loading("กำลังประมวลผล โปรดรอสักครู่");
    setUiStep("calculate");
    const { data } = await axios.get(`/product?maxPrice=${potentialPrice}`);
    if (!data) {
      toast.error("เกิดความผิดพลาดในการประมวลผล");
      setUiStep("input");
    }
    setSuggestedPhone(data);
  };

  useEffect(() => {
    // ให้เช็ค user
    if (!isRegistered) handleUserRedirect(liffProfile?.userId);
  }, [isRegistered]);

  useEffect(() => {
    if (uiStep === "calculate") {
      if (suggestedPhone) setUiStep("main");
    }
  }, [uiStep, suggestedPhone]);

  console.log(inputData);

  return (
    <main
      id="setup-page"
      className="gradient-bg flex min-h-dvh flex-col justify-center overflow-x-hidden"
    >
      {uiStep === "input" && (
        <UserInputMonthly
          isOpen={uiStep === "input" ? true : false}
          inputData={inputData}
          setInputData={setInputData}
          onCalculate={handleCalculateClick}
        />
      )}

      {uiStep === "calculate" && <MiniLoading message="กำลังประมวลผล..." />}
      {uiStep === "main" && suggestedPhone && (
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
            products={suggestedPhone}
            onGoalChange={handleGoalUpdate}
            onBack={goBack}
          />
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
