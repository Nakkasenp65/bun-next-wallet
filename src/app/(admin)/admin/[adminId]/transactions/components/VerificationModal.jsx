"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Loader2, Calendar, Edit3, Save, LinkIcon } from "lucide-react";
import toast from "react-hot-toast";

// --- Helper Components ---
const InfoRow = ({ icon, label, value, valueClassName = "text-slate-800" }) => (
  <div className="flex items-start gap-3 text-sm">
    <div className="mt-0.5 flex-shrink-0 text-slate-400">{icon}</div>
    <div className="flex-grow">
      <p className="text-slate-500">{label}</p>
      <p className={`font-semibold ${valueClassName}`}>{value}</p>
    </div>
  </div>
);

// [MODIFIED] เพิ่ม prop 'type' เพื่อรองรับ input ที่เป็น number
const EditableField = ({
  label,
  value,
  name,
  onChange,
  isEditing,
  type = "text",
}) => (
  <div className="text-sm">
    <p className="text-slate-500">{label}</p>
    {isEditing ? (
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full rounded-md border border-slate-300 px-2 py-1 font-semibold text-slate-800 focus:ring-2 focus:ring-pink-400 focus:outline-none"
      />
    ) : (
      <p className="font-semibold text-slate-800">
        {type === "number" && value != null
          ? Number(value).toLocaleString()
          : value}
      </p>
    )}
  </div>
);

