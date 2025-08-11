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
  const [uiStep, setUiStep] = useState("inputPhone"); // 'inputPhone', 'confirmRecipient', 'inputPin'
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState(null);

  const closePage = () => {
    setShowTransfer(false);
    // Delay reset to allow for exit animation, preventing UI flicker
    setTimeout(() => {
      setUiStep("inputPhone");
      setPhoneNumber("");
      setRecipient(null);
      setAmount("");
    }, 300);
  };

  const searchRecipientMutation = useSearchRecipient();
  const transferMutation = useCreateInternalTransfer({
    onSuccessCallback: closePage,
  });

  // Step 1 Handler: Search for the recipient
  const handleSearch = () => {
    if (phoneNumber.length < 9) {
      return toast.error("กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง");
    }
    searchRecipientMutation.mutate(phoneNumber, {
      onSuccess: (data) => {
        setRecipient(data);
        setUiStep("confirmRecipient"); // Move to next step on success
      },
    });
  };

  // Step 2 Handler: Confirm recipient and amount, move to PIN
  const handleConfirm = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return toast.error("กรุณาระบุจำนวนเงินที่ถูกต้อง");
    }
    if (numericAmount > userData.wallet.balance) {
      return toast.error("ยอดเงินของคุณไม่เพียงพอ");
    }
    setUiStep("inputPin");
  };

  // Step 3 Handler: PIN is complete, execute transfer
  const handlePinComplete = (pin) => {
    transferMutation.mutate({
      recipientUserId: recipient.id,
      amount: parseFloat(amount),
      pin: pin,
    });
  };

  const pageVariants = {
    initial: { opacity: 0, x: "100%" },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: "-100%" },
  };

  const isLoading =
    searchRecipientMutation.isPending || transferMutation.isPending;

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Loading
            message={
              transferMutation.isPending ? "กำลังโอนเงิน..." : "กำลังค้นหา..."
            }
          />
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
            {uiStep === "inputPhone" && (
              <motion.div
                key="step1"
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                className="flex h-full flex-col gap-6"
              >
                {/* Balance */}
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
                  {/* Phone Number Input */}
                  <label className="text-sm font-bold text-gray-500">
                    เบอร์โทรศัพท์ผู้รับ
                  </label>
                  <div className="relative mt-2">
                    <FaPhoneAlt className="absolute top-1/2 left-4 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="กรอกเบอร์โทรศัพท์"
                      inputMode="numeric"
                      className="text-bg-dark w-full rounded-xl border border-gray-300 p-4 pl-12 outline-none focus:ring-2 focus:ring-pink-400"
                    />
                  </div>
                </div>
                <div className="mt-auto flex justify-center">
                  <CtaButton
                    onClick={handleSearch}
                    disabled={isLoading}
                    className={"z-10 w-48 rounded-xl p-4 text-base font-bold"}
                  >
                    ค้นหาผู้รับ
                  </CtaButton>
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
                    onClick={() => setUiStep("inputPhone")}
                    className="rounded-xl px-6 py-3 font-bold text-gray-500"
                  >
                    ย้อนกลับ
                  </button>
                  <CtaButton onClick={handleConfirm} disabled={isLoading}>
                    ต่อไป
                  </CtaButton>
                </div>
              </motion.div>
            )}

            {/* Step 3: Confirm PIN */}
            {uiStep === "inputPin" && recipient && (
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
                  {/* The PIN input is the only interactive element. All other inputs are "locked" by being on a different screen. */}
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
