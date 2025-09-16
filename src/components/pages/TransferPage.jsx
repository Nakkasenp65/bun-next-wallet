"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import CtaButton from "../ui/CtaButton";
import FramerDiv from "../framerComponents/FramerDiv";
import Loading from "../StatusComponents/Loading";
import PinModal from "../ui/PinModal";
import {
  useSearchRecipient,
  useCreateInternalTransfer,
} from "@/hooks/useTransactions";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { useDebounce } from "use-debounce";
import { ChevronLeft, LoaderCircle, Phone, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function TransferPage({
  userData,
  balance = 0,
  setShowTransfer,
  showTransfer,
  receiverData = null,
  setParentClose = () => {},
}) {
  const [searchMode, setSearchMode] = useState("phone");
  const [searchQuery, setSearchQuery] = useState("");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const hasReceiverPreset = useMemo(() => !!receiverData?.id, [receiverData]);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const searchRecipientMutation = useSearchRecipient();
  const handleSuccessAndClose = () => {
    setParentClose();
    setShowTransfer(false);
    setTimeout(() => {
      setSearchQuery("");
      setRecipient(null);
      setAmount("");
      setShowPinModal(false);
      setSearchMode("phone");
    }, 300);
  };
  const transferMutation = useCreateInternalTransfer({
    onSuccessCallback: handleSuccessAndClose,
  });

  useEffect(() => {
    if (hasReceiverPreset) return;
    const query = debouncedSearchQuery.trim();

    if (!query) {
      setRecipient(null);
      return;
    }

    if (searchMode === "phone" && /^\d{10}$/.test(query.replace(/-/g, ""))) {
      searchRecipientMutation.mutate(
        { type: "phone", value: query },
        {
          onSuccess: (data) => setRecipient(data),
          onError: () => setRecipient(null),
        },
      );
    } else if (searchMode === "wallet" && /^\d{6}$/.test(query)) {
      searchRecipientMutation.mutate(
        { type: "walletId", value: `1WL-${query.toUpperCase()}` },
        {
          onSuccess: (data) => setRecipient(data),
          onError: () => setRecipient(null),
        },
      );
    } else {
      setRecipient(null);
    }
  }, [debouncedSearchQuery, searchMode, hasReceiverPreset]);

  useEffect(() => {
    // We only want to reset when the component is OPENED.
    // This ensures a clean slate every single time.
    if (showTransfer) {
      console.log("Aria: Resetting TransferPage state for a fresh start.");
      setSearchMode("phone");
      setSearchQuery("");
      setAmount("");
      setRecipient(null);
      setShowPinModal(false);
    }
  }, [showTransfer]);

  const handleModeSwitch = (mode) => {
    setSearchMode(mode);
    setSearchQuery("");
    setRecipient(null);
  };

  const handleCancel = () => {
    setShowTransfer(false);
  };

  useEffect(() => {
    if (hasReceiverPreset) {
      setRecipient(receiverData);
    }
  }, [hasReceiverPreset, receiverData]);

  useEffect(() => {
    setSearchMode("phone");
    setSearchQuery("");
    setAmount("");
    setRecipient(null);
    setShowPinModal(false);
  }, [showTransfer]);

  const handleConfirmTransfer = () => {
    const numericAmount = parseFloat(amount);
    if (!recipient) return toast.error("กรุณาค้นหาผู้รับโอนให้พบก่อน");
    if (isNaN(numericAmount) || numericAmount <= 0)
      return toast.error("กรุณาระบุจำนวนเงินที่ถูกต้อง");
    if (numericAmount > userData.wallet.balance)
      return toast.error("ยอดเงินของคุณไม่เพียงพอ");
    setShowPinModal(true);
  };

  const handlePinComplete = (pin) => {
    transferMutation.mutate({
      userId: userData?.id,
      line_user_id: userData?.line_user_id,
      recipientUserId: recipient.id,
      amount: parseFloat(amount),
      pin,
    });
  };

  const isSearching = hasReceiverPreset
    ? false
    : searchRecipientMutation.isPending;
  const isButtonDisabled =
    !recipient ||
    !amount ||
    parseFloat(amount) <= 0 ||
    isSearching ||
    transferMutation.isPending;
  const isPinDisabled = transferMutation.isPending;

  return (
    <>
      {transferMutation.isPending && <Loading message="กำลังโอนเงิน..." />}
      <PinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onComplete={handlePinComplete}
        recipient={recipient}
        amount={amount}
        isPinDisabled={isPinDisabled}
      />

      <FramerDiv
        isOpen={showTransfer}
        className="bg-bg-dark fixed inset-0 z-20 flex flex-col backdrop-blur-xl"
      >
        <header className="flex flex-shrink-0 items-center p-4 pt-10">
          <button onClick={handleCancel} className="text-white">
            <ChevronLeft size={28} />
          </button>
          <h2 className="from-primary-pink to-primary-orange mx-auto bg-gradient-to-r bg-clip-text text-lg font-extrabold tracking-tight text-transparent">
            โอนเงิน
          </h2>
          <div className="w-10" />
        </header>

        <div className="flex h-full flex-col overflow-hidden rounded-t-3xl bg-white">
          <div className="flex-grow space-y-4 overflow-y-auto p-4">
            <div className="rounded-xl bg-slate-100 p-3 text-center text-sm text-slate-600">
              ยอดเงินที่ใช้ได้
              <span className="ml-2 font-bold text-slate-800">
                ฿{balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>

            {!hasReceiverPreset ? (
              <div className="flex flex-col gap-4">
                <div className="relative grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
                  <motion.div
                    className="absolute top-1 bottom-1 left-1 w-1/2 rounded-lg bg-white shadow-md"
                    animate={{ x: searchMode === "phone" ? "0%" : "100%" }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  />
                  <button
                    onClick={() => handleModeSwitch("phone")}
                    className="relative z-10 flex items-center justify-center gap-2 rounded-lg p-2 font-semibold transition-colors"
                  >
                    <Phone
                      size={16}
                      className={
                        searchMode === "phone"
                          ? "text-primary-pink"
                          : "text-slate-500"
                      }
                    />
                    <span
                      className={
                        searchMode === "phone"
                          ? "text-slate-800"
                          : "text-slate-500"
                      }
                    >
                      เบอร์โทรศัพท์
                    </span>
                  </button>
                  <button
                    onClick={() => handleModeSwitch("wallet")}
                    className="relative z-10 flex items-center justify-center gap-2 rounded-lg p-2 font-semibold transition-colors"
                  >
                    <Wallet
                      size={16}
                      className={
                        searchMode === "wallet"
                          ? "text-primary-pink"
                          : "text-slate-500"
                      }
                    />
                    <span
                      className={
                        searchMode === "wallet"
                          ? "text-slate-800"
                          : "text-slate-500"
                      }
                    >
                      Wallet ID
                    </span>
                  </button>
                </div>

                <div className="relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={searchMode}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {searchMode === "phone" ? (
                        <div className="relative">
                          <Phone className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
                          <Input
                            inputMode="numeric"
                            value={searchQuery}
                            onChange={(e) =>
                              setSearchQuery(e.target.value.replace(/\D/g, ""))
                            }
                            placeholder="กรอกเบอร์โทรศัพท์ 10 หลัก"
                            maxLength={10}
                            className="w-full rounded-xl border-2 border-slate-200 p-6 pl-12 font-semibold text-slate-800 focus:ring-2 focus:ring-pink-400"
                          />
                        </div>
                      ) : (
                        <div className="relative">
                          <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 font-semibold text-slate-400">
                            1WL-
                          </span>
                          <Input
                            type="text"
                            inputMode="numeric"
                            value={searchQuery}
                            onChange={(e) =>
                              setSearchQuery(e.target.value.replace(/\D/g, ""))
                            }
                            placeholder="กรอกเลข Wallet ID 6 หลัก"
                            maxLength={6}
                            className="w-full rounded-xl border-2 border-slate-200 p-6 pl-14 font-semibold text-slate-800 focus:ring-2 focus:ring-pink-400"
                          />
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                  {isSearching && (
                    <LoaderCircle className="absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 animate-spin text-pink-500" />
                  )}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm font-bold text-slate-500">
                  ผู้รับ (จากการสแกน)
                </p>
                <div className="mt-2 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-3">
                  {receiverData?.line_profile_url && (
                    <Image
                      src={receiverData.line_profile_url}
                      width={40}
                      height={40}
                      alt={receiverData?.line_display_name || "recipient"}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-bold text-gray-800">
                      {receiverData?.line_display_name || "ไม่พบชื่อ"}
                    </p>
                    {receiverData?.phone && (
                      <p className="text-xs text-gray-500">
                        เบอร์โทร: {receiverData.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <AnimatePresence>
              {recipient && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  className="grow overflow-hidden"
                >
                  {!hasReceiverPreset && (
                    <div>
                      <p className="text-sm font-bold text-slate-500">
                        โอนไปยัง
                      </p>
                      <div className="mt-2 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-3">
                        {recipient?.line_profile_url && (
                          <Image
                            src={recipient.line_profile_url}
                            width={40}
                            height={40}
                            alt={recipient?.line_display_name || "recipient"}
                            className="rounded-full"
                          />
                        )}
                        <div>
                          <p className="font-bold text-gray-800">
                            {recipient?.line_display_name || "ไม่พบชื่อ"}
                          </p>
                          {recipient?.phone && (
                            <p className="text-xs text-gray-500">
                              เบอร์โทร: {recipient.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="text-sm font-bold text-slate-500">
                จำนวนเงิน
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="decimal"
                placeholder="฿0.00"
                className="mt-2 w-full rounded-xl border-2 border-slate-200 p-6 text-lg font-bold text-slate-800 focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>

          <div className="flex-shrink-0 border-t border-slate-100 bg-white/80 p-4 pt-3 backdrop-blur-sm">
            <CtaButton
              onClick={handleConfirmTransfer}
              disabled={isButtonDisabled}
              className={"w-full rounded-xl p-4 text-lg font-bold"}
            >
              ต่อไป
            </CtaButton>
          </div>
        </div>
      </FramerDiv>
    </>
  );
}
