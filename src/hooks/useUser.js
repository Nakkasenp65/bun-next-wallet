import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const BACKEND_API = process.env.NEXT_PUBLIC_API_URL;

export function useUser(liffId) {
  return useQuery({
    queryKey: ["user", liffId],
    queryFn: async () => {
      const response = await axios.get(`${BACKEND_API}/user/${liffId}`);
      return response.data;
    },
    enabled: !!liffId,
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (goalData) => {
      const { data } = await axios.post(`${BACKEND_API}/user`, goalData);
      return data;
    },
    // `onSuccess` จะได้รับ (data, variables, context)
    // data from { data } = await axios.post
    // variables from goalData ที่เราส่งเข้ามา
    onSuccess: async (data, variables) => {
      const { liffId } = variables;
      queryClient.setQueryData(["user", liffId], data);
      await queryClient.invalidateQueries(["user", liffId]);
      toast.success("สร้างเป้าหมายการออมเงินสำเร็จ!");
      router.push("/");
    },
    onError: (error) => {
      console.error("Error creating goal:", error);
      const errorMessage = error.response?.data?.message || "สร้างเป้าหมายการออมเงินไม่สำเร็จ";
      toast.error(errorMessage);
    },
  });
}
