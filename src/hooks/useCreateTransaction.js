import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import toast from "react-hot-toast";

export function useCreateInternalTransfer({ onSuccessCallback }) {
  const queryClient = useQueryClient();

  return useMutation({
    // The function that will be executed when `mutate` is called.
    mutationFn: async (payload) => {
      /**
       * body: {
       *  userId: userData?.id,
       *  line_user_id: userData?.line_user_id,
       *  recipientUserId: recipient.id,
       *  amount: parseFloat(amount),
       *  pin,
       * }
       */
      const endpoint = "/transaction/transfer/internal";
      const { data } = await axios.post(endpoint, payload);
      return data;
    },
    onSuccess: () => {
      toast.success("โอนเงินสำเร็จ!");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["successTransactions"] });
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error) => {
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
    mutationFn: async (walletId, username, formData) => {
      const { data } = await axios.post(`/transaction/${walletId}`, formData);
      return data;
    },
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
