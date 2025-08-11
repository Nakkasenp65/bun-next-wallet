"use client";
import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";
import Image from "next/image";
import CtaButton from "../Ui/CtaButton";
import FramerDiv from "../framerComponents/FramerDiv";
import Loading from "../StatusComponents/Loading";
import PinModal from "../Ui/PinModal";
import {
  useSearchRecipient,
  useCreateInternalTransfer,
} from "@/hooks/useTransactions";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { useDebounce } from "use-debounce";

export default function TransferPage({
  userData,
  setShowTransfer,
  showTransfer,
}) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState(null);
  const [showPinModal, setShowPinModal] = useState(false);

  // Debounce the phone number input to avoid spamming the API
  const [debouncedPhoneNumber] = useDebounce(phoneNumber, 500); // 500ms delay

  const closePage = () => {
    setShowTransfer(false);
    // Delay reset to allow for exit animation, preventing UI flicker
    setTimeout(() => {
      setPhoneNumber("");
      setRecipient(null);
      setAmount("");
      setShowPinModal(false);
    }, 300);
  };

  const searchRecipientMutation = useSearchRecipient();
  const transferMutation = useCreateInternalTransfer({
    onSuccessCallback: closePage,
  });

  // This effect runs when the user stops typing the phone number
  useEffect(() => {
    if (debouncedPhoneNumber && debouncedPhoneNumber.length >= 9) {
      searchRecipientMutation.mutate(debouncedPhoneNumber, {
        onSuccess: (data) => setRecipient(data),
        onError: () => setRecipient(null), // Clear recipient on error
      });
    } else {
      setRecipient(null); // Clear recipient if phone number is too short
    }
  }, [debouncedPhoneNumber]);

  const handleConfirmTransfer = () => {
    const numericAmount = parseFloat(amount);
    if (!recipient) return toast.error("กรุณาค้นหาผู้รับโอนให้พบก่อน");
    if (isNaN(numericAmount) || numericAmount <= 0)
      return toast.error("กรุณาระบุจำนวนเงินที่ถูกต้อง");
    if (numericAmount > userData.wallet.balance)
      return toast.error("ยอดเงินของคุณไม่เพียงพอ");

    // Open the PIN modal
    setShowPinModal(true);
  };

  const handlePinComplete = (pin) => {
    transferMutation.mutate({
      userId: userData?.id,
      line_user_id: userData?.line_user_id,
      recipientUserId: recipient.id,
      amount: parseFloat(amount),
      pin: pin,
    });
  };

  const isButtonDisabled =
    !recipient ||
    !amount ||
    searchRecipientMutation.isPending ||
    transferMutation.isPending;

  return (
    <>
      {/* Full screen loading for the final transfer action */}
      {transferMutation.isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Loading message="กำลังโอนเงิน..." />
        </div>
      )}

      {/* PIN Modal Overlay */}
      <PinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onComplete={handlePinComplete}
        recipient={recipient}
        amount={amount}
      />

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

        <div className="flex h-full flex-col gap-6 rounded-t-4xl bg-white p-6">
          <div className="rounded-lg bg-gray-100 p-3 text-center text-sm text-gray-600">
            ยอดเงินที่ใช้ได้
            <span className="text-bg-dark ml-2 font-bold">
              ฿
              {userData?.wallet.balance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>

          {/* Phone Number Input */}
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
                placeholder="กรอกเบอร์โทรศัพท์เพื่อค้นหา"
                inputMode="numeric"
                className="text-bg-dark w-full rounded-xl border border-gray-300 p-4 pl-12 outline-none focus:ring-2 focus:ring-pink-400"
              />
              {searchRecipientMutation.isPending && (
                <div className="absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 animate-spin rounded-full border-2 border-solid border-pink-500 border-t-transparent"></div>
              )}
            </div>
          </div>

          {/* Recipient Info & Amount Input (Conditionally Animated) */}
          <AnimatePresence>
            {recipient && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: "1.5rem" }} // 1.5rem = gap-6
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="flex flex-col gap-6 overflow-hidden"
              >
                {/* Recipient Info */}
                <div>
                  <p className="text-sm font-bold text-gray-500">โอนไปยัง</p>
                  <div className="mt-2 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-3">
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
              </motion.div>
            )}
          </AnimatePresence>
          {/* Amount Input */}
          <div>
            <label className="text-sm font-bold text-gray-500">จำนวนเงิน</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
              placeholder="฿0.00"
              className="text-bg-dark mt-2 w-full rounded-xl border border-gray-300 p-4 text-lg font-bold outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>
          {/* CTA Button */}
          <div className="mt-auto flex justify-center pt-4">
            <CtaButton
              onClick={handleConfirmTransfer}
              disabled={isButtonDisabled}
              className={"z-10 w-48 rounded-xl p-4 text-base font-bold"}
            >
              ต่อไป
            </CtaButton>
          </div>
        </div>
      </FramerDiv>
    </>
  );
}
