import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import toast from "react-hot-toast";

// PATCH: อนุมัติธุรกรรม
const approveTransaction = async ({ transactionId, amount }) => {
  const { data } = await axios.patch(`/admin/transactions/${transactionId}`, {
    amount,
  });
  return data;
};

// PATCH: ปฏิเสธธุรกรรม
const rejectTransaction = async (transactionId) => {
  const { data } = await axios.patch(`/admin/transactions/${transactionId}/reject`);
  return data;
};

async function findRecipientByPhone(phoneNumber) {
  // Backend endpoint นี้คุณจะต้องสร้างขึ้นมา

  const response = await axios.get("/user/recipient/");
  return response.data;
}

async function createInternalTransfer(payload) {
  const response = await axios.post("/transaction/transfer", payload);
  return response.data;
}

/**
 * ฟังก์ชันสำหรับส่ง request สร้างรายการถอนเงิน
 * @param {object} payload - ข้อมูลการถอนเงิน
 * @param {number} payload.amount - จำนวนเงิน
 * @param {string} payload.bank - ธนาคาร
 * @param {string} payload.accountNumber - เลขบัญชี
 * @param {string} payload.accountName - ชื่อบัญชี
 */
async function createWithdrawRequest(payload) {
  // Endpoint นี้ควรจะถูกป้องกันด้วย auth middleware เพื่อให้มี req.user.id
  const { data } = await axios.post("/transaction/withdraw", payload);
  return data;
}

async function createTransactionRequest(payload) {
  // ใช้ POST ไปยัง endpoint ที่เราสร้าง
  const { data } = await axios.post("/admin/transactions", payload);
  return data;
}

async function updateTransactionRequest({ transactionId, payload }) {
  const { data } = await axios.patch(`/admin/transactions/${transactionId}`, payload);
  return data;
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTransactionRequest,
    onSuccess: () => {
      toast.success("สร้างรายการใหม่สำเร็จ!");
      // ทำให้ table โหลดข้อมูลใหม่
      queryClient.invalidateQueries({ queryKey: ["adminTransactions"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาดในการสร้างรายการ");
    },
  });
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
    mutationFn: async ({ type, value }) => {
      // สื่อสารกับ Backend ด้วย "ภาษา" ที่ถูกต้อง
      const { data } = await axios.get("/user/recipient", {
        params: { type, value },
      });
      return data;
    },
    // [CRITICAL] ลบ onError ออกจาก Hook
    // การจัดการ Error ควรเป็นความรับผิดชอบของ "คอมโพเนนต์"
    // เพราะแต่ละคอมโพเนนต์อาจต้องการจัดการ Error แตกต่างกัน
    // (เช่น แสดง toast, ตั้งค่า state เป็น null, etc.)
  });
}

export function useWalletTransaction(year, month, walletId) {
  return useQuery({
    queryKey: ["transactions", year, month, walletId],
    queryFn: async () => {
      const response = await axios.get(`/transaction/${walletId}?year=${year}&month=${month}`);
      return response.data;
    },
    enabled: !!walletId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useSuccessTransactions(year, month, walletId) {
  return useQuery({
    queryKey: ["successTransactions", year, month, walletId],
    queryFn: async () => {
      const response = await axios.get(
        `/transaction/success/${walletId}?year=${year}&month=${month}`,
      );
      return response.data;
    },
    enabled: !!walletId,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
  });
}

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

export function useCreateSavingTransaction({ onSuccessCallback }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.post(`/transaction/`, formData);
      return data;
    },
    onSuccess: async (data) => {
      toast.success("ส่งสลิปสำเร็จ! รอการตรวจสอบสักครู่");
      if (onSuccessCallback) {
        onSuccessCallback();
      }
      setTimeout(async () => {
        await queryClient.invalidateQueries({ queryKey: ["wallet"] }); // สำหรับอัปเดตยอดเงินใน Wallet
        await queryClient.invalidateQueries({ queryKey: ["transactions"] }); // สำหรับอัปเดตรายการ Transaction
      }, 1000 * 10);
    },
    onError: (error) => {
      console.error("Error creating transaction:", error);
      toast.error(error.response?.data?.message || "ส่งสลิปไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    },
  });
}

export function useApproveTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveTransaction,
    onSuccess: () => {
      toast.success("อนุมัติรายการสำเร็จ!");
      // สั่งให้ query ที่มี key 'adminTransactions' ทั้งหมด refetch ข้อมูลใหม่
      queryClient.invalidateQueries({ queryKey: ["adminTransactions"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาดในการอนุมัติ");
    },
  });
}

/**
 * Hook สำหรับจัดการการปฏิเสธธุรกรรม
 */
export function useRejectTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rejectTransaction,
    onSuccess: () => {
      toast.success("ปฏิเสธรายการเรียบร้อยแล้ว");
      queryClient.invalidateQueries({ queryKey: ["adminTransactions"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาดในการปฏิเสธรายการ");
    },
  });
}

/**
 * Custom Hook สำหรับจัดการการแก้ไขข้อมูลธุรกรรม
 */

export function useCreateWithdrawTransaction({ onSuccessCallback }) {}
