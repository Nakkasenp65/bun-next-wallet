"use client";

import { FaDownload, FaXmark, FaEnvelope, FaCalendar } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import CtaButton from "../ui/CtaButton";
import axios from "@/lib/axios";

const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
const toInputDate = (d) =>
  new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || "");

export default function DownloadModal({
  open,
  onClose,
  walletId,
  defaultMonthDate, // use currently viewed month as default
}) {
  // defaults to the visible month's start/end
  const defaultStart = useMemo(
    () => startOfMonth(defaultMonthDate),
    [defaultMonthDate],
  );
  const defaultEnd = useMemo(
    () => endOfMonth(defaultMonthDate),
    [defaultMonthDate],
  );

  const [email, setEmail] = useState("");
  const [startDate, setStartDate] = useState(toInputDate(defaultStart));
  const [endDate, setEndDate] = useState(toInputDate(defaultEnd));
  const [submitting, setSubmitting] = useState(false);
  const [preset, setPreset] = useState("custom");

  const invalidRange = new Date(startDate) > new Date(endDate);

  const submit = async () => {
    try {
      setSubmitting(true);
      const payload = {
        walletId,
        email,
        startDate,
        endDate,
      };
      const t = toast.loading("กำลังเตรียมรายงาน…");
      await axios.post("/transaction/export", payload); // implement server later
      toast.dismiss(t);
      toast.success(`ส่งคำขอเรียบร้อย เราจะส่งไปที่ ${email}`);
      onClose();
    } catch (e) {
      console.error(e);
      toast.error("ไม่สามารถส่งคำขอรายงานได้");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="w-full max-w-lg overflow-hidden rounded-t-2xl bg-white shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-label="ขอรายการเดินบัญชี"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div className="flex items-center gap-2 text-gray-700">
                <FaDownload className="text-primary-pink" />
                <h3 className="text-base font-extrabold">ขอรายการเดินบัญชี</h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800"
              >
                <FaXmark className="text-xl" />
              </button>
            </div>

            <div className="space-y-4 px-5 py-4">
              {/* email */}
              <div>
                <label className="mb-1.5 block text-sm font-bold text-gray-600">
                  อีเมลที่จะรับไฟล์
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
                    placeholder="name@example.com"
                    className="text-bg-dark w-full rounded-xl border border-gray-300 p-3 pl-9 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                  />
                </div>
                {!isEmail(email) && email.length > 0 && (
                  <p className="mt-1 text-xs text-red-500">
                    รูปแบบอีเมลไม่ถูกต้อง
                  </p>
                )}
              </div>

              {/* presets */}
              <div>
                {/* custom dates */}
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-gray-500">
                      ตั้งแต่วันที่
                    </label>
                    <div className="relative">
                      <FaCalendar className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => {
                          setStartDate(e.target.value);
                          setPreset("custom");
                        }}
                        className="text-bg-dark w-full rounded-xl border border-gray-300 p-2.5 pl-9 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold text-gray-500">
                      ถึงวันที่
                    </label>
                    <div className="relative">
                      <FaCalendar className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => {
                          setEndDate(e.target.value);
                          setPreset("custom");
                        }}
                        className="text-bg-dark w-full rounded-xl border border-gray-300 p-2.5 pl-9 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                      />
                    </div>
                  </div>
                </div>
                {invalidRange && (
                  <p className="mt-1 text-xs font-semibold text-red-500">
                    ช่วงเวลาไม่ถูกต้อง
                  </p>
                )}
              </div>
            </div>

            {/* footer */}
            <div className="flex items-center justify-end gap-3 border-t px-5 py-4">
              <button
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                ยกเลิก
              </button>
              <CtaButton
                onClick={submit}
                disabled={!email}
                className="z-10 w-48 rounded-xl p-4 text-base font-bold disabled:opacity-60"
              >
                {submitting ? "กำลังส่ง…" : "ส่งรายงานไปที่อีเมล"}
              </CtaButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
