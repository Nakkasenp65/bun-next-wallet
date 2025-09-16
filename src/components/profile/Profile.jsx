"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useUpdateUser } from "../../hooks/useUser";
import CtaButton from "../ui/CtaButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Copy, Share2, Phone, Briefcase, CalendarDays, Pencil } from "lucide-react";

const OCCUPATION_OPTIONS = [
  { value: "นักศึกษา", label: "นักศึกษา" },
  { value: "ข้าราชการ / เจ้าหน้าที่รัฐ", label: "ข้าราชการ / เจ้าหน้าที่รัฐ" },
  { value: "พนักงานบริษัท", label: "พนักงานบริษัท" },
  { value: "ธุรกิจส่วนตัว / ค้าขาย", label: "ธุรกิจส่วนตัว / ค้าขาย" },
  { value: "ฟรีแลนซ์", label: "ฟรีแลนซ์" },
  { value: "แพทย์ / พยาบาล", label: "แพทย์ / พยาบาล" },
  { value: "สถาปนิก / วิศวกร", label: "สถาปนิก / วิศวกร" },
  { value: "นักการตลาด / PR", label: "นักการตลาด / PR" },
  { value: "ศิลปิน / นักออกแบบ", label: "ศิลปิน / นักออกแบบ" },
  { value: "เกษตรกร", label: "เกษตรกร" },
  { value: "อื่นๆ", label: "อื่นๆ" },
];

const AGE_RANGE_OPTIONS = [
  { value: "ต่ำกว่า 15 ปี", label: "ต่ำกว่า 15 ปี" },
  { value: "15-20", label: "15-20 ปี" },
  { value: "21-30", label: "21-30 ปี" },
  { value: "31-40", label: "31-40 ปี" },
  { value: "41-50", label: "41-50 ปี" },
  { value: "51-60", label: "51-60 ปี" },
  { value: "มากกว่า 60 ปี", label: "มากกว่า 60 ปี" },
];

const formatJoinDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const FormField = ({ icon: Icon, label, children }) => (
  <div className="flex flex-col gap-2">
    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
      <Icon className="h-4 w-4 text-slate-500" />
      <span>{label}</span>
    </label>
    {children}
  </div>
);

