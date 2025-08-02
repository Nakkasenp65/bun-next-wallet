"use client";
import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoMdPerson } from "react-icons/io";
import { FaHashtag } from "react-icons/fa6";

import CtaButton from "../Ui/CtaButton";
import FramerDiv from "../framerComponents/FramerDiv";
import BankSelectionModal from "../Ui/BankSelectionModal";
import Loading from "../StatusComponents/Loading";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";

export default function TransferPage({ userData, setShowTransfer, showTransfer }) {
  const [showBankModal, setShowBankModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [formData, setFormData] = useState({
    // amount: "",
    recipient: "",
    account: "",
  });

  const createTransferTransaction = async (transactionData) => {
    const { walletId, ...payload } = transactionData;
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/transaction/${walletId}`,
      payload,
    );
    return data;
  };

  useEffect(() => {
    setFormData({
      // amount: "",
      recipient: "",
      account: "",
    });
    setSelectedBank(null);
    setShowBankModal(false);
  }, [showTransfer]);

  const queryClient = useQueryClient();
  const transferMutation = useMutation({
    mutationFn: createTransferTransaction,
    onSuccess: () => {
      toast.success("สร้างรายการโอนเงินสำเร็จ!");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setShowTransfer(false);
      setFormData(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "สร้างรายการโอนเงินล้มเหลว");
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
    setShowBankModal(false); // Close the modal after selection
  };

  const handleConfirmTransfer = () => {
    const numericAmount = parseFloat(formData.amount);
    if (isNaN(numericAmount) || numericAmount <= 0)
      return toast.error("Please enter a valid amount.");
    if (!selectedBank) return toast.error("Please select a bank.");
    if (!formData.recipient || !formData.account)
      return toast.error("Please fill in all recipient details.");

    const transactionData = {
      walletId: userData.wallet.id,
      name: `โอนเงิน`,
      amount: numericAmount,
      type: "OUTCOME",
      from: userData.username,
      to: formData.recipient,
      bank: selectedBank.name, // Add the bank name
      description: `Transfer to ${formData.selectedBank} - (${selectedBank.account})`,
    };

    transferMutation.mutate(transactionData);
  };

  const accountInputPlaceholder =
    selectedBank?.id === "promptpay" ? "กรอกเบอร์โทรศัพท์" : "กรอกเลขบัญชี";

  return (
    <>
      <BankSelectionModal
        isOpen={showBankModal}
        onClose={() => setShowBankModal(false)}
        onBankSelect={handleBankSelect}
      />

      {transferMutation.isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Loading />
        </div>
      )}

      <FramerDiv
        isOpen={showTransfer}
        id="transfer-overlay"
        className="bg-bg-dark/80 fixed inset-0 z-20 flex flex-col backdrop-blur-xl"
      >
        {/* Page Header */}
        <header className="flex items-center px-5 pt-10 pb-4">
          <div onClick={() => setShowTransfer(false)} className="text-secondary-text text-2xl">
            <IoIosArrowBack className="text-3xl" />
          </div>
          <h2 className="from-primary-pink to-primary-orange flex-grow bg-gradient-to-r bg-clip-text text-center text-xl font-bold text-transparent">
            โอนเงิน
          </h2>
          <div className="w-6" /> {/* Spacer to keep title perfectly centered */}
        </header>

        {/* Page Content */}
        <div className="flex flex-col gap-6 rounded-t-4xl bg-white p-6">
          {/* Account Balance */}
          <div className="rounded-lg bg-gray-100 p-3 text-center text-sm text-gray-600">
            ยอดเงินที่ใช้ได้
            <span className="text-bg-dark ml-2 font-bold">
              ฿
              {userData?.wallet.balance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          {/* Input Group: Amount */}
          <div className="flex flex-col gap-2">
            <label htmlFor="transfer-amount" className="block text-sm font-bold text-gray-500">
              จำนวนเงิน
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              inputMode="decimal"
              placeholder="฿0.00"
              className="text-bg-dark focus:border-primary-pink focus:ring-primary-pink/30 w-full rounded-xl border border-gray-300 p-4 font-bold focus:ring-2 focus:outline-none"
            />
          </div>

          {/* Input Group: Recipient Name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="transfer-recipient" className="text-sm font-bold text-gray-500">
              ผู้รับโอน
            </label>
            <div className="relative">
              <IoMdPerson className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="recipient"
                value={formData.recipient}
                onChange={handleInputChange}
                placeholder="ชื่อ-นามสกุล"
                className="focus:border-primary-pink focus:ring-primary-pink/30 text-bg-dark w-full rounded-xl border border-gray-300 p-4 pl-12 focus:ring-2 focus:outline-none"
              />
            </div>
          </div>

          {/* Input Group: Bank (Placeholder for now) */}
          <div className="flex flex-col gap-2">
            <label htmlFor="transfer-bank-selector" className="text-sm font-bold text-gray-500">
              ธนาคารผู้รับ
            </label>
            <div
              id="transfer-bank-selector"
              onClick={() => setShowBankModal(true)} // 6. Open the modal on click
              className="hover:border-vibrant-purple flex w-full cursor-pointer items-center justify-between rounded-xl border border-gray-300 p-3"
            >
              {/* 7. Display the selected bank name or the placeholder */}
              <span className={selectedBank ? "text-bg-dark font-semibold" : "text-gray-400"}>
                {selectedBank ? selectedBank.name : "เลือกธนาคาร / พร้อมเพย์"}
              </span>
              <IoIosArrowBack className="rotate-180 text-3xl text-gray-400" />
            </div>
          </div>

          {/* Input Group: Account Number */}
          <div className="flex flex-col gap-2">
            <label htmlFor="transfer-account" className="text-sm font-bold text-gray-500">
              เลขบัญชี / เบอร์โทรศัพท์
            </label>
            <div className="relative">
              <FaHashtag className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="transfer-account"
                name="account"
                value={formData.account}
                onChange={handleInputChange}
                placeholder={accountInputPlaceholder} // 8. Use the dynamic placeholder
                className="text-bg-dark focus:border-primary-pink focus:ring-primary-pink/30 w-full rounded-xl border border-gray-300 p-4 pl-12 outline-none focus:ring-2"
              />
            </div>
          </div>

          {/* Fee Display */}
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 text-base">
            <span className="text-gray-600">ค่าบริการ</span>
            <span className="text-bg-dark font-bold">฿3.00</span>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <CtaButton
              className={"z-10 w-48 rounded-xl p-4 text-lg font-bold"}
              onClick={handleConfirmTransfer}
            >
              ต่อไป
            </CtaButton>
          </div>
        </div>
      </FramerDiv>
    </>
  );
}
