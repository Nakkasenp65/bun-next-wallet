"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import CtaButton from "../Ui/CtaButton";
import FramerDiv from "../framerComponents/FramerDiv";
import clsx from "clsx";
import ConfirmDepositPage from "./ConfirmDepositPage";
import axios from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Loading from "@/components/Loading";
import { FaEllipsisH, FaExclamationTriangle, FaUniversity } from "react-icons/fa";
import { FaCreditCard, FaQrcode } from "react-icons/fa6";
import { SiSpacex } from "react-icons/si";
import TransferContent from "../Payment/TransferContent";
import QrContent from "../Payment/QrContent";
import OtherMethodsContent from "../Payment/OtherMethodsContent";

const createDepositTransaction = async (transactionData) => {
  const { walletId, ...payload } = transactionData;
  const { data } = await axios.post(`${process.env.NEXT_PUBLIC_LOCAL_API_URL}/transaction/${walletId}`, payload);
  return data;
};

export default function DepositPage({ userData, showDeposit, setShowDeposit }) {
  const [activeTab, setActiveTab] = useState("transfer");
  const [amount, setAmount] = useState("");
  const [showConfirmDepositPage, setShowConfirmDepositPage] = useState(false);
  const queryClient = useQueryClient();

  const tabs = [
    { id: "transfer", label: "โอนเงิน", icon: <FaUniversity /> },
    { id: "promptpay", label: "พร้อมเพย์", icon: <FaQrcode /> },
    { id: "spaylater", label: "SPayLater", icon: <SiSpacex /> },
    { id: "creditcard", label: "บัตรเครดิต", icon: <FaCreditCard /> },
    { id: "other", label: "อื่นๆ", icon: <FaEllipsisH /> },
  ];

  const depositMutation = useMutation({
    mutationFn: createDepositTransaction,
    onSuccess: () => {
      toast.success("เติมเงินสำเร็จ! กำลังกลับสู่หน้าหลัก");
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["user"] });
        setShowConfirmDepositPage(false);
        setShowDeposit(false);
      }, 5000);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "An error occurred.");
    },
  });

  const handleConfirmDeposit = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Invalid amount");
      return;
    }

    const transactionData = {
      walletId: userData.wallet.id,
      name: "ฝากเงิน",
      amount: numericAmount,
      from: userData.username,
      to: "my wallet",
      type: "INCOME",
    };

    // 4. Trigger the mutation
    depositMutation.mutate(transactionData);
  };

  const TabButton = ({ icon, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={clsx(
        "flex flex-1 items-center justify-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-bold transition-all duration-300",
        isActive
          ? "border-b-2 border-red-500 text-red-500"
          : "border-b-2 border-transparent text-gray-500 hover:bg-gray-100"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <>
      {depositMutation.isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Loading />
        </div>
      )}
      <ConfirmDepositPage
        showConfirmDepositPage={showConfirmDepositPage}
        setShowConfirmDepositPage={setShowConfirmDepositPage}
        onConfirm={handleConfirmDeposit}
      />
      <FramerDiv
        isOpen={showDeposit}
        id="topup-overlay"
        className="bg-bg-dark/80 fixed inset-0 z-20 flex flex-col backdrop-blur-sm"
      >
        {/* Page Header */}
        <header className="flex flex-shrink-0 items-center  px-5 pt-10 pb-4">
          <button
            onClick={() => setShowDeposit((prev) => !prev)}
            className="text-secondary-text text-2xl transition-colors hover:text-white"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <h2 className="from-primary-pink to-primary-orange flex-grow bg-gradient-to-r bg-clip-text text-center text-xl font-bold text-transparent">
            เติมเงิน (ฝากเงิน)
          </h2>
          <div className="w-6"></div> {/* Spacer */}
        </header>

        {/* Page Content */}
        <div className="flex flex-grow flex-col gap-5 overflow-y-auto rounded-t-[30px] bg-white p-6">
          <div className="rounded-lg bg-gray-100 p-3 text-center text-sm text-gray-600">
            ยอดเงินปัจจุบัน
            <span className="text-bg-dark ml-2 font-bold">
              {/* 4. ใช้ balance จาก userData ที่ดึงมาโดยตรง */}฿
              {userData.wallet.balance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          {/* Input Group: Amount */}
          <div className="flex justify-center items-center gap-2  ">
            <FaUniversity color="#f36" size={24} className="animate-bounce" />
            <h1 className="text-xl font-bold text-[#f36]">เลือกช่องทางการชำระเงิน</h1>
          </div>

          <div className=" flex items-start gap-3 rounded-lg bg-yellow-50 p-3 text-yellow-800">
            <FaExclamationTriangle className="mt-1 flex-shrink-0 text-yellow-500" />
            <p className="text-[12px]">
              <span className="font-bold">ข้อแนะนำ:</span> โปรดหลีกเลี่ยงการชำระเงินช่วงเวลา{" "}
              <span className="font-bold text-red-600">00:00 - 01:00น.</span>{" "}
              เพื่อป้องกันข้อผิดพลาดช่วงเวลาธนาคารปิดปรับปรุงระบบ
            </p>
          </div>

          <div className="noscrollbar flex overflow-x-auto border-b border-gray-200">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                icon={tab.icon}
                label={tab.label}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </div>

          {/* Content Page */}
          <div className="-mx-4 bg-gray-50">
            {activeTab === "transfer" && <TransferContent />}
            {activeTab === "promptpay" && <QrContent />}
            {activeTab === "other" && <OtherMethodsContent />}
            {/* Add placeholders for other tabs */}
            {(activeTab === "spaylater" || activeTab === "creditcard") && (
              <div className="p-16 text-center text-gray-400">
                <p>ช่องทางนี้ยังไม่เปิดให้บริการ</p>
              </div>
            )}
          </div>

          {/* CTA Button */}
          {/* <div className="mt-auto">
            <CtaButton disabled={!(parseFloat(amount) > 0)} onClick={() => setShowConfirmDepositPage(true)}>
              ยืนยันการเติมเงิน
            </CtaButton>
          </div> */}
        </div>
      </FramerDiv>
    </>
  );
}