export default function Profile({ user }) {
  const router = useRouter();
  const { mutate: updateUser, isPending: isSaving } = useUpdateUser();
  const [formData, setFormData] = useState({
    phone: "",
    occupation: "",
    ageRange: "",
    customOccupation: "",
  });
  const [copyButtonText, setCopyButtonText] = useState("คัดลอก");

  useEffect(() => {
    if (user) {
      const isCustomOccupation =
        user.occupation && !OCCUPATION_OPTIONS.some((opt) => opt.value === user.occupation);

      setFormData({
        phone: user.phone || "",
        occupation: isCustomOccupation ? "อื่นๆ" : user.occupation || "",
        ageRange: user.ageRange || "",
        customOccupation: isCustomOccupation ? user.occupation : "",
      });
    }
  }, [user]);

  const handleCopyReferral = () => {
    if (!user?.referralCode) return;
    navigator.clipboard.writeText(user.referralCode);
    setCopyButtonText("คัดลอกแล้ว!");
    toast.success("คัดลอกรหัสแนะนำแล้ว!");
    setTimeout(() => setCopyButtonText("คัดลอก"), 2000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOccupationChange = (value) => {
    setFormData((prev) => {
      const newState = { ...prev, occupation: value };
      if (value !== "อื่นๆ") {
        newState.customOccupation = "";
      }
      return newState;
    });
  };

  const handleSave = () => {
    const { occupation, customOccupation, ...restOfData } = formData;
    const finalOccupation = occupation === "อื่นๆ" ? customOccupation : occupation;
    const payload = { ...restOfData, occupation: finalOccupation };
    const cleanedPayload = Object.fromEntries(Object.entries(payload).filter(([_, v]) => v));

    updateUser({ line_user_id: user.line_user_id, updateData: cleanedPayload });
  };

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  if (!user) {
    return <div className="flex min-h-dvh flex-col bg-slate-50" />;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50">
      <header className="top-0 z-10 flex items-center bg-white/80 px-4 pt-10 pb-4 ring-1 ring-black/5 backdrop-blur-sm">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => router.back()}
          className="rounded-full p-2 text-slate-500 hover:bg-slate-200"
        >
          <ChevronLeft size={24} />
        </motion.button>
        <h1 className="flex-grow text-center text-xl font-bold text-slate-800">โปรไฟล์ของฉัน</h1>
        <div className="w-10" />
      </header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-4 p-4 pb-28"
      >
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-black/5"
        >
          <Image
            src={user.line_profile_url || "/default-avatar.png"}
            alt={user.line_display_name || "User"}
            width={64}
            height={64}
            className="rounded-full"
          />
          <div>
            <p className="text-lg font-bold text-slate-800">{user.line_display_name}</p>
            <p className="text-xs text-slate-500">
              เป็นสมาชิกเมื่อ: {formatJoinDate(user.createdAt)}
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="rounded-2xl bg-white p-4 ring-1 ring-black/5"
        >
          <FormField icon={Share2} label="รหัสแนะนำเพื่อน" />
          <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-3">
            <span className="text-lg font-bold tracking-widest text-slate-700">
              {user.referralCode}
            </span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyReferral}
              className="from-primary-pink to-primary-orange flex items-center gap-2 rounded-md bg-gradient-to-br px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
            >
              <Copy size={12} />
              <span>{copyButtonText}</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="rounded-2xl bg-white p-6 ring-1 ring-black/5"
        >
          <div className="flex flex-col gap-6">
            <FormField icon={Phone} label="เบอร์โทรศัพท์">
              <Input
                type="tel"
                name="phone"
                placeholder="กรอกเบอร์โทรศัพท์ของคุณ"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full rounded-xl border-2 border-slate-200 p-6 font-medium text-slate-800 transition-all focus:ring-2 focus:ring-pink-400"
              />
            </FormField>

            <FormField icon={Briefcase} label="อาชีพ">
              <Select value={formData.occupation} onValueChange={handleOccupationChange}>
                <SelectTrigger className="w-full rounded-xl border-2 border-slate-200 p-6 text-base font-semibold text-slate-800 focus:ring-2 focus:ring-pink-400">
                  <SelectValue placeholder="เลือกอาชีพของคุณ" />
                </SelectTrigger>
                <SelectContent>
                  {OCCUPATION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <AnimatePresence>
              {formData.occupation === "อื่นๆ" && (
                <motion.div
                  key="custom-occupation-field"
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: "-1rem" }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="pt-4"
                >
                  <FormField icon={Pencil} label="โปรดระบุอาชีพ">
                    <Input
                      name="customOccupation"
                      placeholder="กรอกอาชีพของคุณ"
                      value={formData.customOccupation}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border-2 border-slate-200 p-6 font-medium text-slate-800 transition-all focus:ring-2 focus:ring-pink-400"
                      autoFocus
                    />
                  </FormField>
                </motion.div>
              )}
            </AnimatePresence>

            <FormField icon={CalendarDays} label="ช่วงอายุ">
              <Select
                value={formData.ageRange}
                onValueChange={(value) => setFormData((p) => ({ ...p, ageRange: value }))}
              >
                <SelectTrigger className="w-full rounded-xl border-2 border-slate-200 p-6 text-base font-semibold text-slate-800 focus:ring-2 focus:ring-pink-400">
                  <SelectValue placeholder="เลือกช่วงอายุของคุณ" />
                </SelectTrigger>
                <SelectContent>
                  {AGE_RANGE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>
        </motion.div>
      </motion.div>

      <footer className="fixed bottom-0 left-0 z-10 w-full bg-white/80 p-4 pt-3 ring-1 ring-black/5 backdrop-blur-sm">
        <CtaButton
          onClick={handleSave}
          disabled={isSaving}
          className="w-full rounded-xl p-4 text-base font-bold"
        >
          {isSaving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
        </CtaButton>
      </footer>
    </div>
  );
}
