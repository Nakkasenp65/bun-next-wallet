import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import toast from "react-hot-toast";
import { Transaction } from "@/types/prisma";
import { AxiosError } from "axios";

// PATCH: อนุมัติธุรกรรม
interface ApproveTransactionVariables {
  transactionId: string;
  amount?: number;
}

const approveTransaction = async ({ transactionId, amount }: ApproveTransactionVariables) => {
  const { data } = await axios.patch(`/admin/transactions/${transactionId}`, {
    amount,
  });
  return data;
};

// PATCH: ปฏิเสธธุรกรรม
const rejectTransaction = async (transactionId: string) => {
  // Fix: Use the existing PATCH endpoint with rejection status instead of non-existent /reject endpoint
  const { data } = await axios.patch(`/admin/transactions/${transactionId}`, {
    status: "REJECTED",
    description: "รายการถูกปฏิเสธโดยผู้ดูแลระบบ"
  });
  return data;
};

async function findRecipientByPhone(phoneNumber: string) {
  // Backend endpoint นี้คุณจะต้องสร้างขึ้นมา

  const response = await axios.get("/user/recipient/");
  return response.data;
}

async function createInternalTransfer(payload: any) {
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
interface WithdrawPayload {
  amount: number;
  bank: string;
  accountNumber: string;
  accountName: string;
}

async function createWithdrawRequest(payload: WithdrawPayload) {
  // Endpoint นี้ควรจะถูกป้องกันด้วย auth middleware เพื่อให้มี req.user.id
  const { data } = await axios.post("/transaction/withdraw", payload);
  return data;
}

async function createTransactionRequest(payload: Partial<Transaction>) {
  // ใช้ POST ไปยัง endpoint ที่เราสร้าง
  const { data } = await axios.post("/admin/transactions", payload);
  return data;
}

interface UpdateTransactionVariables {
  transactionId: string;
  payload: Partial<Transaction>;
}

async function updateTransactionRequest({ transactionId, payload }: UpdateTransactionVariables) {
  const { data } = await axios.patch(
    `/admin/transactions/${transactionId}`,
    payload,
  );
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
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data?.message || "เกิดข้อผิดพลาดในการสร้างรายการ",
      );
    },
  });
}

interface UseCreateInternalTransferOptions {
  onSuccessCallback?: () => void;
}

export function useCreateInternalTransfer({ onSuccessCallback }: UseCreateInternalTransferOptions = {}) {
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
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "การโอนเงินล้มเหลว");
    },
  });
}

interface SearchRecipientVariables {
  type: string;
  value: string;
}

export function useSearchRecipient() {
  return useMutation({
    mutationFn: async ({ type, value }: SearchRecipientVariables) => {
      // สื่อสารกับ Backend ด้วย "ภาษา" ที่ถูกต้อง
      const { data } = await axios.get("/user/recipient", {
        params: { type, value },
      });
      return data;
    },
  });
}

export function useWalletTransaction(year: number, month: number, walletId: string | undefined) {
  return useQuery({
    queryKey: ["transactions", year, month, walletId],
    queryFn: async () => {
      const response = await axios.get(
        `/transaction/${walletId}?year=${year}&month=${month}`,
      );
      return response.data;
    },
    enabled: !!walletId,
    staleTime: 10 * 1000,
  });
}

export function useSuccessTransactions(year: number, month: number, walletId: string | undefined) {
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

interface UseWithdrawTransactionOptions {
  onSuccessCallback?: () => void;
}

export function useWithdrawTransaction({ onSuccessCallback }: UseWithdrawTransactionOptions = {}) {
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
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "ส่งคำขอถอนเงินไม่สำเร็จ");
    },
  });
}

interface UseCreateSavingTransactionOptions {
  onSuccessCallback?: () => void;
}

export function useCreateSavingTransaction({ onSuccessCallback }: UseCreateSavingTransactionOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: any) => {
      const { data } = await axios.post(`/transaction/`, formData);
      return data;
    },
    onSuccess: async (data) => {
      toast.success("ส่งสลิปสำเร็จ! รอการตรวจสอบสักครู่");
      if (onSuccessCallback) {
        onSuccessCallback();
      }
      setTimeout(async () => {
        await queryClient.invalidateQueries({ queryKey: ["user"] }); // Ensure user data is updated
        await queryClient.invalidateQueries({ queryKey: ["wallet"] }); // Fix: Changed from ["wallet"] to match other hooks
        await queryClient.invalidateQueries({ queryKey: ["transactions"] }); // Ensure transaction list is updated
      }, 1000 * 10);
    },
    onError: (error: AxiosError<any>) => {
      console.error("Error creating transaction:", error);
      toast.error(
        error.response?.data?.message ||
          "ส่งสลิปไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
      );
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
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data?.message || "เกิดข้อผิดพลาดในการอนุมัติ",
      );
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
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data?.message || "เกิดข้อผิดพลาดในการปฏิเสธรายการ",
      );
    },
  });
}

/**
 * Custom Hook สำหรับจัดการการแก้ไขข้อมูลธุรกรรม
 */

export function useCreateWithdrawTransaction({ onSuccessCallback }: UseWithdrawTransactionOptions = {}) {}
