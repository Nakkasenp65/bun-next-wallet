"use client";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import CtaButton from "../Ui/CtaButton";
import FramerDiv from "../framerComponents/FramerDiv";
import GoalSetter from "../Ui/GoalSetter";
import Loading from "../StatusComponents/Loading";
import UserInputMonthly from "../pages/UserInputMonthly"; // 1. Import UserInputMonthly
import { useUpdateGoal } from "@/hooks/useUser"; // 2. Import the correct hook
import axios from "@/lib/axios";
import toast from "react-hot-toast";

export default function ChangeGoalPage({ isEditing, setIsEditing, userData }) {
  const [uiStep, setUiStep] = useState("input"); // 'input', 'calculate', 'main', 'final'
  const [newGoal, setNewGoal] = useState({});
  const [suggestedPhone, setSuggestedPhone] = useState(null);
  const [inputData, setInputData] = useState({
    // Initialize with the user's current monthly payment for a better UX
    monthlyPayment: userData?.monthlyPayment || "",
    // These fields are not needed for changing goals but are part of the component
    age: userData?.ageRange || "",
    occupation: userData?.occupation || "",
    customOccupation: "",
  });

  console.log("GOAL EDIT", newGoal);

  const { mutate: updateGoal, isPending: isUpdatingGoal } = useUpdateGoal();

  const closePage = () => {
    setIsEditing(false);
    // Reset state after the exit animation
    setTimeout(() => {
      setUiStep("input");
      setNewGoal({});
      setSuggestedPhone(null);
    }, 300);
  };

  // Handler for UserInputMonthly to calculate suggestions
  const handlePhoneFetch = async () => {
    try {
      const { data } = await axios.get(
        `/product?maxPrice=${userData.monthlyPayment}`,
      );
      setSuggestedPhone(data);
      console.log("Fetched Successfully : ", data);
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการค้นหาโทรศัพท์");
      setUiStep("main");
    }
  };

  // Effect to move from 'calculate' to 'main' step
  useEffect(() => {
    handlePhoneFetch();
  }, [isEditing]);

  // Handler to receive updates from GoalSetter
  const handleGoalUpdate = (goal) => {
    setNewGoal(goal);
  };

  // Handler for the final save button
  const handleSaveChanges = () => {
    if (!newGoal.mobileId || !newGoal.planId) {
      return toast.error("กรุณาเลือกเป้าหมายและแผนการออมให้ครบถ้วน");
    }

    updateGoal(
      {
        userId: userData.id,
        productId: newGoal.mobileId,
        planId: newGoal.planId,
      },
      {
        onSuccess: () => {
          closePage(); // Close the page on success
        },
      },
    );
  };

  const renderContent = () => {
    switch (uiStep) {
      case "main":
        if (suggestedPhone) {
          return <></>;
        }
        return null; // Or an error component
      default:
        return null;
    }
  };

  return (
    <FramerDiv
      isOpen={isEditing}
      id="change-goal-overlay"
      className="fixed inset-0 z-50 flex flex-col bg-white"
    >
      {/* Page Header */}
      <header className="flex flex-shrink-0 items-center border-b border-gray-200 px-5 pt-10 pb-4">
        <button
          onClick={closePage}
          className="text-2xl text-gray-600 transition-colors hover:text-gray-800"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <h2 className="flex-grow text-center text-xl font-bold text-gray-800">
          แก้ไขเป้าหมาย
        </h2>
        <div className="w-6"></div>
      </header>

      {/* Main Content Area */}
      <div className="relative flex-grow overflow-y-auto">
        <GoalSetter
          showBack={false}
          products={suggestedPhone}
          onGoalChange={handleGoalUpdate}
          onBack={() => setUiStep("input")} // Go back to the input step
        />
        <footer className="sticky bottom-0 flex w-full items-center justify-center bg-white p-6 pb-12 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
          <CtaButton
            onClick={handleSaveChanges}
            disabled={!newGoal.planId || isUpdatingGoal}
            className={"z-10 w-48 rounded-xl p-4 text-base font-bold"}
          >
            {isUpdatingGoal ? "กำลังบันทึก..." : "ยืนยันเป้าหมายใหม่"}
          </CtaButton>
        </footer>
      </div>
    </FramerDiv>
  );
}
