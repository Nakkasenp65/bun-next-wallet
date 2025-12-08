import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import externalLinkAxios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  CheckOkMobileUser,
  MainServerUser,
  UserData,
  UserLockStatus,
} from "@/types/user";
import { CreateGoalPayload } from "../types/goal";

// --- Interfaces ---

interface AdminUserFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  [key: string]: any;
}

interface UpdateAdminUserParams {
  userId: string;
  payload: Record<string, any>;
}

interface UpdateGoalDTO {
  userId: string;
  [key: string]: any;
}

interface UpdateUserParams {
  line_user_id: string;
  updateData: Record<string, any>;
}

interface UnlockAppData {
  line_user_id: string;
  pin: string;
}

// --- Fetcher Functions ---

/**
 * ดึงข้อมูลผู้ใช้ทั้งหมดแบบแบ่งหน้าสำหรับ Admin
 */
async function fetchAdminUsers(filters: AdminUserFilters) {
  // axios params will serialize the object to query string
  const { data } = await axios.get("/admin/users", { params: filters });
  return data;
}

async function updateAdminUser({ userId, payload }: UpdateAdminUserParams) {
  const { data } = await axios.patch(`/admin/users/${userId}`, payload);
  return data;
}

// --- Hooks ---

/**
 * Hook สำหรับดึงข้อมูลผู้ใช้ทั้งหมดสำหรับหน้า Admin Table
 */
export function useGetAdminUsers(filters: AdminUserFilters) {
  return useQuery({
    queryKey: ["adminUsers", filters],
    queryFn: () => fetchAdminUsers(filters),
    placeholderData: (previousData) => previousData, // keepPreviousData is deprecated in v5, replaced by placeholderData logic, or use keepPreviousData if on v4
  });
}

export function useUpdateAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminUser,
    onSuccess: (updatedUser, variables) => {
      toast.success("อัปเดตข้อมูลผู้ใช้สำเร็จ!");
      // 1. Invalidate list
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      // 2. Invalidate user detail
      queryClient.invalidateQueries({
        queryKey: ["adminUserDetail", variables.userId],
      });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาดในการอัปเดต");
    },
  });
}

export function useGetUserById(line_user_id: string | undefined) {
  return useQuery({
    queryKey: ["adminUserDetail", line_user_id],
    queryFn: async () => {
      if (!line_user_id) return null;
      const { data } = await axios.get(`/admin/users/${line_user_id}`);
      return data;
    },
    enabled: !!line_user_id,
  });
}

export function useUserStatus(lineUserId: string | undefined) {
  return useQuery({
    queryKey: ["userStatus", lineUserId],
    queryFn: async () => {
      if (!lineUserId) return null;
      const { data } = await axios.get(`/user/status/${lineUserId}`);
      return data;
    },
    enabled: !!lineUserId,
  });
}

// ROUTE: /user/:lineUserId
export function useGetUser(lineUserId: string | undefined) {
  return useQuery({
    queryKey: ["user", lineUserId],
    queryFn: async () => {
      if (!lineUserId) return null;
      const { data } = await axios.get<UserData>(`/user/${lineUserId}`);
      return data;
    },
    enabled: !!lineUserId,
    staleTime: 1000 * 60 * 30,
  });
}

// ROUTE: /user/lock/:lineUserId
export function useLockStatus(lineUserId: string | undefined) {
  return useQuery({
    queryKey: ["lockStatus", lineUserId],
    queryFn: async () => {
      if (!lineUserId) return null;
      const { data } = await axios.get<UserLockStatus>(
        `/user/lock/${lineUserId}`,
      );
      return data;
    },
    enabled: !!lineUserId,
    staleTime: 1000 * 60 * 30,
  });
}

export function useCheckOkMobileUser(line_user_id: string | undefined) {
  const router = useRouter();
  return useQuery({
    queryKey: ["isOkMobileUser", line_user_id],
    queryFn: async () => {
      if (!line_user_id) return null;
      try {
        const { data } = await externalLinkAxios.get<CheckOkMobileUser>(
          `https://checkuserdb.vercel.app/api/check-user/${line_user_id}`,
        );
        return data;
      } catch (error: any) {
        // Check for 404 status
        if (error.response?.status === 404 || error.status === 404) {
          router.replace("https://liff.line.me/2006703040-RYAyYAyA");
        }
        return null;
      }
    },
    enabled: !!line_user_id,
  });
}

export function useMainServerUser(line_user_id: string | undefined) {
  return useQuery({
    queryKey: ["mainServerUser", line_user_id],
    queryFn: async () => {
      if (!line_user_id) return null;
      const mainUserApiUrl = process.env.NEXT_PUBLIC_MAIN_USER_API;
      try {
        if (!mainUserApiUrl) throw new Error("mainUserApiUrl is not defined");
        const { data } = await externalLinkAxios.get<MainServerUser>(
          `${mainUserApiUrl}${line_user_id}`,
        );
        return data;
      } catch (error) {
        console.log("Error fetchUserfromMainServer", error);
        return null;
      }
    },
    enabled: !!line_user_id,
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async (goalData: CreateGoalPayload) => {
      const { data } = await axios.post(`/user`, goalData);
      return data;
    },
    onSuccess: async (data) => {
      toast.success("สร้างเป้าหมายการออมเงินสำเร็จ!");
      setTimeout(() => {
        console.log("wait for 1 second");
      }, 500);
      await queryClient.invalidateQueries({
        queryKey: ["users", data.line_user_id],
      });

      // Update cache manually if needed
      await queryClient.setQueryData(["userStatus", data.line_user_id], {
        isNewUser: false,
      });
      router.push("/");
    },
    onError: (error: AxiosError<any>) => {
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
    mutationFn: async (goalData: UpdateGoalDTO) => {
      const { userId, ...payload } = goalData;
      const { data } = await axios.patch(`/goal/${userId}`, payload);
      return data;
    },
    onSuccess: (data, variables) => {
      toast.success("เปลี่ยนเป้าหมายสำเร็จ!");
      setTimeout(() => {
        console.log("wait for 0.5 second (race condition)");
      }, 500);

      // Note: variables.line_user_id might not exist on UpdateGoalDTO based on how you call it,
      // check if you need to pass it or if userId is actually the line_user_id
      const queryKey = variables["line_user_id"]
        ? ["goal", variables["line_user_id"]]
        : ["goal", variables.userId];

      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: AxiosError<any>) => {
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
    mutationFn: async ({ line_user_id, updateData }: UpdateUserParams) => {
      console.log(line_user_id);
      const { data } = await axios.patch(`/user/${line_user_id}`, updateData);
      return data;
    },
    onSuccess: (data) => {
      toast.success("บันทึกข้อมูลสำเร็จ!");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      router.back();
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
      );
    },
  });
}

export function useLockApp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lineUserId: string) => {
      const { data } = await axios.post(`/user/lock/${lineUserId}`);
      return data;
    },
    onSuccess: (data, lineUserId) => {
      toast.success("แอปถูกล็อคแล้ว");
      queryClient.invalidateQueries({ queryKey: ["userStatus", lineUserId] });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "ไม่สามารถล็อคแอปได้");
    },
  });
}

export function useUnlockApp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (unlockData: UnlockAppData) => {
      const { data } = await axios.post(`/user/unlock`, unlockData);
      return data;
    },
    onSuccess: (data, variables) => {
      toast.success("ปลดล็อคสำเร็จ!");
      queryClient.invalidateQueries({
        queryKey: ["userStatus", variables.line_user_id],
      });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "รหัส PIN ไม่ถูกต้อง");
    },
  });
}
