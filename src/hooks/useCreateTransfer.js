import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const createTransfer = async ({ walletId, formData }) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/transaction/${walletId}`;

  const { data } = await axios.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export function useCreateTransfer({ onSuccessCallback }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransfer,
    onSuccess: async (data) => {
      toast.success(data?.message || "Slip sent successfully! Awaiting confirmation.");
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send slip. Please try again.");
    },
  });
}
