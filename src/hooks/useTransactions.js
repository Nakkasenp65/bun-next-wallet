import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import toast from "react-hot-toast";

// GET: ดึงรายการธุรกรรมทั้งหมด (พร้อม filter และ pagination)
const fetchTransactions = async (filters) => {
  // แปลง object filters เป็น query string, เช่น { page: 1, status: 'PENDING' } -> '?page=1&status=PENDING'
  const params = new URLSearchParams(filters).toString();
  const { data } = await axios.get(`/admin/transactions?${params}`);
  return data;
};

// PATCH: อนุมัติธุรกรรม
const approveTransaction = async ({ transactionId, amount }) => {
  const { data } = await axios.patch(`/admin/transactions/${transactionId}`, {
    amount,
  });
  return data;
};

// PATCH: ปฏิเสธธุรกรรม
const rejectTransaction = async (transactionId) => {
  const { data } = await axios.patch(
    `/admin/transactions/${transactionId}/reject`,
  );
  return data;
};

async function fetchWalletTransactions(year, month, walletId) {
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

  const response = await axios.get(`/user/by-phone/${phoneNumber}`);
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

/**
 * ฟังก์ชันสำหรับส่ง request อัปเดตข้อมูลธุรกรรม
 * @param {object} data - ข้อมูล
 * @param {string} data.transactionId - ID ของธุรกรรม
 * @param {object} data.payload - ข้อมูลที่ต้องการอัปเดต (เช่น from, description, status, type)
 */
async function updateTransactionRequest({ transactionId, payload }) {
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
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "เกิดข้อผิดพลาดในการสร้างรายการ",
      );
    },
  });
}

export function useGetTransactions() {
  return useQuery({
    queryKey: ["adminTransactions"],
    queryFn: () => fetchTransactions(),
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
    mutationFn: findRecipientByPhone,
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "ไม่พบผู้ใช้ หรือเกิดข้อผิดพลาด",
      );
    },
  });
}

export function useWalletTransaction(year, month, walletId) {
  return useQuery({
    queryKey: ["transactions", year, month, walletId],
    queryFn: () => fetchWalletTransactions(year, month, walletId),
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

/**
 * Hook สำหรับดึงข้อมูลธุรกรรมสำหรับหน้า Admin
 * @param {object} filters - State ของ filter ที่ใช้ (page, pageSize, status)
 */
export function useGetAdminTransactions(filters) {
  return useQuery({
    // queryKey จะเปลี่ยนตาม filters เพื่อให้ React Query ดึงข้อมูลใหม่เมื่อ filter เปลี่ยน
    queryKey: ["adminTransactions", filters],
    queryFn: () => fetchTransactions(filters),
    keepPreviousData: true, // ทำให้ข้อมูลเก่าแสดงอยู่ขณะโหลดข้อมูลหน้าใหม่ (UX ที่ดีสำหรับ Pagination)
  });
}

/**
 * Hook สำหรับจัดการการอนุมัติธุรกรรม
 */
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
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "เกิดข้อผิดพลาดในการปฏิเสธรายการ",
      );
    },
  });
}

/**
 * Custom Hook สำหรับจัดการการแก้ไขข้อมูลธุรกรรม
 */
export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTransactionRequest,
    onSuccess: (data) => {
      // รับ data ที่ return กลับมา
      toast.success("อัปเดตข้อมูลสำเร็จ!");
      // Invalidate query เพื่อให้ refetch ข้อมูลใหม่
      queryClient.invalidateQueries({ queryKey: ["adminTransactions"] });
      // (Optional) คุณสามารถอัปเดต cache โดยตรงเพื่อ UX ที่ดีขึ้นได้
      // queryClient.setQueryData(['adminTransactions', ...], (oldData) => ...);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาดในการอัปเดต");
    },
  });
}

export function useCreateWithdrawTransaction({ onSuccessCallback }) {}
