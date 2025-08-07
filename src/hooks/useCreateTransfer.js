import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import toast from "react-hot-toast";

/**
 * ฟังก์ชันสำหรับส่ง request ไปยัง backend เพื่อสร้าง Transaction ใหม่
 * ฟังก์ชันนี้จะถูกเรียกใช้โดย useMutation และจะได้รับ FormData เป็น argument โดยตรง
 * @param {FormData} formData - FormData object ที่มีข้อมูลทั้งหมดจาก DepositPage
 * @returns {Promise<any>} - ข้อมูลที่ได้กลับมาจาก API หลังสร้าง Transaction สำเร็จ
 */
const createSavingTransactionRequest = async (formData) => {
  const { data } = await axios.post(`/transaction/`, formData);
  return data;
};

/**
 * Custom Hook สำหรับจัดการการสร้าง Saving Transaction
 * @param {object} options - Options object
 * @param {Function} options.onSuccessCallback - ฟังก์ชันที่จะเรียกใช้เมื่อ mutation สำเร็จ (เช่น ปิดหน้าจอ)
 * @returns {object} - The mutation object from useMutation
 */
export function useCreateSavingTransaction({ onSuccessCallback }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSavingTransactionRequest,
    onSuccess: async (data) => {
      toast.success("ส่งสลิปสำเร็จ! รอการตรวจสอบสักครู่");
      await queryClient.invalidateQueries({ queryKey: ["user"] }); // สำหรับอัปเดตยอดเงินใน Wallet
      await queryClient.invalidateQueries({ queryKey: ["transactions"] }); // สำหรับอัปเดตรายการ Transaction
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error) => {
      console.error("Error creating transaction:", error);
      toast.error(
        error.response?.data?.message ||
          "ส่งสลิปไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
      );
    },
  });
}
