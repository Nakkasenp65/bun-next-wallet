"use client";

import React, { useState, useRef, use } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FaEllipsisH, FaExclamationTriangle, FaUniversity, FaUpload } from "react-icons/fa";
import { FaQrcode } from "react-icons/fa6";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import clsx from "clsx";
import Image from "next/image";

import CtaButton from "../Ui/CtaButton";
import FramerDiv from "../framerComponents/FramerDiv";
import Loading from "@/components/StatusComponents/Loading";
import TransferContent from "../Payment/TransferContent";
import QrContent from "../Payment/QrContent";
import OtherMethodsContent from "../Payment/OtherMethodsContent";
import { useCreateSavingTransaction } from "@/hooks/useCreateTransfer";

export default function DepositPage({ userData, showDeposit, setShowDeposit }) {
  const [activeTab, setActiveTab] = useState("transfer");
  const [amount, setAmount] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const closePage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAmount("");
    setActiveTab("transfer");
    setShowDeposit(false);
  };

  const createTransactionMutation = useCreateSavingTransaction({
    onSuccessCallback: closePage,
  });

  const tabs = [
    { id: "transfer", label: "โอนเงิน", icon: <FaUniversity /> },
    { id: "promptpay", label: "พร้อมเพย์", icon: <FaQrcode /> },
    { id: "other", label: "อื่นๆ", icon: <FaEllipsisH /> },
  ];

  const TabButton = ({ icon, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={clsx(
        "flex flex-1 items-center justify-center gap-2 rounded-t-lg px-4 py-3 text-sm font-bold whitespace-nowrap transition-all duration-300",
        isActive
          ? "border-2 border-stone-100 bg-white text-red-500"
          : "bg-gray-200 text-gray-400 hover:bg-gray-300",
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
      toast.error("กรุณาเลือกรูป PNG หรือ JPG");
    }
  };

  const handleSubmit = () => {
    // Send file to googleDrive and receive url -> save to backend database
    const numericAmount = parseFloat(amount);

    if (!selectedFile) {
      return toast.error("กรุณาแนบสลิปการโอนเงิน");
    }

    const formData = new FormData();
    formData.append("myFile", selectedFile);
    formData.append("userId", userData.wallet.id);

    createTransactionMutation.mutate({
      walletId: userData.wallet.id,
      username: userData.username,
      formData: formData,
    });
  };

  return (
    <>
      {createTransactionMutation.isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Loading />
        </div>
      )}

      <FramerDiv
        isOpen={showDeposit}
        id="topup-overlay"
        className="bg-bg-dark/80 fixed inset-0 z-20 flex h-dvh w-full flex-col backdrop-blur-sm"
      >
        <header className="flex flex-shrink-0 items-center px-5 pt-10 pb-4">
          <button
            onClick={closePage}
            className="text-secondary-text text-2xl transition-colors hover:text-white"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <h2 className="from-primary-pink to-primary-orange flex-grow bg-gradient-to-r bg-clip-text text-center text-xl font-bold text-transparent">
            เติมเงิน (ฝากเงิน)
          </h2>
          <div className="w-6"></div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col rounded-t-[30px] bg-white">
          <div className="flex-grow overflow-y-auto">
            <div className="grid grid-cols-1 gap-4 p-6">
              <div className="rounded-lg bg-gray-100 p-3 text-center text-sm text-gray-600">
                ยอดเงินปัจจุบัน
                <span className="text-bg-dark ml-2 font-bold">
                  ฿
                  {userData.wallet.balance.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="flex items-center justify-center gap-2">
                <FaUniversity color="#f36" size={24} className="animate-bounce" />
                <h1 className="text-xl font-bold text-[#f36]">เลือกช่องทางการชำระเงิน</h1>
              </div>

              <div className="flex items-start gap-3 rounded-lg bg-yellow-50 p-3 text-yellow-800">
                <FaExclamationTriangle className="mt-1 flex-shrink-0 text-yellow-500" />
                <p className="text-[12px]">
                  <span className="font-bold">ข้อแนะนำ:</span> โปรดหลีกเลี่ยงการชำระเงินช่วงเวลา{" "}
                  <span className="font-bold text-red-600">00:00 - 01:00น.</span>{" "}
                  เพื่อป้องกันข้อผิดพลาดช่วงเวลาธนาคารปิดปรับปรุงระบบ
                </p>
              </div>

              <div className="rounded-xl">
                <div className="noscrollbar flex gap-1 overflow-x-auto p-1">
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
                <div className="bg-white p-1">
                  {activeTab === "transfer" && <TransferContent amount={amount} />}
                  {activeTab === "promptpay" && <QrContent amount={amount} />}
                  {activeTab === "other" && <OtherMethodsContent />}
                  {(activeTab === "spaylater" || activeTab === "creditcard") && (
                    <div className="p-16 text-center text-gray-400">
                      <p>ช่องทางนี้ยังไม่เปิดให้บริการ</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="mb-4 text-center text-sm text-gray-600">
                  หากชำระเงินเรียบร้อยแล้ว โปรดแนบสลิปเพื่อยืนยัน
                </p>
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="hover:border-primary-pink flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-6 text-center transition-all hover:bg-pink-50"
                >
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="Slip Preview"
                      width={100}
                      height={150}
                      className="max-h-40 w-auto rounded-md object-contain"
                    />
                  ) : (
                    <>
                      <FaUpload className="text-3xl text-gray-400" />
                      <p className="mt-2 font-medium text-gray-700">คลิกเพื่อแนบสลิป</p>
                      <p className="text-xs text-gray-500">รองรับ: JPG, PNG</p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    accept="image/jpeg,image/png"
                    className="hidden"
                    type="file"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-shrink-0 justify-center bg-white p-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
            <CtaButton
              onClick={handleSubmit}
              disabled={!selectedFile || createTransactionMutation.isPending}
              className="z-10 w-48 rounded-xl p-4 text-base font-bold"
            >
              {createTransactionMutation.isPending ? "กำลังส่ง..." : "ยืนยันการชำระเงิน"}
            </CtaButton>
          </div>
        </div>
      </FramerDiv>
    </>
  );
}
