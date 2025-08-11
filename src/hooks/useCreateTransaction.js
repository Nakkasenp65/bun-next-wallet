import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import toast from "react-hot-toast";

const createSavingTransactionRequest = async (walletId, username, formData) => {
  // Endpoint ของ backend ที่จะรับ multipart/form-data
  // Axios จะตั้งค่า Content-Type ให้โดยอัตโนมัติ
  const { data } = await axios.post(`/transaction/${walletId}`, formData);
  return data;
};

/**
 * The function that makes the actual API call to the backend to perform the transfer.
 * This function will be called by the useMutation hook.
 * @param {object} payload - The data required for the transfer.
 * @param {string} payload.recipientUserId - The database ID of the user receiving the money.
 * @param {number} payload.amount - The amount of money to transfer.
 * @param {string} payload.pin - The sender's PIN for verification.
 * @returns {Promise<any>} The response data from the server.
 */
const createInternalTransferRequest = async (payload) => {
  // The backend endpoint for internal transfers.
  // This endpoint must be protected by an authentication middleware
  // so the backend knows who the sender is from `req.user.id`.
  const endpoint = "/transaction/transfer/internal";

  const { data } = await axios.post(endpoint, payload);
  return data;
};

/**
 * A custom React Query hook to handle the state and logic for creating an internal user-to-user transfer.
 * @param {object} options - Configuration options for the hook.
 * @param {Function} options.onSuccessCallback - A function to call after the transfer succeeds (e.g., to close the page).
 * @returns The mutation object from useMutation, which includes `mutate`, `isPending`, etc.
 */
export function useCreateInternalTransfer({ onSuccessCallback }) {
  const queryClient = useQueryClient();

  return useMutation({
    // The function that will be executed when `mutate` is called.
    mutationFn: createInternalTransferRequest,

    // This runs when the mutation is successful.
    onSuccess: () => {
      toast.success("โอนเงินสำเร็จ!");

      // Invalidate (refetch) user and transaction data to show the updated balance and history.
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });

      // Call the callback function passed from the component.
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },

    // This runs when the mutation fails.
    onError: (error) => {
      // Display a specific error message from the backend if available, otherwise show a generic one.
      toast.error(
        error.response?.data?.message ||
          "การโอนเงินล้มเหลว กรุณาลองใหม่อีกครั้ง",
      );
    },
  });
}

export function useCreateSavingTransaction({ onSuccessCallback }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSavingTransactionRequest(walletId, username, formData),
    onSuccess: async (data) => {
      toast.success("ส่งสลิปสำเร็จ! รอการตรวจสอบสักครู่");
      // Invalidate queries เพื่อดึงข้อมูลใหม่
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error) => {
      console.log(error);
      toast.error(
        error.response?.data?.message ||
          "ส่งสลิปไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
      );
    },
  });
}
