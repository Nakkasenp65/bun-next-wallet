import {
  useMutation,
  useQuery,
  useQueryClient,
  userQueryOptions,
} from "@tanstack/react-query";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

async function fetchUserStatus(userId) {
  const { data } = await axios.get(`/user/status/${userId}`);
  return data;
}

async function fetchUser(userId) {
  const { data } = await axios.get(`/user/${userId}`);
  return data;
}

export function useUserStatus(userId) {
  return useQuery({
    queryKey: ["userStatus", userId],
    queryFn: () => fetchUserStatus(userId),
    enabled: !!userId,
  });
}

export function useUser(userId) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async (goalData) => {
      const { data } = await axios.post(`/user`, goalData);
      return data;
    },
    // `onSuccess` จะได้รับ (data, variables, context)
    // data from { data } = await axios.post
    // variables from goalData ที่เราส่งเข้ามา
    onSuccess: async (data) => {
      await queryClient.setQueryData(["user", data.userId], data);
      await queryClient.setQueryData(["userStatus", data.userId], {
        isNewUser: false,
      });
      toast.success("สร้างเป้าหมายการออมเงินสำเร็จ!");
      router.push("/");
    },
    onError: (error) => {
      console.error("Error creating goal:", error);
      const errorMessage =
        error.response?.data?.message || "สร้างเป้าหมายการออมเงินไม่สำเร็จ";
      toast.error(errorMessage);
    },
  });
}
