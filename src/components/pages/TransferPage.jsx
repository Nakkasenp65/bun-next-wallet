"use client";
import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";
import Image from "next/image";
import CtaButton from "../Ui/CtaButton";
import FramerDiv from "../framerComponents/FramerDiv";
import Loading from "../StatusComponents/Loading";
import PinInput from "../Ui/PinInput"; // Import the new component
import {
  useSearchRecipient,
  useCreateInternalTransfer,
} from "@/hooks/useTransactions"; // Import new hooks
import { AnimatePresence, motion } from "framer-motion";

export default function TransferPage({
  userData,
  setShowTransfer,
  showTransfer,
}) {
  const [uiStep, setUiStep] = useState("inputPhoneNumber"); // 'inputPhoneNumber', 'confirmRecipient', 'confirmPin'
  const [phoneNumber, setPhoneNumber] = useState("");
  const [recipient, setRecipient] = useState(null);
  const [amount, setAmount] = useState("");

  const closePage = () => {
    setShowTransfer(false);
    // Reset all states when closing
    setTimeout(() => {
      setUiStep("inputPhoneNumber");
      setPhoneNumber("");
      setRecipient(null);
      setAmount("");
    }, 300); // Delay reset to allow for exit animation
  };

  const searchRecipientMutation = useSearchRecipient();
  const transferMutation = useCreateInternalTransfer({
    onSuccessCallback: closePage,
  });

  const handleSearch = () => {
    if (phoneNumber.length < 9)
      return toast.error("กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง");
    searchRecipientMutation.mutate(phoneNumber, {
      onSuccess: (data) => {
        setRecipient(data);
        setUiStep("confirmRecipient");
      },
    });
  };

  const handleAmountConfirm = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0)
      return toast.error("กรุณาระบุจำนวนเงินที่ถูกต้อง");
    if (numericAmount > userData.wallet.balance)
      return toast.error("ยอดเงินของคุณไม่เพียงพอ");
    setUiStep("confirmPin");
  };

  const handlePinComplete = (pin) => {
    transferMutation.mutate({
      recipientUserId: recipient.id,
      amount: parseFloat(amount),
      pin: pin,
    });
  };

  const pageVariants = {
    initial: { opacity: 0, x: 300 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -300 },
  };

  return (
    <>
      {(searchRecipientMutation.isPending || transferMutation.isPending) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Loading />
        </div>
      )}

      <FramerDiv
        isOpen={showTransfer}
        id="transfer-overlay"
        className="bg-bg-dark/80 fixed inset-0 z-20 flex flex-col backdrop-blur-xl"
      >
        <header className="flex items-center px-5 pt-10 pb-4">
          <button onClick={closePage} className="text-secondary-text text-2xl">
            <IoIosArrowBack className="text-3xl" />
          </button>
          <h2 className="from-primary-pink to-primary-orange flex-grow bg-gradient-to-r bg-clip-text text-center text-xl font-bold text-transparent">
            โอนเงิน
          </h2>
          <div className="w-6" />
        </header>

        <div className="relative flex-grow overflow-hidden rounded-t-4xl bg-white p-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Input Phone Number */}
            {uiStep === "inputPhoneNumber" && (
              <motion.div
                key="step1"
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                className="flex h-full flex-col gap-6"
              >
                <div className="rounded-lg bg-gray-100 p-3 text-center text-sm text-gray-600">
                  ยอดเงินที่ใช้ได้
                  <span className="text-bg-dark ml-2 font-bold">
                    ฿
                    {userData?.wallet.balance.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-500">
                    เบอร์โทรศัพท์ผู้รับ
                  </label>
                  <div className="relative mt-2">
                    <FaPhoneAlt className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="กรอกเบอร์โทรศัพท์"
                      className="w-full rounded-xl border border-gray-300 p-4 pl-12 outline-none focus:ring-2 focus:ring-pink-400"
                    />
                  </div>
                </div>
                <div className="mt-auto flex justify-center">
                  <CtaButton onClick={handleSearch}>ค้นหาผู้รับ</CtaButton>
                </div>
              </motion.div>
            )}

            {/* Step 2: Confirm Recipient & Input Amount */}
            {uiStep === "confirmRecipient" && recipient && (
              <motion.div
                key="step2"
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                className="flex h-full flex-col gap-6"
              >
                <div>
                  <p className="text-sm font-bold text-gray-500">โอนไปยัง</p>
                  <div className="mt-2 flex items-center gap-3 rounded-xl border border-gray-200 p-3">
                    <Image
                      src={recipient.line_profile_url}
                      width={40}
                      height={40}
                      alt={recipient.line_display_name}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-bold text-gray-800">
                        {recipient.line_display_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        เบอร์โทร: {recipient.phone}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-500">
                    จำนวนเงิน
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    inputMode="decimal"
                    placeholder="฿0.00"
                    className="mt-2 w-full rounded-xl border border-gray-300 p-4 text-lg font-bold outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>
                <div className="mt-auto flex justify-center gap-4">
                  <button
                    onClick={() => setUiStep("inputPhoneNumber")}
                    className="rounded-xl px-6 py-3 font-bold text-gray-500"
                  >
                    ย้อนกลับ
                  </button>
                  <CtaButton onClick={handleAmountConfirm}>ต่อไป</CtaButton>
                </div>
              </motion.div>
            )}

            {/* Step 3: Confirm PIN */}
            {uiStep === "confirmPin" && recipient && (
              <motion.div
                key="step3"
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                className="flex h-full flex-col gap-6 text-center"
              >
                <div className="flex flex-col">
                  <p className="text-sm text-gray-500">คุณกำลังจะโอนเงิน</p>
                  <p className="text-4xl font-bold text-gray-800">
                    ฿
                    {parseFloat(amount).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    ให้กับ{" "}
                    <span className="font-bold">
                      {recipient.line_display_name}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <label className="font-bold text-gray-700">
                    กรุณายืนยันด้วยรหัส PIN
                  </label>
                  <PinInput length={6} onComplete={handlePinComplete} />
                </div>
                <div className="mt-auto flex justify-center">
                  <button
                    onClick={() => setUiStep("confirmRecipient")}
                    className="rounded-xl px-6 py-3 font-bold text-gray-500"
                  >
                    ย้อนกลับ
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FramerDiv>
    </>
  );
}
