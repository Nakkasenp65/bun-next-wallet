"use client";

import CtaButton from "@/components/Ui/CtaButton";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { useLiff } from "@/components/provider/LiffProvider";
import toast from "react-hot-toast";
import { useCreateGoal, useMainServerUser } from "@/hooks/useUser";
import UserInputMonthly from "@/components/pages/UserInputMonthly";
import GoalSetter from "@/components/Ui/GoalSetter";
import Loading from "@/components/StatusComponents/Loading";

// GET https://checkuserdb.vercel.app/api/check-user/:liffID เช็คว่าเป็นสมาชิกหรือยัง
// 1. Check ว่าเป็นสมาชิกกับ database เดิมไหม
// 2. เป็นสมาชิกแล้วไปต่อ
// 3. ไม่เป็นสมาชิกให้ redirect ไปสมัครที่ https://liff.line.me/2006703040-RYAyYAyA

export default function Page() {
  const router = useRouter();
  const { liffProfile } = useLiff();
  // const { data: mainServerUserProfile, isError } = useMainServerUser(
  //   liffProfile?.userId,
  // );
  const [isUserChecked, setIsUserChecked] = useState(false);
  const [goal, setGoal] = useState({});
  const [uiStep, setUiStep] = useState("input");
  const [inputData, setInputData] = useState({
    age: "",
    occupation: "",
    monthlyPayment: "",
    customOccupation: "",
    referToCode: "",
  });
  const [suggestedPhone, setSuggestedPhone] = useState(null);

  const { mutate: createGoalMutate, isPending: createGoalPending } =
    useCreateGoal();
  const [isRegistered, setIsRegistered] = useState(false);
  // Query สำหรับดึง Products
  const [productQuery, setProductQuery] = useState({
    mode: "affordable", // ใช้ค่า all | upgrade | affordable เพื่อระบุเอาราคามากกว่า น้อยกว่า หรือ เอา product ทั้งหมด
    minPrice: null,
    maxPrice: null,
    topPerBrand: false, // เอามาแค่ 1 เครื่อง?
    sort: "desc",
    take: 400,
    skip: 0,
  });

  // FIXED: Memoize the goal update handler to prevent infinite re-renders
  const handleGoalUpdate = useCallback((newGoal) => {
    setGoal((prev) => ({
      ...prev,
      mobileId: newGoal.mobileId,
      planId: newGoal.planId,
    }));
  }, []);

  // FIXED: Memoize the goBack handler
  const goBack = useCallback(() => {
    setTimeout(() => {
      setUiStep("input");
    }, 200);
  }, []);

  // สร้าง user ใหม่จากข้อมูล goal และ ข้อมูลบางส่วนจาก server หลัก
  const handleSetGoal = useCallback(() => {
    try {
      setUiStep("final");
      if (!goal.mobileId || !goal.planId) {
        toast.error("กรุณาเลือกเป้าหมายการออมให้ครบถ้วน");
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
        inputData.occupation === "อื่นๆ"
          ? inputData.customOccupation
          : inputData.occupation;
      // ข้อมูลจาก server หลัก
      // const { fullname, phone, pin, chat_url } = mainServerUserProfile;

      // Test purpose ไม่เช็ค mobi เพราะไม่มีสมาชิก
      let notHavingData = {
        fullname: "test",
        phone: "test",
        pin: "123456",
        chat_url: "test",
      };

      // Test no mobi user data
      const dataToPost = {
        line_user_id,
        line_display_name,
        line_profile_url,
        occupation: finalOccupation,
        ageRange: inputData.age,
        monthlyPayment: inputData.monthlyPayment,
        fullname: notHavingData.fullname,
        chat_url: notHavingData.chat_url,
        pin: notHavingData.pin,
        phone: notHavingData.phone,
        referToCode: inputData.referToCode,
        planId,
        mobileId,
        isLocked: false,
      };
      // console.log("TEST PRODUCTION: NO MOBI INFO");
      // createGoalMutate(dataToPost);
      // return;

      // const dataToPost = {
      //   line_user_id,
      //   line_display_name,
      //   line_profile_url,
      //   mobileId,
      //   planId,
      //   fullname,
      //   phone,
      //   pin,
      //   chat_url,
      //   referToCode: inputData.referToCode,
      //   occupation: finalOccupation,
      //   ageRange: inputData.age,
      //   monthlyPayment: inputData.monthlyPayment,
      // };

      // createGoalMutate = call mutation function -> useCreateGoal inside useUser.js
      createGoalMutate(dataToPost);
    } catch (error) {
      setUiStep("main");
      console.log(error);
    }
  }, [
    goal.mobileId,
    goal.planId,
    liffProfile,
    inputData,
    // mainServerUserProfile,
    createGoalMutate,
  ]);

  // ตรวจสอบการเป็นสมาชิกกับ server หลักว่าเป็นสมาชิกไหมและ redirect ไปสมัครสมาชิก
  const handleUserRedirect = useCallback(
    async (lineUserId) => {
      // ตรวจสอบว่าเป็น user บน NUMBER 1 MOBI ไหม
      try {
        const response = await axios.get(
          `https://checkuserdb.vercel.app/api/check-user/${lineUserId} `,
        );

        console.log(response);
        // 404 คือไม่เป็นสมาชิก
        if (response) {
          setIsUserChecked(true);
          toast.success("ยินดีต้อนรับสู่บริการออมดาวน์!");
          setIsRegistered(true); // สมัครสมาชิกกับ server หลักแล้ว
        }
      } catch (error) {
        if (error.status === 404) {
          // Not found from api : (not registered user)
          // router.replace("https://liff.line.me/2006703040-RYAyYAyA");
          toast.success("ยินดีต้อนรับสู่บริการออมดาวน์!");
          setIsUserChecked(true);
          setIsRegistered(true);
        } else if (error.status === 500)
          toast.error("ขออภัย ขณะเกิดข้อผิดพลาดระหว่างการดำเนินการ!");
      }
    },
    [router],
  );

  // คำนวณเงินดาวน์ของผู้ใช้ในเวลา 6 เดือน
  // Fetch products using the new service shape: { items, total, facets }
  const handleCalculateClick = useCallback(async () => {
    const monthly = Number(inputData.monthlyPayment);
    if (!monthly || monthly <= 0) {
      return toast.error("กรุณากรอกยอดออมรายเดือนให้ถูกต้อง");
    }
    // 6 months saving capacity
    const potentialPrice = monthly * 6;
    const toastId = toast.loading("กำลังประมวลผล โปรดรอสักครู่…");
    setUiStep("calculate");

    try {
      // If your controller path is `/products`, change the URL here accordingly.
      fetchProducts(potentialPrice);
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาดในการประมวลผล");
      setUiStep("input");
    } finally {
      toast.dismiss(toastId);
    }
  }, [inputData.monthlyPayment]);

  const fetchProducts = useCallback(
    async (balance) => {
      try {
        setUiStep("calculate");

        let { mode, minPrice, maxPrice, topPerBrand, take, skip, sort } =
          productQuery;

        // Derive min/max by mode (upgrade shows pricier targets than current balance)
        if (mode === "affordable") {
          minPrice = null;
          maxPrice = balance;
        } else if (mode === "upgrade") {
          minPrice = balance;
          maxPrice = null;
        } else {
          // mode === all
          minPrice = null;
          maxPrice = null;
        }

        const { data } = await axios.get("/product", {
          params: {
            mode,
            minPrice,
            maxPrice,
            topPerBrand,
            take,
            skip,
            sort,
          },
        });

        const items = Array.isArray(data?.items) ? data.items : [];
        setSuggestedPhone(items);

        if (!items.length) {
          toast("ยังไม่พบสินค้าที่ตรงเงื่อนไข ลองเปลี่ยนโหมดหรือช่วงราคา");
          setUiStep("input");
        } else {
          toast.success("คัดสินค้าที่เหมาะสมให้แล้ว ✨");
          setUiStep("main");
        }
      } catch (err) {
        console.error(err);
        toast.error("เกิดข้อผิดพลาดในการค้นหาสินค้า");
        setUiStep("input");
      }
    },
    [productQuery],
  );

  useEffect(() => {
    // ให้เช็ค user
    if (!isRegistered && liffProfile?.userId) {
      handleUserRedirect(liffProfile.userId);
    }
  }, [isRegistered, liffProfile?.userId, handleUserRedirect]);

  useEffect(() => {
    if (uiStep === "calculate") {
      if (suggestedPhone) setUiStep("main");
    }
  }, [uiStep, suggestedPhone]);

  if (createGoalPending || !isUserChecked) {
    return <Loading />;
  }

  return (
    <main
      id="setup-page"
      className="flex min-h-dvh flex-col justify-center overflow-x-hidden"
    >
      {uiStep === "input" && (
        <UserInputMonthly
          isOpen={uiStep === "input" ? true : false}
          inputData={inputData}
          setInputData={setInputData}
          onCalculate={handleCalculateClick}
        />
      )}

      {uiStep === "calculate" && <Loading message="กำลังประมวลผล..." />}
      {uiStep === "main" &&
        Array.isArray(suggestedPhone) &&
        suggestedPhone.length > 0 && (
          <div className="flex flex-col bg-white">
            {/* HEADER */}
            <header className="from-primary-pink to-primary-orange flex flex-col items-center justify-center gap-2 rounded-b-4xl bg-gradient-to-br p-6 pt-14 text-white drop-shadow-lg">
              <h1 className="text-2xl font-bold text-white drop-shadow-md drop-shadow-black/30">
                ตั้งค่าเป้าหมายการออม
              </h1>
              <p className="text-xs">
                เลือกสิ่งที่คุณอยากได้ แล้วมาเริ่มวางแผนการออมกัน!
              </p>
            </header>
            {/* GOAL SETTER */}
            <GoalSetter
              products={suggestedPhone}
              onGoalChange={handleGoalUpdate}
              onBack={goBack}
            />
            <footer className="flex w-full items-center justify-center bg-white p-6 pb-12 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
              {/* CONFIRM BUTTON */}
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
      {uiStep === "final" && <Loading message="กำลังประมวลผล..." />}
    </main>
  );
}
