"use client";
import { useEffect, useState } from "react";
import { useSubmitReferral } from "@/hooks/useMission";
import {
  HiOutlineTag,
  HiCheckCircle,
  HiExclamationTriangle,
} from "react-icons/hi2";

export default function ReferralForm({
  newcomerId,
  onSuccess,
  className = "",
}) {
  const [code, setCode] = useState("");
  const { mutate, isPending, error, success } = useSubmitReferral();

  const handleSubmit = (e) => {
    e.preventDefault();
    const referralCode = code.trim().toUpperCase();
    if (!referralCode || !newcomerId) return;
    mutate({ newcomerId, referralCode });
  };

  useEffect(() => {
    if (success && onSuccess) {
      const t = setTimeout(() => onSuccess(), 1200);
      return () => clearTimeout(t);
    }
  }, [success, onSuccess]);

  const disabled = isPending || success;

  return (
    <div
      className={`w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-sm ${className}`}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="from-primary-pink to-primary-orange bg-gradient-to-r bg-clip-text text-lg font-extrabold text-transparent">
          คุณมีรหัสแนะนำเพื่อนใช่ไหม?
        </h3>
        {success ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
            <HiCheckCircle className="h-4 w-4" />
            สำเร็จ
          </span>
        ) : null}
      </div>

      <p className="mb-4 text-sm text-gray-600">
        ก่อนออมเงินคั้งแรก ใส่รหัสแนะนำเพื่อนเลย
      </p>

      {/* Input + Button */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div
          className={`flex items-center gap-2 rounded-xl border px-3 py-2 shadow-sm transition-all focus-within:ring-2 ${
            disabled
              ? "border-gray-200 bg-gray-50"
              : "border-gray-300 bg-white focus-within:border-pink-400 focus-within:ring-pink-200"
          }`}
        >
          <HiOutlineTag
            className={`h-5 w-5 ${disabled ? "text-gray-400" : "text-pink-500"}`}
          />
          <input
            type="text"
            inputMode="text"
            autoCapitalize="characters"
            spellCheck={false}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="เช่น ABC123"
            aria-label="Referral Code"
            disabled={disabled}
            className="text-bg-dark w-2 flex-1 bg-transparent py-1 outline-none placeholder:text-gray-400"
          />
          <button
            type="submit"
            disabled={disabled || !code.trim()}
            className={`w-max rounded-lg px-2 py-2 text-xs font-bold text-nowrap text-white transition-colors ${
              disabled || !code.trim()
                ? "cursor-not-allowed bg-gray-300"
                : "bg-black hover:bg-gray-900"
            }`}
          >
            {isPending
              ? "กำลังยืนยัน…"
              : success
                ? "✓ เรียบร้อย"
                : "ยืนยันโค้ด"}
          </button>
        </div>

        {/* Helper / status */}
        {!success && (
          <div className="flex items-center justify-between text-[10px] text-gray-500">
            <span>ระบบจะเปลี่ยนโค้ดเป็นตัวพิมพ์ใหญ่ให้อัตโนมัติ</span>
            {code && !disabled && (
              <span className="rounded-full bg-pink-50 px-2 py-0.5 font-semibold text-pink-600">
                {code.toUpperCase()}
              </span>
            )}
          </div>
        )}
      </form>

      {/* Error */}
      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">
          <HiExclamationTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <p>
            {error?.response?.data?.message ||
              error?.message ||
              "เกิดข้อผิดพลาดในการยืนยันโค้ด"}
          </p>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-2 text-sm font-medium text-green-700">
          ยอดเยี่ยม! ระบบได้ผูกโค้ดแนะนำเรียบร้อยแล้ว
        </div>
      )}
    </div>
  );
}
