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
          <MenuItem
            icon={<FaUserEdit />}
            title="ข้อมูลส่วนตัว"
            subtitle="ดูและแก้ไขข้อมูลของคุณ"
            onClick={() => router.push(`/profile/${user.line_user_id}/edit`)}
          />
          <div className="border-t border-gray-100" />

          <div className="border-t border-gray-100" />
          <MenuItem
            icon={<FaQuestionCircle />}
            title="ศูนย์ช่วยเหลือ"
            subtitle="คำถามที่พบบ่อยและติดต่อเจ้าหน้าที่"
            onClick={() => {
              actions.text("ติดต่อเจ้าหน้าที่");
              actions.closeWindow();
            }}
          />
          <div className="border-t border-gray-100" />
        </motion.div>
      </motion.div>
    </div>
  );
}
