"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faUser,
  faPhone,
  faBriefcase,
  faBirthdayCake,
} from "@fortawesome/free-solid-svg-icons";
import CtaButton from "../Ui/CtaButton";
import { useRouter } from "next/navigation";
import DropDownComponent from "../Ui/DropDownComponent";

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

export default function EditProfileUI({ user, onSave, isSaving }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    occupation: "",
    ageRange: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname || "",
        phone: user.phone || "",
        occupation: user.occupation || "",
        ageRange: user.ageRange || "",
      });
    }
  }, [user]);

  // This handler is now only for text inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-gray-50">
      {/* Header */}
      <header className="flex flex-shrink-0 items-center px-5 pt-10 pb-4">
        <button
          onClick={() => router.back()}
          className="text-bg-dark text-2xl transition-colors hover:text-gray-800"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <h2 className="flex-grow text-center text-xl font-bold text-gray-800">
          แก้ไขข้อมูลส่วนตัว
        </h2>
        <div className="w-6"></div>
      </header>

      {/* Form Content */}
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
            <FontAwesomeIcon
              icon={faPhone}
              className="text-bg-dark absolute top-1/2 left-4 -translate-y-1/2"
            />
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
    </div>
  );
}
