import {
  useMutation,
  useQuery,
  useQueryClient,
  userQueryOptions,
} from "@tanstack/react-query";
import axios from "@/lib/axios";
import externalLinkAxios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

async function fetchUserStatus(userId) {
  console.log("fetch user status");
  const { data } = await axios.get(`/user/status/${userId}`);
  return data;
}

async function fetchUser(userId) {
  console.log("fetch aomdown user");
  const { data } = await axios.get(`/user/${userId}`);
  return data;
}

async function fetchUserFromMainServer(lineUserId) {
  const mainUserApiUrl = process.env.NEXT_PUBLIC_MAIN_USER_API;

  console.log("fetch main server user");
  let mainUser = {};
  try {
    if (!mainUserApiUrl) throw new Error("mainUserApiUrl is not defined");
    const { data } = await externalLinkAxios.get(
      `${process.env.NEXT_PUBLIC_MAIN_USER_API}${lineUserId}`,
    );
    mainUser = data;
    console.log(mainUser);
    return mainUser;
  } catch (error) {
    console.log("Error fetchUserfromMainServer", error);
    return null;
  }
}

export function useUserStatus(lineUserId) {
  return useQuery({
    queryKey: ["userStatus", lineUserId],
    queryFn: () => fetchUserStatus(lineUserId),
    enabled: !!lineUserId,
  });
}

export function useUser(lineUserId) {
  return useQuery({
    queryKey: ["user", lineUserId],
    queryFn: () => fetchUser(lineUserId),
    enabled: !!lineUserId,
  });
}

export function useMainServerUser(lineUserId) {
  return useQuery({
    queryKey: ["mainServerUser", lineUserId],
    queryFn: () => fetchUserFromMainServer(lineUserId),
    enabled: !!lineUserId,
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
