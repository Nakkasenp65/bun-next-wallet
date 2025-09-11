"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FaUserEdit,
  FaBell,
  FaQuestionCircle,
  FaSignOutAlt,
  FaShareAlt,
  FaCopy,
  FaChevronLeft, // 1. Import the back icon
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import MenuItem from "./MenuItem";
import { useLiff } from "../provider/LiffProvider";
import { PhoneCallIcon } from "lucide-react";
import DropDownComponent from "../Ui/DropDownComponent";
import CtaButton from "../Ui/CtaButton";
import { useGetUser, useUpdateUser } from "../../hooks/useUser";

const OCCUPATION_OPTIONS = [
  { value: "นักศึกษา", label: "นักศึกษา" },
  { value: "ข้าราชการ / เจ้าหน้าที่รัฐ", label: "ข้าราชการ / เจ้าหน้าที่รัฐ" },
  { value: "พนักงานบริษัท", label: "พนักงานบริษัท" },
  {
    value: "ธุรกิจส่วนตัว / ค้าขาย",
    label: "ธุรกิจส่ธุรกิจส่วนตัว / ค้าขายวนตัว",
  },
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
  { value: "41-50", label: "41-50" },
  { value: "51-60", label: "51-60" },
];

const formatJoinDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function Profile({ user }) {
  const { actions } = useLiff();
  const { mutate: updateUser, isPending: isSaving } = useUpdateUser();
  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    occupation: "",
    ageRange: "",
  });

  const router = useRouter();
  const [copyButtonText, setCopyButtonText] = useState("คัดลอก");

  // ... handleCopyReferral and variants (remain the same) ...
  const handleCopyReferral = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopyButtonText("คัดลอกแล้ว!");
    toast.success("คัดลอกรหัสแนะนำแล้ว!");
    setTimeout(() => {
      setCopyButtonText("คัดลอก");
    }, 2000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    handleSave(formData);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex min-h-dvh flex-col bg-gray-50">
      {/* --- 2. Updated Header --- */}
      <header className="from-primary-pink to-primary-orange sticky top-0 z-10 flex items-center justify-between bg-gradient-to-br px-5 pt-10 pb-4 text-white shadow-lg">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="text-2xl transition-transform hover:scale-110"
        >
          <FaChevronLeft />
        </button>

        {/* Title */}
        <h1 className="text-xl font-bold text-white drop-shadow-md">
          โปรไฟล์ของฉัน
        </h1>

        {/* Spacer to keep title centered */}
        <div className="w-6"></div>
      </header>

      {/* Profile Content (remains the same) */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-4 p-4"
      >
        {/* User Info Card */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm"
        >
          <Image
            src={user.line_profile_url}
            alt={user.line_display_name}
            width={64}
            height={64}
            className="rounded-full border-2 border-white shadow-md"
          />
          <div className="flex-grow">
            <p className="text-lg font-bold text-gray-800">
              {user.line_display_name}
            </p>
            <p className="text-xs text-gray-500">
              เป็นสมาชิกเมื่อ: {formatJoinDate(user.createdAt)}
            </p>
          </div>
        </motion.div>

        {/* Referral Code Card */}
        <motion.div
          variants={itemVariants}
          className="rounded-xl bg-white p-4 shadow-sm"
        >
          <div className="mb-2 flex items-center gap-2 font-semibold text-gray-700">
            <FaShareAlt className="text-primary-pink" />
            <span>รหัสแนะนำเพื่อนของคุณ</span>
          </div>
          <div className="flex items-center justify-between gap-2 rounded-lg bg-gray-100 p-3">
            <span className="text-lg font-bold tracking-widest text-purple-700">
              {user.referralCode}
            </span>
            <button
              onClick={handleCopyReferral}
              className="flex items-center gap-2 rounded-md bg-purple-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-purple-600"
            >
              <FaCopy />
              <span>{copyButtonText}</span>
            </button>
          </div>
        </motion.div>

        {/* Menu List */}
        <motion.div
          variants={itemVariants}
          className="overflow-hidden rounded-xl bg-white shadow-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-grow flex-col gap-6 p-6"
          >
            {/* Input: Phone */}
            <div>
              <label className="text-bg-dark mb-2 block text-sm font-bold">
                เบอร์โทรศัพท์
              </label>
              <div className="relative">
                <PhoneCallIcon className="text-bg-dark absolute top-1/2 left-4 -translate-y-1/2" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="text-bg-dark w-full rounded-xl border border-gray-300 p-4 pl-12 outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
            </div>

            {/* --- 3. Replace the native select with your Dropdown component --- */}
            <DropDownComponent
              buttonClassName="text-bg-dark w-full rounded-xl border border-gray-300 p-4  outline-none focus:ring-2 focus:ring-pink-400"
              labelClassName="text-bg-dark mb-2 block text-sm font-bold"
              label="อาชีพ"
              placeholder="เลือกอาชีพของคุณ"
              options={OCCUPATION_OPTIONS}
              value={formData.occupation}
              onChange={(selectedValue) =>
                setFormData((prev) => ({
                  ...prev,
                  occupation: selectedValue,
                }))
              }
            />

            <DropDownComponent
              label="ช่วงอายุ"
              buttonClassName="text-bg-dark w-full rounded-xl border border-gray-300 p-4  outline-none focus:ring-2 focus:ring-pink-400"
              labelClassName="text-bg-dark mb-2 block text-sm font-bold"
              placeholder="เลือกช่วงอายุของคุณ"
              options={AGE_RANGE_OPTIONS}
              value={formData.ageRange}
              onChange={(selectedValue) =>
                setFormData((prev) => ({ ...prev, ageRange: selectedValue }))
              }
            />

            {/* CTA Button */}
            <div className="mt-auto flex justify-center pt-4">
              <CtaButton
                onClick={handleSave}
                disabled={isSaving}
                className={"z-10 w-48 rounded-xl p-4 text-base font-bold"}
              >
                {isSaving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
              </CtaButton>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
