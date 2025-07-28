"use client";
import React, { useState } from "react";
import { FaHouse } from "react-icons/fa6";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faIdCard, faQrcode, faFileLines, faHeadset } from "@fortawesome/free-solid-svg-icons";
import NavItem from "./NavItem";
import Link from "next/link";

export default function BottomNav() {
  const [activeNav, setActiveNav] = useState("home");

  const navItems = [
    { id: "home", label: "หน้าแรก", icon: faHouse, url: "/" },
    { id: "my-qr", label: "QR ของฉัน", icon: faIdCard, url: "/myQr" },
    { id: "history", label: "ประวัติ", icon: faFileLines, url: "/history" },
    { id: "contact", label: "ติดต่อ", icon: faHeadset, url: "/contact" },
  ];

  return (
    <nav className="absolute bottom-0 z-10 flex w-full items-center justify-around border-t bg-white/95 pt-2.5 pb-5 shadow-md shadow-black/75 backdrop-blur-lg">
      {/* Left side items */}
      <NavItem
        label={navItems[0].label}
        icon={navItems[0].icon}
        isActive={activeNav === navItems[0].id}
        onClick={() => setActiveNav(navItems[0].id)}
        url={navItems[0].url}
      />
      <NavItem
        label={navItems[1].label}
        icon={navItems[1].icon}
        isActive={activeNav === navItems[1].id}
        onClick={() => setActiveNav(navItems[1].id)}
        url={navItems[1].url}
      />

      {/* Center Scan Button */}
      <Link
        href={"/scan"}
        id="scan-to-pay-btn"
        className="group -mt-9 cursor-pointer"
        onClick={() => setActiveNav("scan")}
      >
        <div className="from-primary-pink to-primary-orange shadow-primary-pink/40 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-gradient-to-r text-3xl text-white shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6">
          <FontAwesomeIcon icon={faQrcode} />
        </div>
      </Link>

      {/* Right side items */}
      <NavItem
        label={navItems[2].label}
        icon={navItems[2].icon}
        isActive={activeNav === navItems[2].id}
        onClick={() => setActiveNav(navItems[2].id)}
        url={navItems[2].url}
      />
      <NavItem
        label={navItems[3].label}
        icon={navItems[3].icon}
        isActive={activeNav === navItems[3].id}
        onClick={() => setActiveNav(navItems[3].id)}
        url={navItems[3].url}
      />
    </nav>
  );
}
