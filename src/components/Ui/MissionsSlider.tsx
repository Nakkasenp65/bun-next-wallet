"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import Slider from "react-slick";


// --- Main Slider Component ---
export default function MissionSlider({ children }) {
  const settings = {
    dots: true, // เปิดใช้งาน Dots
    arrows: false, // ปิดใช้งานลูกศร
    infinite: true, // ไม่วนลูป เพราะอันสุดท้ายเป็น "ดูทั้งหมด"
    speed: 300,
    autoplaySpeed: 5000,
    autoplay: true,
    slidesToShow: 1, // แสดงทีละ 1 สไลด์แบบเต็มๆ
    slidesToScroll: 1,
  };

  return <Slider {...settings}>{children}</Slider>;
}
