"use client";

import React, { useEffect, useRef } from "react";
import { FaPhone, FaFacebook } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { BsLine } from "react-icons/bs";
import FramerDiv from "../framerComponents/FramerDiv";
import { useLiff } from "../provider/LiffProvider";
import DisposeFramerDiv from "../framerComponents/DisposeFramerDiv";
import { Variants } from "framer-motion";

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
  const { actions } = useLiff();

  const handleLineAction = async () => {
    actions.text("ติดต่อเจ้าหน้าที่");
    actions.closeWindow();
  };

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

  const slideUpVariants: Variants = {
    hidden: {
      y: "100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    visible: {
      y: "0%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <DisposeFramerDiv
      isOpen={showContact}
      className="fixed inset-0 z-50 flex items-end justify-center"
      variants={slideUpVariants}
    >
      {/* ✅ Modal Bottom Sheet */}
      <div
        ref={modalRef}
        className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-[0_-2px_12px_rgba(0,0,0,0.15)]"
      >
        <div className="text-center">
          <h1 className="text-bg-dark text-xl font-bold">
            ติดต่อ บริษัท โอเค นัมเบอร์วัน
          </h1>
          <p className="mt-1 text-sm text-gray-600">เราพร้อมให้ความช่วยเหลือ</p>
        </div>

        <div className="mt-6 space-y-3 border-t pt-4">
          <div className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-gray-100">
            <BsLine className="text-primary-pink w-5 text-xl" />
            <div className="flex w-full items-center justify-between gap-2">
              <p className="font-semibold text-gray-800">LINE Official</p>
              <button
                onClick={handleLineAction}
                className="bg-primary-pink rounded-md p-2 text-xs font-bold text-white"
              >
                ติดต่อเจ้าหน้าที่ {"(แชท)"}
              </button>
            </div>
          </div>
          <a
            href={"tel:021234567"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-gray-100"
          >
            <FaPhone className="text-primary-pink w-5 text-xl" />
            <div className="flex w-full items-center justify-between gap-2">
              <p className="font-semibold text-gray-800">โทรศัพท์: </p>
              <p className="text-md text-black">02-123-4567</p>
            </div>
          </a>
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
    </DisposeFramerDiv>
  );
}
