import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import toast from "react-hot-toast";

async function fetchTransactions(year, month, walletId) {
  const response = await axios.get(
    `/transaction/${walletId}?year=${year}&month=${month}`,
  );
  return response.data;
}

async function fetchSuccessTransactions(year, month, walletId) {
  const response = await axios.get(
    `/transaction/success/${walletId}?year=${year}&month=${month}`,
  );
  return response.data;
}

async function findRecipientByPhone(phoneNumber) {
  // Backend endpoint นี้คุณจะต้องสร้างขึ้นมา

  const { data } = await axios.get(`/user/by-phone/${phoneNumber}`);
  return data;
}

async function createInternalTransfer(payload) {
  const { data } = await axios.post("/transaction/transfer", payload);
  return data;
}

export function useCreateInternalTransfer({ onSuccessCallback }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInternalTransfer,
    onSuccess: (data) => {
      toast.success("โอนเงินสำเร็จ!");
      setTimeout(() => {}, 500);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });

      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "การโอนเงินล้มเหลว");
    },
  });
}

export function useSearchRecipient() {
  return useMutation({
    mutationFn: findRecipientByPhone,
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "ไม่พบผู้ใช้ หรือเกิดข้อผิดพลาด",
      );
    },
  });
}

export function useTransactions(year, month, walletId) {
  return useQuery({
    queryKey: ["transactions", year, month, walletId],
    queryFn: () => fetchTransactions(year, month, walletId),
  });
}

export function useSuccessTransactions(year, month, walletId) {
  return useQuery({
    queryKey: ["successTransactions", year, month, walletId],
    queryFn: () => fetchSuccessTransactions(year, month, walletId),
    enabled: !!walletId,
  });
}

/**
 * ฟังก์ชันสำหรับส่ง request สร้างรายการถอนเงิน
 * @param {object} payload - ข้อมูลการถอนเงิน
 * @param {number} payload.amount - จำนวนเงิน
 * @param {string} payload.bank - ธนาคาร
 * @param {string} payload.accountNumber - เลขบัญชี
 * @param {string} payload.accountName - ชื่อบัญชี
 */
const createWithdrawRequest = async (payload) => {
  // Endpoint นี้ควรจะถูกป้องกันด้วย auth middleware เพื่อให้มี req.user.id
  const { data } = await axios.post("/transaction/withdraw", payload);
  return data;
};

/**
 * Custom Hook สำหรับจัดการการสร้างรายการถอนเงิน
 * @param {object} options - Options
 * @param {Function} options.onSuccessCallback - ฟังก์ชันที่จะเรียกใช้เมื่อสำเร็จ
 */
export function useWithdrawTransaction({ onSuccessCallback }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWithdrawRequest,
    onSuccess: () => {
      toast.success("ส่งคำขอถอนเงินสำเร็จ! รอการตรวจสอบจากเจ้าหน้าที่");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "ส่งคำขอถอนเงินไม่สำเร็จ");
    },
  });
}

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

export function useCreateWithdrawTransaction({ onSuccessCallback }) {}