export default function VerificationModal({
  transaction,
  onClose,
  onUpdate,
  isProcessing,
}) {
  const [formState, setFormState] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (transaction) {
      setFormState({
        amount: transaction.amount ?? "", // ใช้ ?? เพื่อรองรับค่า 0
        from: transaction.from || "",
        to: transaction.to || "",
        description: transaction.description || "",
        status: transaction.status || "PENDING",
        type: transaction.type || "INCOME",
      });
      setIsEditing(false);
    }
  }, [transaction]);

  if (!transaction) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleApproveClick = () => {
    const amount = Number(formState.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("กรุณากรอกจำนวนเงินที่ถูกต้อง");
      return;
    }
    const payload = {
      status: "SUCCESS",
      amount: amount,
      description: `รายการได้รับการอนุมัติยอดเงิน ${amount} บาทโดยผู้ดูแล`,
    };
    onUpdate({ transactionId: transaction.id, payload });
  };

  const handleRejectClick = () => {
    const payload = {
      status: "REJECTED",
      description: "รายการถูกปฏิเสธโดยผู้ดูแลระบบ",
    };
    onUpdate({ transactionId: transaction.id, payload });
  };

  // [MODIFIED] เพิ่ม 'amount' เข้าไปใน payload ของการอัปเดตทั่วไป
  const handleUpdateClick = () => {
    const payload = {
      from: formState.from,
      to: formState.to,
      description: formState.description,
      status: formState.status,
      type: formState.type,
      amount: Number(formState.amount) || 0, // แปลงค่ากลับเป็น Number
    };
    onUpdate({ transactionId: transaction.id, payload });
    setIsEditing(false);
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div
      className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[95vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold text-slate-900">
            รายละเอียดธุรกรรม
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid flex-grow overflow-hidden md:grid-cols-2">
          {/* Left Side: Slip Image */}
          <div className="relative flex h-full min-h-[300px] items-center justify-center bg-slate-100 p-4 md:min-h-0">
            {transaction.slipImageUrl ? (
              <a
                href={transaction.slipImageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center gap-2"
              >
                <Image
                  src={transaction.slipImageUrl}
                  alt="Slip Thumbnail"
                  width={200}
                  height={300}
                  style={{ objectFit: "contain" }}
                  className="max-h-[80%] rounded-lg border shadow-sm"
                />
                <span className="mt-2 inline-flex items-center gap-1.5 font-semibold text-blue-600 transition-colors group-hover:text-blue-800">
                  <LinkIcon size={16} />
                  คลิกเพื่อดูภาพเต็ม
                </span>
              </a>
            ) : (
              <p className="text-slate-500">ไม่มีรูปภาพสลิป</p>
            )}
          </div>

          {/* Right Side: Information & Actions */}
          <div className="flex flex-col overflow-y-auto">
            <div className="space-y-5 p-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-800">
                  รายละเอียดรายการ
                </h4>

                {/* [MODIFIED] ย้าย Amount มาไว้ตรงนี้และทำให้แก้ไขได้เสมอ */}
                <EditableField
                  label="จำนวนเงิน (บาท)"
                  value={formState.amount}
                  name="amount"
                  onChange={handleInputChange}
                  isEditing={isEditing}
                  type="number"
                />

                <EditableField
                  label="ผู้ทำรายการ (From)"
                  value={formState.from}
                  name="from"
                  onChange={handleInputChange}
                  isEditing={isEditing}
                />
                <EditableField
                  label="ผู้รับรายการ (To)"
                  value={formState.to}
                  name="to"
                  onChange={handleInputChange}
                  isEditing={isEditing}
                />
                <div className="text-sm">
                  <p className="text-slate-500">สถานะ</p>
                  {isEditing ? (
                    <select
                      name="status"
                      value={formState.status}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-slate-300 px-2 py-1.5 font-semibold text-slate-800 focus:ring-2 focus:ring-pink-400 focus:outline-none"
                    >
                      <option value="PENDING">รอตรวจสอบ</option>
                      <option value="SUCCESS">สำเร็จ</option>
                      <option value="REJECTED">ปฏิเสธ</option>
                      <option value="CANCELLED">ยกเลิก</option>
                    </select>
                  ) : (
                    <p className="font-semibold text-slate-800">
                      {transaction.status}
                    </p>
                  )}
                </div>
                <div className="text-sm">
                  <p className="text-slate-500">ประเภท</p>
                  {isEditing ? (
                    <select
                      name="type"
                      value={formState.type}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-slate-300 px-2 py-1.5 font-semibold text-slate-800 focus:ring-2 focus:ring-pink-400 focus:outline-none"
                    >
                      <option value="INCOME">รายรับ</option>
                      <option value="OUTCOME">รายจ่าย</option>
                      <option value="REWARD">รางวัล</option>
                    </select>
                  ) : (
                    <p className="font-semibold text-slate-800">
                      {transaction.type}
                    </p>
                  )}
                </div>
                <EditableField
                  label="คำอธิบาย"
                  value={formState.description}
                  name="description"
                  onChange={handleInputChange}
                  isEditing={isEditing}
                />
                <InfoRow
                  icon={<Calendar size={16} />}
                  label="สร้างเมื่อ"
                  value={formatDate(transaction.createdAt)}
                />
              </div>

              {/* [REMOVED] ลบ Section ตรวจสอบที่ซ้ำซ้อนออกไป */}
            </div>
            <div className="flex-grow"></div> {/* Spacer */}
            {/* Footer with Action Buttons */}
            <div className="flex flex-shrink-0 items-center justify-between border-t bg-slate-50 p-4">
              <div>
                {isEditing ? (
                  <button
                    className="flex items-center gap-2 rounded-lg bg-pink-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-pink-700 disabled:opacity-50"
                    onClick={handleUpdateClick}
                    disabled={isProcessing}
                  >
                    <Save size={16} /> บันทึก
                  </button>
                ) : (
                  <button
                    className="flex items-center gap-2 rounded-lg bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-300"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 size={16} /> แก้ไข
                  </button>
                )}
              </div>

              {/* ส่วนของปุ่ม Approve/Reject ยังคงอยู่เหมือนเดิม และจะแสดงเมื่อสถานะเป็น PENDING เท่านั้น */}
              {transaction.status === "PENDING" && (
                <div className="flex items-center gap-3">
                  <button
                    disabled={isProcessing}
                    onClick={handleRejectClick}
                    className="rounded-lg bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    ปฏิเสธ
                  </button>
                  <button
                    disabled={isProcessing || !formState.amount}
                    onClick={handleApproveClick}
                    className="flex min-w-[110px] items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "อนุมัติรายการ"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
