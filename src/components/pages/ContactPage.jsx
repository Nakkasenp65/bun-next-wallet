"use client";

import React, { useEffect, useRef } from "react";
import { FaPhone, FaFacebook } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { BsLine } from "react-icons/bs";
import FramerDiv from "../framerComponents/FramerDiv";

const ContactItem = ({ icon: IconComponent, title, value, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-gray-100"
  >
    <IconComponent className="text-primary-pink w-5 text-xl" />
    <div>
      <p className="font-semibold text-gray-800">{title}</p>
      <p className="text-sm text-gray-500">{value}</p>
    </div>
  </a>
);

export default function ContactPage({ showContact, setShowContact }) {
  const modalRef = useRef(null);

  // ✅ ตรวจจับการคลิกนอก modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowContact(false);
      }
    };

    if (showContact) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showContact]);

  return (
    <FramerDiv isOpen={showContact} className="fixed inset-0 z-50 flex items-end justify-center">
      {/* ✅ Modal Bottom Sheet */}
      <div ref={modalRef} className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-[0_-2px_12px_rgba(0,0,0,0.15)]">
        <div className="text-center">
          <h1 className="text-bg-dark text-xl font-bold">ติดต่อ บริษัท โอเค นัมเบอร์วัน</h1>
          <p className="mt-1 text-sm text-gray-600">เราพร้อมให้ความช่วยเหลือ</p>
        </div>

        <div className="mt-6 space-y-3 border-t pt-4">
          <ContactItem icon={FaPhone} title="โทรศัพท์" value="02-123-4567" href="tel:021234567" />
          <ContactItem icon={MdEmail} title="อีเมล" value="contact@oknumberone.co.th" href="mailto:contact@oknumberone.co.th" />
          <ContactItem icon={BsLine} title="LINE Official" value="@oknumberone" href="https://line.me/ti/p/~@oknumberone" />
          <ContactItem icon={FaFacebook} title="Facebook" value="OK Number One" href="https://facebook.com/oknumberone" />
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setShowContact(false)}
            className="rounded-lg bg-gray-100 px-6 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-200"
          >
            ปิด
          </button>
        </div>
      </div>
    </FramerDiv>
  );
}
