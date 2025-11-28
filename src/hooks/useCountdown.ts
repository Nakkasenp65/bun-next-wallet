import { useState, useEffect } from "react";

/**
 * ฟังก์ชันสำหรับเติมเลข 0 ข้างหน้าตัวเลขที่น้อยกว่า 10
 * @param {number} num - ตัวเลข
 * @returns {string} - String ของตัวเลข (เช่น 7 -> "07")
 */
const padZero = (num: number): string => num.toString().padStart(2, "0");

/**
 * Hook สำหรับนับเวลาถอยหลังไปยังวันเวลาที่กำหนด
 * @param {string | Date} expiryTimestamp - เวลาที่จะนับถอยหลังไปหา
 * @returns {{timeLeft: string, isCounting: boolean}} - Object ที่มีเวลาที่เหลือในรูปแบบ string และสถานะว่ากำลังนับหรือไม่
 */
const useCountdown = (expiryTimestamp: string | Date | null | undefined) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [isCounting, setIsCounting] = useState(false);

  useEffect(() => {
    if (!expiryTimestamp) {
      setTimeLeft("");
      setIsCounting(false);
      return;
    }

    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(expiryTimestamp).getTime();
      const distance = expiry - now;

      if (distance < 0) {
        clearInterval(intervalId);
        setTimeLeft("หมดเวลา");
        setIsCounting(false);
        return;
      }

      setIsCounting(true);

      // คำนวณ วัน, ชั่วโมง, นาที, วินาที
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // --- Logic การแสดงผลแบบไดนามิก ---
      if (days > 0) {
        // ถ้าเหลือเวลามากกว่า 1 วัน, แสดงแค่ "X วัน Y ชั่วโมง"
        setTimeLeft(`${days} วัน ${hours} ชม.`);
      } else {
        // ถ้าเหลือเวลาน้อยกว่า 1 วัน, แสดง "HH:MM:SS"
        setTimeLeft(
          `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`,
        );
      }
    }, 1000); // อัปเดตทุกๆ 1 วินาที

    // Cleanup function: หยุด interval เมื่อ component unmount หรือ expiryTimestamp เปลี่ยน
    return () => clearInterval(intervalId);
  }, [expiryTimestamp]);

  return { timeLeft, isCounting };
};

export default useCountdown;
