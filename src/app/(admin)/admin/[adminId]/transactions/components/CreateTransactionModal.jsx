// In /app/admin/transactions/components/CreateTransactionModal.jsx

"use client";

import { useState } from "react";
import { X, Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";
import DropDownComponent from "@/components/Ui/DropDownComponent";

const INITIAL_STATE = {
  name: "",
  amount: "",
  type: "INCOME",
  status: "SUCCESS",
  from: "",
  to: "",
  description: "",
  walletId: "",
};

// 2. เตรียม Options สำหรับ Dropdowns
const typeOptions = [
  { label: "รายรับ", value: "INCOME" },
  { label: "รายจ่าย", value: "OUTCOME" },
  { label: "รางวัล", value: "REWARD" },
];

const statusOptions = [
  { label: "สำเร็จ", value: "SUCCESS" },
  { label: "รอตรวจสอบ", value: "PENDING" },
  { label: "ปฏิเสธ", value: "REJECTED" },
  { label: "ยกเลิก", value: "CANCELLED" },
];

export default function CreateTransactionModal({
  isOpen,
  onClose,
  onCreate,
  isProcessing,
}) {
  const [formState, setFormState] = useState(INITIAL_STATE);

  if (!isOpen) return null;

  // 3. สร้าง Handler กลางที่รองรับทั้ง event และ value โดยตรง
  const handleValueChange = (name, value) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.walletId || !formState.name) {
      toast.error("กรุณากรอกชื่อรายการและ Wallet ID");
      return;
    }
    onCreate(formState, {
      onSuccess: () => {
        setFormState(INITIAL_STATE); // Reset form on success
        onClose();
      },
    });
  };

  return (
    <div
      className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between border-b p-4">
            <h3 className="text-lg font-semibold text-slate-900">
              สร้างธุรกรรมใหม่
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4 p-6">
            <InputField
              label="ชื่อรายการ (Name)"
              name="name"
              value={formState.name}
              onChange={(e) => handleValueChange(e.target.name, e.target.value)}
              required
            />
            <InputField
              label="Wallet ID (จำเป็น)"
              name="walletId"
              value={formState.walletId}
              onChange={(e) => handleValueChange(e.target.name, e.target.value)}
              required
            />
            {/* 4. แทนที่ SelectField เดิมด้วย DropDownComponent */}
            <div className="grid grid-cols-2 gap-4">
              <DropDownComponent
                label="ประเภท (Type)"
                name="type"
                value={formState.type}
                onChange={(value) => handleValueChange("type", value)}
                options={typeOptions}
                labelClassName="block text-sm font-medium text-slate-600 mb-1"
                buttonClassName="w-full text-left bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <DropDownComponent
                label="สถานะ (Status)"
                name="status"
                value={formState.status}
                onChange={(value) => handleValueChange("status", value)}
                options={statusOptions}
                labelClassName="block text-sm font-medium text-slate-600 mb-1"
                buttonClassName="w-full text-left bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
            <InputField
              label="จำนวนเงิน (Amount)"
              name="amount"
              type="number"
              value={formState.amount}
              onChange={(e) => handleValueChange(e.target.name, e.target.value)}
            />
            <InputField
              label="จาก (From)"
              name="from"
              value={formState.from}
              onChange={(e) => handleValueChange(e.target.name, e.target.value)}
            />
            <InputField
              label="ถึง (To)"
              name="to"
              value={formState.to}
              onChange={(e) => handleValueChange(e.target.name, e.target.value)}
            />
            <TextareaField
              label="คำอธิบาย (Description)"
              name="description"
              value={formState.description}
              onChange={(e) => handleValueChange(e.target.name, e.target.value)}
            />
          </div>

          <div className="flex justify-end border-t bg-slate-50 p-4">
            <button
              type="submit"
              disabled={isProcessing}
              className="flex min-w-[120px] items-center justify-center gap-2 rounded-lg bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-700 disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Save size={16} /> สร้างรายการ
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Helper components for the form (นำ SelectField ออกไป)
const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-slate-600">{label}</label>
    <input
      {...props}
      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-pink-400 focus:outline-none"
    />
  </div>
);

const TextareaField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-slate-600">{label}</label>
    <textarea
      {...props}
      rows={3}
      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-pink-400 focus:outline-none"
    />
  </div>
);
