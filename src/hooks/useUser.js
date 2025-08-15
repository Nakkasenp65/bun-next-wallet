import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import externalLinkAxios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useLockContext } from "@/components/context/LockContext";

async function fetchUserStatus(userId) {
  const { data } = await axios.get(`/user/status/${userId}`);
  return data;
}

async function updateUserData({ mongoId, updateData }) {
  const { data } = await axios.patch(`/user/${mongoId}`, updateData);
  return data;
}

async function fetchUser(userId) {
  const { data } = await axios.get(`/user/${userId}`);
  return data;
}

async function fetchUserFromMainServer(lineUserId) {
  const mainUserApiUrl = process.env.NEXT_PUBLIC_MAIN_USER_API;

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

async function fetchLockStatus(lineUserId) {
  const { data } = await axios.get(`/user/lock/${lineUserId}`);
  console.log("CHECK LOCK DATA: ", data);
  return data;
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

export function useLockStatus(lineUserId) {
  return useQuery({
    queryKey: ["lockStatus", lineUserId],
    queryFn: () => fetchLockStatus(lineUserId),
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
      toast.success("สร้างเป้าหมายการออมเงินสำเร็จ!");
      setTimeout(() => {
        console.log("wait for 1 second");
      }, 500);
      await queryClient.invalidateQueries(["users", data.line_user_id]);
      // await queryClient.setQueryData(["user", data.line_user_id], data);
      await queryClient.setQueryData(["userStatus", data.line_user_id], {
        isNewUser: false,
      });
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

export function useUpdateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (goalData) => {
      // You will need to create this backend endpoint: PATCH /v1/goal/:userId
      // It will update the user's goal with the new productId and planId.
      const { userId, ...payload } = goalData;
      const { data } = await axios.patch(`/goal/${userId}`, payload);
      return data;
    },
    onSuccess: (data, variables) => {
      toast.success("เปลี่ยนเป้าหมายสำเร็จ!");
      // Invalidate the user query to refetch all data, including the new goal.
      setTimeout(() => {
        console.log("wait for 0.5 second (race condition)");
      }, 500);
      queryClient.invalidateQueries({ queryKey: ["user", variables.userId] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "ไม่สามารถเปลี่ยนเป้าหมายได้",
      );
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: updateUserData,
    onSuccess: (data) => {
      // 'data' คือ user object ที่อัปเดตแล้ว
      toast.success("บันทึกข้อมูลสำเร็จ!");

      // (สำคัญ) อัปเดต cache ของ 'user' ด้วยข้อมูลใหม่ทันที
      queryClient.setQueryData(["user", data.line_user_id], data);

      // กลับไปหน้าโปรไฟล์
      router.back();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
      );
    },
  });
}

export function useLockApp() {
  const queryClient = useQueryClient();
  const { lockApp } = useLockContext(); // Get the function to update the UI immediately

  return useMutation({
    mutationFn: async (lineUserId) => {
      const { data } = await axios.post(`/user/lock/${lineUserId}`);
      return data;
    },
    onSuccess: (data, lineUserId) => {
      toast.success("แอปถูกล็อคแล้ว");
      // Immediately update the UI to show the lock screen
      lockApp();
      // Invalidate the user status query to ensure the backend state is refetched
      queryClient.invalidateQueries({ queryKey: ["lockStatus", lineUserId] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "ไม่สามารถล็อคแอปได้");
    },
  });
}

export function useUnlockApp() {
  const queryClient = useQueryClient();
  const { unlockApp } = useLockContext(); // Get the function to hide the lock screen

  return useMutation({
    mutationFn: async (unlockData) => {
      // unlockData will be { line_user_id, pin }
      const { data } = await axios.post(`/user/unlock`, unlockData);
      return data;
    },
    onSuccess: (data, variables) => {
      // variables contains the { line_user_id, pin } we sent
      toast.success("ปลดล็อคสำเร็จ!");
      // Immediately hide the lock screen
      unlockApp();
      // Invalidate the user status to reflect the new unlocked state
      queryClient.invalidateQueries({
        queryKey: ["lockStatus", variables.line_user_id],
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "รหัส PIN ไม่ถูกต้อง");
    },
  });
}
