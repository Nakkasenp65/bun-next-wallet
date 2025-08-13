"use client";

import { AnimatePresence, motion } from "framer-motion";
import CtaButton from "../Ui/CtaButton";
import { useState } from "react";
import ProgressIndicator from "../Ui/ProgressIndicator";
import DropDownComponent from "../Ui/DropDownComponent";

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

// ไม่จำเป็นต้องรับ userData แล้ว เพราะเราแค่เก็บค่า referToCode ไว้ใน state
export default function UserInputMonthly({
  inputData,
  setInputData,
  onCalculate,
}) {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [waitFetch, setWaitFetch] = useState(false);

  // 1. ฟังก์ชัน handleChange เดิมสามารถจัดการ input ของ referral ได้เลย
  const handleChange = (e) => {
    let { name, value } = e.target;
    // ทำให้โค้ดเป็นตัวพิมพ์ใหญ่เสมอ
    if (name === "referToCode") {
      value = value.toUpperCase();
    }
    setInputData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDropDownChange = (key, value) => {
    setInputData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 2. ปรับปรุงหน้า referral ให้เป็นแค่ input ธรรมดา
  const pages = [
    {
      field: "age",
      label: "กรุณาระบุช่วงอายุของคุณ",
      type: "dropdown",
      placeholder: "เลือกช่วงอายุ",
      options: ["15-20", "21-30", "31-40", "41-50", "51-60"],
    },
    {
      field: "occupation",
      label: "ปัจจุบันกำลังประกอบอาชีพ",
      type: "dropdown",
      placeholder: "เลือกอาชีพ",
      options: [
        "นักศึกษา",
        "ข้าราชการ / เจ้าหน้าที่รัฐ",
        "พนักงานบริษัท",
        "ธุรกิจส่วนตัว / ค้าขาย",
        "ฟรีแลนซ์",
        "แพทย์ / พยาบาล",
        "สถาปนิก / วิศวกร",
        "นักการตลาด / PR",
        "ศิลปิน / นักออกแบบ",
        "เกษตรกร",
        "อื่นๆ",
      ],
    },
    {
      field: "monthlyPayment",
      label: "จำนวนยอดจ่ายรายเดือน",
      placeholder: "ขั้นต่ำ 500 บาท",
      type: "number",
      inputMode: "numeric",
    },
    {
      field: "referToCode", // เปลี่ยน field ให้ตรงกับ key ใน state
      label: "โค้ดแนะนำเพื่อน (ถ้ามี)",
      type: "referral", // ใช้ type นี้เพื่อแสดงผล input พิเศษ
      placeholder: "เช่น ABC123",
    },
  ];

  const currentPageData = pages[page];

  const isStepValid = (() => {
    // 3. Logic การตรวจสอบยังคงเหมือนเดิม หน้านี้ไม่บังคับกรอก
    if (currentPageData.type === "referral") {
      return true;
    }

    const standardCheck =
      inputData[currentPageData.field] &&
      inputData[currentPageData.field].trim() !== "";
    if (
      currentPageData.field === "occupation" &&
      inputData.occupation === "อื่นๆ"
    ) {
      return inputData.customOccupation?.trim() !== "";
    }
    if (currentPageData.field === "monthlyPayment") {
      return standardCheck && Number(inputData.monthlyPayment) >= 500;
    }
    return standardCheck;
  })();

  const handleNext = () => {
    if (!isStepValid) return;
    setDirection(1);
    setPage((p) => p + 1);
  };

  const handleBack = () => {
    setDirection(-1);
    setPage((p) => p - 1);
  };

  const handleSubmit = () => {
    if (!isStepValid) return;
    setWaitFetch(true);
    // ตอนนี้ onCalculate จะได้รับ inputData ที่มี referToCode อยู่ข้างในแล้ว
    onCalculate();
  };

  const isFinalStep = page === pages.length - 1;

  const buttonWord = () => {
    if (isFinalStep) {
      if (waitFetch) {
        return "กำลังส่ง...";
      } else {
        return "คำนวณ";
      }
    } else {
      return "ต่อไป";
    }
  };

  return (
    <div className="gradient-background relative flex h-dvh flex-col items-center justify-center p-6">
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-sm rounded-2xl bg-white shadow-2xl backdrop-blur-lg"
      >
        <div className="relative p-6 py-10">
          <ProgressIndicator totalSteps={pages.length} currentStep={page} />
          <div className="relative h-32">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={page}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute flex w-full flex-col gap-2"
              >
                {/* 4. เปลี่ยนจากการเรียก <ReferralForm> มาเป็น input field ธรรมดา */}
                {currentPageData.type === "referral" ? (
                  <>
                    <label
                      htmlFor={currentPageData.field}
                      className="text-bg-dark font-medium"
                    >
                      {currentPageData.label}
                    </label>
                    <input
                      id={currentPageData.field}
                      name={currentPageData.field} // สำคัญมาก: ต้องตรงกับ key ใน state
                      type="text"
                      placeholder={currentPageData.placeholder}
                      value={inputData[currentPageData.field] || ""} // ทำให้เป็น Controlled Component
                      onChange={handleChange} // ใช้ handleChange เดิมได้เลย
                      autoCapitalize="characters"
                      spellCheck={false}
                      className="text-bg-dark focus:border-primary-pink w-full rounded-xl border-2 border-gray-200 p-4 font-bold shadow-sm transition-all focus:ring-4 focus:ring-pink-200 focus:outline-none"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      ระบบจะนำโค้ดไปตรวจสอบในขั้นตอนถัดไป
                    </p>
                  </>
                ) : currentPageData.type === "dropdown" ? (
                  <>
                    <DropDownComponent
                      label={currentPageData.label}
                      labelClassName="text-bg-dark font-medium"
                      name={currentPageData.field}
                      value={inputData[currentPageData.field]}
                      onChange={(value) =>
                        handleDropDownChange(currentPageData.field, value)
                      }
                      options={currentPageData.options}
                      placeholder={currentPageData.placeholder}
                      buttonClassName="text-bg-dark focus:border-primary-pink w-full rounded-xl border-2 border-gray-200 bg-white p-4 font-bold shadow-sm transition-all focus:ring-4 focus:ring-pink-200 focus:outline-none"
                      optionsContainerClassName="p-2 border border-gray-200"
                      optionClassName="rounded-lg p-3 hover:bg-gray-100"
                    />
                    {currentPageData.field === "occupation" &&
                      inputData.occupation === "อื่นๆ" && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="mt-2"
                        >
                          <input
                            name="customOccupation"
                            type="text"
                            placeholder="กรุณาระบุอาชีพของคุณ"
                            value={inputData.customOccupation || ""}
                            onChange={handleChange}
                            className="text-bg-dark focus:border-primary-pink w-full rounded-xl border-2 border-gray-200 p-4 font-bold shadow-sm transition-all focus:ring-4 focus:ring-pink-200 focus:outline-none"
                            autoFocus
                          />
                        </motion.div>
                      )}
                  </>
                ) : (
                  <>
                    <label
                      htmlFor={currentPageData.field}
                      className="text-bg-dark font-medium"
                    >
                      {currentPageData.label}
                    </label>
                    <input
                      id={currentPageData.field}
                      name={currentPageData.field}
                      type={currentPageData.type}
                      placeholder={currentPageData.placeholder}
                      value={inputData[currentPageData.field]}
                      onChange={handleChange}
                      inputMode={currentPageData.inputMode}
                      className="text-bg-dark focus:border-primary-pink w-full rounded-xl border-2 border-gray-200 p-4 font-bold shadow-sm transition-all focus:ring-4 focus:ring-pink-200 focus:outline-none"
                    />
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex w-full justify-between rounded-b-2xl border-t border-gray-200 bg-gray-50/50 px-6 py-4">
          {page > 0 ? (
            <CtaButton
              onClick={handleBack}
              className="w-24 rounded-xl bg-gray-200 py-3 text-sm text-gray-700 drop-shadow-md drop-shadow-black/25"
            >
              ย้อนกลับ
            </CtaButton>
          ) : (
            <div />
          )}
          <CtaButton
            onClick={isFinalStep ? handleSubmit : handleNext}
            disabled={!isStepValid || waitFetch}
            className="w-24 rounded-xl py-3 text-sm drop-shadow-md drop-shadow-black/25"
          >
            {buttonWord()}
          </CtaButton>
        </div>
      </motion.div>
    </div>
  );
}
