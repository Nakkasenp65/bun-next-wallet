"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className="absolute top-1/2 right-1 z-10 -translate-y-1/2 transform cursor-pointer rounded-full p-2 text-white/80 transition-all hover:bg-black/50 hover:text-white"
      onClick={onClick}
    >
      <FaChevronRight size={16} />
    </div>
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className="absolute top-1/2 left-1 z-10 -translate-y-1/2 transform cursor-pointer rounded-full p-2 text-white/80 transition-all hover:bg-black/50 hover:text-white"
      onClick={onClick}
    >
      <FaChevronLeft size={16} />
    </div>
  );
}

// --- Main Slider Component ---
export default function MissionSlider({ children }) {
  const settings = {
    dots: true, // เปิดใช้งาน Dots
    arrows: true, // เปิดใช้งานลูกศร
    infinite: true, // ไม่วนลูป เพราะอันสุดท้ายเป็น "ดูทั้งหมด"
    speed: 300,
    autoplaySpeed: 5000,
    autoplay: true,
    slidesToShow: 1, // แสดงทีละ 1 สไลด์แบบเต็มๆ
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return <Slider {...settings}>{children}</Slider>;
}
