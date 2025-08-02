import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import instanceAxios from "axios";
import toast from "react-hot-toast";

const createSavingTransaction = async ({ walletId, username, formData }) => {
  const imageData = await instanceAxios.post(
    "https://google-drive-uploader-seven-nu.vercel.app/api/upload",
    formData,
  );
  console.log("image Sent: ", imageData);

  const savingTransaction = {
    name: "ออมเงิน",
    type: "INCOME",
    from: username,
    to: "OK NUMBER ONE",
    slipImageUrl: imageData.data.data.url,
    // slipImageUrl: "https://lh3.googleusercontent.com/d/1HAWqttSJGzRVQ_HwDcrw-mcuzc5mlvCK",
  };

  const { data } = await axios.post(`/transaction/${walletId}`, savingTransaction);
  console.log("Data transaction: ", data);
  return data;
};

export function useCreateSavingTransaction({ onSuccessCallback }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSavingTransaction,
    onSuccess: async () => {
      toast.success("บันทึกสำเร็จ!");
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response?.data?.message || "บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    },
  });
}
