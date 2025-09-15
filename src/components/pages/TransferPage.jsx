"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import CtaButton from "../Ui/CtaButton";
import FramerDiv from "../framerComponents/FramerDiv";
import Loading from "../StatusComponents/Loading";
import PinModal from "../Ui/PinModal";
import { useSearchRecipient, useCreateInternalTransfer } from "@/hooks/useTransactions";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { useDebounce } from "use-debounce";
import { ChevronLeft, Search, LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function TransferPage({
  userData,
  balance = 0,
  setShowTransfer,
  showTransfer,
  receiverData = null,
  setParentClose = () => {},
}) {
  // --- STAGE 1: State Management ---
  const [searchQuery, setSearchQuery] = useState(""); // Raw user input
  const [displayValue, setDisplayValue] = useState(""); // Formatted value shown in the input
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState(null);
  const [showPinModal, setShowPinModal] = useState(false);

  const hasReceiverPreset = useMemo(() => !!receiverData?.id, [receiverData]);
  const [debouncedDisplayValue] = useDebounce(displayValue, 500);

  // --- Handlers ---
  const handleSuccessAndClose = () => {
    setParentClose();
    setShowTransfer(false);
    setTimeout(() => {
      setSearchQuery("");
      setDisplayValue("");
      setRecipient(null);
      setAmount("");
      setShowPinModal(false);
    }, 300);
  };

  const handleCancel = () => {
    setShowTransfer(false);
  };

  // --- Mutations ---
  const searchRecipientMutation = useSearchRecipient();
  const transferMutation = useCreateInternalTransfer({
    onSuccessCallback: handleSuccessAndClose,
  });

  // --- STAGE 2: Core Logic ---

  // Effect for QR code mode
  useEffect(() => {
    if (hasReceiverPreset) {
      setRecipient(receiverData);
      const identifier = receiverData?.phone || receiverData?.line_display_name || "";
      setSearchQuery(identifier);
      setDisplayValue(identifier);
    }
  }, [hasReceiverPreset, receiverData]);

  // [THE PREDICTIVE UI] Effect to format the display value
  useEffect(() => {
    if (hasReceiverPreset) return;

    const query = searchQuery;
    const digits = query.replace(/\D/g, "");

    if (query === "") {
      setDisplayValue("");
    } else if (/^\d+$/.test(query) && query.length <= 6) {
      setDisplayValue(`1WL-${query}`);
    } else {
      setDisplayValue(query);
    }
  }, [searchQuery, hasReceiverPreset]);

  // [THE SMART SEARCH] Effect to trigger the search mutation
  useEffect(() => {
    if (hasReceiverPreset) return;

    const query = debouncedDisplayValue.trim();
    let searchType = null;
    let searchValue = null;

    if (query.toUpperCase().startsWith("1WL-") && query.length === 10) {
      searchType = "walletId";
      searchValue = query.toUpperCase();
    } else if (/^\d{10}$/.test(query.replace(/-/g, ""))) {
      searchType = "phone";
      searchValue = query;
    }

    if (searchType && searchValue) {
      searchRecipientMutation.mutate(
        { type: searchType, value: searchValue },
        {
          onSuccess: (data) => setRecipient(data),
          onError: () => setRecipient(null),
        },
      );
    } else {
      setRecipient(null);
    }
  }, [debouncedDisplayValue, hasReceiverPreset]);

  // --- Confirmation & PIN Logic ---
  const handleConfirmTransfer = () => {
    const numericAmount = parseFloat(amount);
    if (!recipient) return toast.error("กรุณาค้นหาผู้รับโอนให้พบก่อน");
    if (isNaN(numericAmount) || numericAmount <= 0)
      return toast.error("กรุณาระบุจำนวนเงินที่ถูกต้อง");
    if (numericAmount > userData.wallet.balance) return toast.error("ยอดเงินของคุณไม่เพียงพอ");

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

  // --- Derived States for UI ---
  const isSearching = hasReceiverPreset ? false : searchRecipientMutation.isPending;
  const isButtonDisabled =
    !recipient || !amount || parseFloat(amount) <= 0 || isSearching || transferMutation.isPending;
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
        className="bg-bg-dark/80 fixed inset-0 z-20 flex flex-col backdrop-blur-xl"
      >
        <header className="flex items-center px-4 pt-10 pb-4">
          <button
            onClick={handleCancel}
            className="p-2 text-white/80 transition-colors hover:text-white"
          >
            <ChevronLeft size={28} />
          </button>
          <h2 className="from-primary-pink to-primary-orange flex-grow bg-gradient-to-r bg-clip-text text-center text-xl font-bold text-transparent">
            โอนเงิน
          </h2>
          <div className="w-10" />
        </header>

        <div className="flex h-full flex-col gap-6 rounded-t-3xl bg-white p-6">
          <div className="rounded-xl bg-slate-100 p-3 text-center text-sm text-slate-600">
            ยอดเงินที่ใช้ได้
            <span className="ml-2 font-bold text-slate-800">
              ฿{balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>

          {!hasReceiverPreset ? (
            <div>
              <label className="text-sm font-bold text-slate-500">
                ค้นหาผู้รับด้วยเบอร์โทรศัพท์ หรือ Wallet ID
              </label>
              <div className="relative mt-2">
                <Search className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  value={displayValue}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="เบอร์โทร หรือกรอกเลข Wallet ID"
                  className="w-full rounded-xl border-2 border-slate-200 p-4 pl-12 font-semibold text-slate-800 focus:ring-2 focus:ring-pink-400"
                />
                {isSearching && (
                  <LoaderCircle className="absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 animate-spin text-pink-500" />
                )}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm font-bold text-slate-500">ผู้รับ (จากการสแกน)</p>
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
                    <p className="text-xs text-gray-500">เบอร์โทร: {receiverData.phone}</p>
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
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                {!hasReceiverPreset && (
                  <div>
                    <p className="text-sm font-bold text-slate-500">โอนไปยัง</p>
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
                          <p className="text-xs text-gray-500">เบอร์โทร: {recipient.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="text-sm font-bold text-slate-500">จำนวนเงิน</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
              placeholder="฿0.00"
              className="mt-2 w-full rounded-xl border-2 border-slate-200 p-4 text-lg font-bold text-slate-800 focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div className="mt-auto flex justify-center pt-4">
            <CtaButton
              onClick={handleConfirmTransfer}
              disabled={isButtonDisabled}
              className={"w-48 rounded-xl p-4 text-base font-bold"}
            >
              ต่อไป
            </CtaButton>
          </div>
        </div>
      </FramerDiv>
    </>
  );
}
