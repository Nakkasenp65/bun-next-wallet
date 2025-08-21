"use client";

import DropDownComponent from "@/components/Ui/DropDownComponent";
import { Loader2, Save, X } from "lucide-react";

const { useEffect, useState } = require("react");

export default function ProductFormModal({
  open,
  initial,
  onClose,
  onSubmit,
  isProcessing,
}) {
  const [form, setForm] = useState({});
  const [otherColor, setOtherColor] = useState("");

  const commonColors = [
    { label: "ดำ", value: "ดำ" },
    { label: "ขาว", value: "ขาว" },
    { label: "เงิน", value: "เงิน" },
    { label: "ทอง", value: "ทอง" },
    { label: "น้ำเงิน", value: "น้ำเงิน" },
    { label: "เขียว", value: "เขียว" },
    { label: "แดง", value: "แดง" },
    { label: "ม่วง", value: "ม่วง" },
    { label: "ชมพู", value: "ชมพู" },
    { label: "เทา", value: "เทา" },
    { label: "ฟ้า", value: "ฟ้า" },
    { label: "เหลือง", value: "เหลือง" },
    { label: "ส้ม", value: "ส้ม" },
    { label: "น้ำตาล", value: "น้ำตาล" },
    { label: "ธรรมชาติ", value: "ธรรมชาติ" },
    { label: "ทะเลทราย", value: "ทะเลทราย" },
    { label: "อื่นๆ", value: "OTHER" },
  ];
  const conditionOptions = [
    { label: "มือหนึ่ง", value: "มือหนึ่ง" },
    { label: "มือสอง", value: "มือสอง" },
  ];

  useEffect(() => {
    const initialData = initial || {
      brand: "",
      model: "",
      capacity: "",
      color: "",
      downPaymentAmount: 0,
      price: 0,
      imageUrl: "",
      condition: "มือหนึ่ง",
    };
    setForm(initialData);

    if (
      initialData.color &&
      !commonColors.some((c) => c.value === initialData.color)
    ) {
      setForm((prev) => ({ ...prev, color: "OTHER" }));
      setOtherColor(initialData.color);
    } else {
      setOtherColor("");
    }
  }, [initial, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    const isNumeric = [
      "downPaymentAmount",
      "price",
      "installment6Months",
      "installment10Months",
    ].includes(name);
    setForm((s) => ({ ...s, [name]: isNumeric ? Number(value) : value }));
  };
  const handleDropdownChange = (name, value) =>
    setForm((s) => ({ ...s, [name]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.brand?.trim() || !form.model?.trim())
      return alert("กรุณากรอกยี่ห้อและรุ่น");
    const finalColor = form.color === "OTHER" ? otherColor.trim() : form.color;
    onSubmit({ ...form, color: finalColor });
  };

  return (
    <div
      className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl bg-white shadow-xl"
        role="dialog"
      >
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between border-b p-4">
            <h3 className="text-lg font-semibold text-slate-900">
              {initial ? "แก้ไขสินค้า" : "สร้างสินค้าใหม่"}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
              aria-label="ปิด"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid max-h-[80vh] grid-cols-1 gap-4 overflow-y-auto p-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-sm text-slate-600">ยี่ห้อ (Brand)</label>
              <input
                name="brand"
                value={form.brand || ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-slate-600">รุ่น (Model)</label>
              <input
                name="model"
                value={form.model || ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="text-sm text-slate-600">
                ความจุ (Capacity)
              </label>
              <input
                name="capacity"
                value={form.capacity || ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <DropDownComponent
                label="สภาพ"
                name="condition"
                value={form.condition}
                onChange={(v) => handleDropdownChange("condition", v)}
                options={conditionOptions}
                buttonClassName="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <DropDownComponent
                label="สี"
                name="color"
                value={form.color}
                onChange={(v) => handleDropdownChange("color", v)}
                options={commonColors}
                buttonClassName="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            {form.color === "OTHER" && (
              <div>
                <label className="text-sm text-slate-600">ระบุสีอื่นๆ</label>
                <input
                  value={otherColor}
                  onChange={(e) => setOtherColor(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
            )}
            <div>
              <label className="text-sm text-slate-600">ราคาดาวน์ (บาท)</label>
              <input
                type="number"
                name="downPaymentAmount"
                value={form.downPaymentAmount || ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                required
                min={0}
              />
            </div>
            <div>
              <label className="text-sm text-slate-600">ราคาเต็ม (บาท)</label>
              <input
                type="number"
                name="price"
                value={form.price || ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                min={0}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-slate-600">Image URL</label>
              <input
                name="imageUrl"
                value={form.imageUrl || ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 border-t bg-slate-50 p-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex min-w-[120px] items-center justify-center rounded-lg bg-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-110 disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Save className="h-4 w-4" /> บันทึก
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
