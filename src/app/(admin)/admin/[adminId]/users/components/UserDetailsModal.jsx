// In /app/admin/users/components/UserDetailsModal.jsx

"use client";

import React, { useState, useEffect } from "react";
import { useGetUserById } from "@/hooks/useUser";

import {
  Loader2,
  X,
  Edit3,
  Save,
  User,
  ShieldCheck,
  Briefcase,
  Phone,
} from "lucide-react";
import DropDownComponent from "@/components/Ui/DropDownComponent";

// Helper component ที่ยืมมาจาก VerificationModal
const EditableField = ({
  label,
  value,
  name,
  onChange,
  isEditing,
  type = "text",
}) => (
  <div className="py-2">
    <p className="text-sm text-slate-500">{label}</p>
    {isEditing ? (
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-pink-400 focus:outline-none"
      />
    ) : (
      <p className="font-semibold text-slate-800">{value || "-"}</p>
    )}
  </div>
);

export default function UserDetailsModal({
  line_user_id,
  isOpen,
  onClose,
  onUpdate,
  isProcessing,
}) {
  const { data: user, isLoading, isError } = useGetUserById(line_user_id);

  console.log("line-user-id: \n", line_user_id);

  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState({});

  // เมื่อข้อมูล user โหลดเสร็จ ให้ set ค่าลงใน formState
  useEffect(() => {
    if (user) {
      setFormState({
        fullname: user.fullname || "",
        phone: user.phone || "",
        occupation: user.occupation || "",
        role: user.role || "USER",
      });
      // ปิดโหมดแก้ไขทุกครั้งที่เปิด modal ใหม่
      setIsEditing(false);
    }
  }, [user]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleDropdownChange = (name, value) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUpdate(
      { userId, payload: formState },
      {
        onSuccess: () => {
          setIsEditing(false);
          // ไม่ต้อง onClose ที่นี่ ให้หน้าหลักจัดการ
        },
      },
    );
  };

  const roleOptions = [
    { label: "USER", value: "USER" },
    { label: "ADMIN", value: "ADMIN" },
  ];

  return (
    <div
      className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold text-slate-900">
            {isEditing ? "แก้ไขข้อมูลผู้ใช้" : "รายละเอียดผู้ใช้"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {isLoading && (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
            </div>
          )}
          {isError && (
            <div className="h-64 text-center text-red-600">
              ไม่สามารถโหลดข้อมูลได้
            </div>
          )}
          {user && (
            <div>
              {/* Profile Header */}
              <div className="flex items-center gap-4 border-b pb-4">
                <img
                  src={user.line_profile_url || "/placeholder-avatar.png"}
                  alt="Profile"
                  className="h-16 w-16 rounded-full"
                />
                <div>
                  <h4 className="text-xl font-bold text-slate-900">
                    {user.line_display_name}
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    ID: {user.line_user_id}
                  </p>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="pt-4">
                <EditableField
                  label="ชื่อ-นามสกุล"
                  name="fullname"
                  value={formState.fullname}
                  onChange={handleInputChange}
                  isEditing={isEditing}
                />
                <EditableField
                  label="เบอร์โทรศัพท์"
                  name="phone"
                  value={formState.phone}
                  onChange={handleInputChange}
                  isEditing={isEditing}
                />
                <EditableField
                  label="อาชีพ"
                  name="occupation"
                  value={formState.occupation}
                  onChange={handleInputChange}
                  isEditing={isEditing}
                />

                {/* Role Dropdown */}
                <div className="py-2">
                  <p className="text-sm text-slate-500">Role</p>
                  {isEditing ? (
                    <DropDownComponent
                      name="role"
                      value={formState.role}
                      onChange={(value) => handleDropdownChange("role", value)}
                      options={roleOptions}
                      buttonClassName="mt-1 w-full text-left bg-white border border-slate-300 rounded-md px-3 py-1.5 text-sm font-semibold text-slate-800"
                    />
                  ) : (
                    <p className="font-semibold text-slate-800">
                      {formState.role}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-shrink-0 items-center justify-end border-t bg-slate-50 p-4">
          {isEditing ? (
            <button
              onClick={handleSave}
              disabled={isProcessing}
              className="flex items-center gap-2 rounded-lg bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-700 disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Save size={16} /> บันทึกข้อมูล
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-300"
            >
              <Edit3 size={16} /> แก้ไข
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
