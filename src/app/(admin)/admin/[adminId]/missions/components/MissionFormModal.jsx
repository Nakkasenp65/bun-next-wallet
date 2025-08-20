import { X } from "lucide-react";
import { useEffect, useState } from "react";

export default function MissionFormModal({
  open,
  initial,
  onClose,
  onSubmit,
  isProcessing,
}) {
  const [form, setForm] = useState({});

  useEffect(() => {
    const initialState = initial || {
      title: "",
      description: "",
      type: "STREAK",
      rewardAmount: 0,
      durationDays: 7,
      completeProgress: 1,
      webExpiresAt: "",
    };
    // Format datetime-local correctly from ISO string
    if (initialState.webExpiresAt) {
      const localDate = new Date(initialState.webExpiresAt);
      localDate.setMinutes(
        localDate.getMinutes() - localDate.getTimezoneOffset(),
      );
      initialState.webExpiresAt = localDate.toISOString().slice(0, 16);
    }
    setForm(initialState);
  }, [initial, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({
      ...s,
      [name]: ["rewardAmount", "durationDays", "completeProgress"].includes(
        name,
      )
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      webExpiresAt: form.webExpiresAt
        ? new Date(form.webExpiresAt).toISOString()
        : null,
    };
    onSubmit(payload);
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
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold text-slate-900">
            {initial ? "แก้ไขภารกิจ" : "สร้างภารกิจใหม่"}
          </h3>
          <p className="">{/* -อธิบายภารกิจ- */}</p>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
            aria-label="ปิด"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="grid max-h-[80vh] grid-cols-1 gap-4 overflow-y-auto p-6 md:grid-cols-2"
        >
          <div className="md:col-span-2">
            <label className="text-sm text-slate-600">ชื่อภารกิจ</label>
            <input
              name="title"
              value={form.title || ""}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-slate-600">คำอธิบาย</label>
            <textarea
              name="description"
              value={form.description || ""}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">ประเภท</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
            >
              {["ONBOARDING", "ACCUMULATION", "STREAK", "REFERRAL"].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-600">รางวัล (บาท)</label>
            <input
              type="number"
              name="rewardAmount"
              value={form.rewardAmount || ""}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
              min={0}
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">ระยะเวลา (วัน)</label>
            <input
              type="number"
              name="durationDays"
              value={form.durationDays || ""}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
              min={1}
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">เป้าความคืบหน้า</label>
            <input
              type="number"
              name="completeProgress"
              value={form.completeProgress || ""}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
              min={1}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-slate-600">วันหมดอายุบนเว็บ</label>
            <input
              type="datetime-local"
              name="webExpiresAt"
              value={form.webExpiresAt || ""}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-4 md:col-span-2">
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
              className="flex min-w-[160px] items-center justify-center rounded-lg bg-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-110 disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : initial ? (
                "บันทึกการเปลี่ยนแปลง"
              ) : (
                "สร้างภารกิจ"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
