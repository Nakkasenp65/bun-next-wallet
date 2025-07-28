"use client";

import CtaButton from "@/components/Ui/CtaButton";
import React, { useEffect, useState } from "react";
import SetupContent from "@/components/Ui/SetupContent";
import { useUser } from "@/hooks/useUser";
import { redirect } from "next/navigation";
import Loading from "@/components/Loading";
import ErrorComponent from "@/components/Ui/ErrorComponent";
import axios from "axios";

const SpinnerIcon = () => (
  <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export default function Page() {
  const [goal, setGoal] = useState({
    brand: "empty",
    price: 0,
    plan: null,
    mobileId: null,
    planId: null,
  });
  const [pageLoading, setPageLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: userData, isLoading, error, refetch } = useUser("U5d2998909721fdea596f8e9e91e7bf85");

  const handleSetGoal = async () => {
    if (!goal.mobileId || !goal.planId) {
      console.error("Goal data is incomplete.");
      return;
    }

    setIsSubmitting(true); // เริ่ม Loading

    try {
      const dataForBackend = {
        mobileId: goal.mobileId,
        planId: goal.planId,
      };

      const response = await axios.post("http://localhost:4000/v1/goal/liffIdd", dataForBackend);
      if (response.status !== 201) throw new Error("Error creating goal");

      console.log(response);

      await refetch();
    } catch (err) {
      console.error("Failed to set goal:", err);
    } finally {
      setIsSubmitting(false); // หยุด Loading เสมอ ไม่ว่าจะสำเร็จหรือพลาด
    }
  };

  // useEffect(() => {
  //   if (userData?.firstTime === false) redirect("/");
  //   else if (userData?.firstTime === true) setPageLoading(false);
  // }, [userData]);

  if (pageLoading || isLoading)
    return (
      <div className="bg-bg-dark flex h-dvh w-full items-center justify-center">
        <Loading />
      </div>
    );

  if (error) return <ErrorComponent />;

  return (
    <main id="setup-page" className="flex min-h-dvh flex-col bg-white">
      {/* HEADER */}
      <header className="from-primary-pink to-primary-orange flex flex-col items-center justify-center gap-2 rounded-b-4xl bg-gradient-to-br p-6 pt-14 text-white drop-shadow-lg">
        <h1 className="text-2xl font-bold text-white drop-shadow-md drop-shadow-black/30">ตั้งค่าเป้าหมายการออม</h1>
        <p className="text-xs">เลือกสิ่งที่คุณอยากได้ แล้วมาเริ่มวางแผนการออมกัน!</p>
      </header>

      {/* CHOICES */}
      <SetupContent goal={goal} setGoal={setGoal} isGoalSelected={goal.brand === "empty" ? false : true} />

      {/* CONFIRM BUTTON */}
      <footer className="drop-shadow-behind w-full bg-white p-6 pb-12">
        {/* 4. ปรับปรุงปุ่มให้แสดง Loading spinner และ disable ขณะ submitting */}
        <CtaButton onClick={handleSetGoal}>
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <SpinnerIcon />
              <span>กำลังบันทึก...</span>
            </div>
          ) : (
            "เริ่มต้นการออม"
          )}
        </CtaButton>
      </footer>
    </main>
  );
}
