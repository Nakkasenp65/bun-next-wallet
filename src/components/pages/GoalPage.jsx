"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faPenToSquare,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import CtaButton from "../Ui/CtaButton";
import ChangeGoalPage from "./ChangeGoalPage";
import FramerDiv from "../framerComponents/FramerDiv";

export default function GoalPage({ userData, showGoal, setShowGoal }) {
  const [isEditing, setIsEditing] = useState(false);

  const savedAmount = userData.wallet.balance;
  const progressPercentage =
    userData.goal.mobileModel.price > 0
      ? (savedAmount / userData.goal.mobileModel.price) * 100
      : 0;
  const remainingAmount = Math.max(
    0,
    userData.goal.mobileModel.price - savedAmount,
  );

  return (
    <>
      <ChangeGoalPage isEditing={isEditing} setIsEditing={setIsEditing} />

      <FramerDiv
        isOpen={showGoal}
        id="product-goal-overlay"
        className="bg-bg-dark/80 fixed inset-0 z-40 flex flex-col backdrop-blur-sm"
      >
        {/* Page Header */}
        <header className="flex flex-shrink-0 items-center border-b border-white/20 px-5 pt-10 pb-4">
          <button
            onClick={() => setShowGoal((prev) => !prev)}
            className="text-secondary-text text-2xl transition-colors hover:text-white"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <h2 className="from-primary-pink to-primary-orange flex-grow bg-gradient-to-r bg-clip-text text-center text-xl font-bold text-transparent">
            เป้าหมายการออม
          </h2>
          <button
            onClick={() => setIsEditing(true)}
            className="text-secondary-text text-xl transition-colors hover:text-white"
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </header>

        {/* Page Content */}
        <div className="flex flex-grow flex-col overflow-y-auto rounded-t-[30px] bg-white p-6 text-center">
          <img
            src={userData.goal.imageUrl}
            alt={userData.goal.brand}
            className="mx-auto w-1/2 max-w-[200px] rounded-2xl shadow-lg transition-transform hover:scale-105"
          />
          <h2 className="text-bg-dark mt-5 text-2xl font-bold">
            {userData.goal.brand}
          </h2>
          <p className="mb-5 text-base text-gray-500">
            ราคาเป้าหมาย: ฿
            {userData.goal.mobileModel.price.toLocaleString("en-US")}
          </p>

          {/* Progress Bar */}
          <div className="relative my-4 w-full">
            <div className="text-primary-pink absolute -top-5 right-0 text-sm font-bold">
              {Math.round(progressPercentage)}%
            </div>
            <div className="h-3 rounded-full bg-gray-200">
              <div
                className="from-bright-cyan to-bright-green h-full rounded-full bg-gradient-to-r"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Progress Details */}
          <div className="text-bg-dark flex w-full justify-between text-sm font-bold">
            <span>
              ออมแล้ว: ฿{userData.wallet.balance.toLocaleString("en-US")}
            </span>
            <span>ขาดอีก: ฿{remainingAmount.toLocaleString("en-US")}</span>
          </div>

          {/* Current Savings Plan Display */}
          <div className="mt-5 flex w-full flex-col gap-1.5 rounded-lg bg-gray-50 p-4 text-left">
            <div className="flex w-full justify-between">
              <span className="flex items-center gap-2 text-gray-600">
                <FontAwesomeIcon
                  icon={faCalendarCheck}
                  className="text-primary-pink"
                />
                แผนการออม
              </span>
              <span className="text-bg-dark font-bold">
                {userData.goal.plan.displayName}
              </span>
            </div>
            <div className="flex w-full justify-between text-lg">
              <span className="text-gray-600">ยอดที่ต้องออม</span>
              <span className="text-bg-dark font-bold">
                ฿{userData.goal.mobileModel.price.toLocaleString("en-US")}
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-auto pt-6">
            <CtaButton id="add-savings-btn">ออมเงินเพิ่ม</CtaButton>
          </div>
        </div>
      </FramerDiv>
    </>
  );
}
