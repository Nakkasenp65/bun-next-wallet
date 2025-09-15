import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import externalLinkAxios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

/**
 * ดึงข้อมูลผู้ใช้ทั้งหมดแบบแบ่งหน้าสำหรับ Admin
 * @param {object} filters - ตัวกรอง เช่น page, pageSize, search, role
 */
async function fetchAdminUsers(filters) {
  // เราจะส่ง object filters เข้าไปใน `params` ของ axios
  // axios จะแปลงเป็น query string ให้เอง (เช่น /api/users?page=1&pageSize=10)
  const { data } = await axios.get("/admin/users", { params: filters });
  return data; // คาดว่า backend จะ trả về { data, paging }
}

async function updateAdminUser({ userId, payload }) {
  // Endpoint นี้คุณต้องสร้างขึ้นมาเพื่อเรียก service ข้างบน
  const { data } = await axios.patch(`/admin/users/${userId}`, payload);
  return data;
}

/**
 * Hook สำหรับดึงข้อมูลผู้ใช้ทั้งหมดสำหรับหน้า Admin Table
 * @param {object} filters - State ของตัวกรองจากหน้า Page
 */
export function useGetAdminUsers(filters) {
  return useQuery({
    // queryKey ต้องขึ้นอยู่กับ filters เพื่อให้ re-fetch อัตโนมัติเมื่อ filter เปลี่ยน
    queryKey: ["adminUsers", filters],
    queryFn: () => fetchAdminUsers(filters),
    // keepPreviousData ช่วยให้ UX ดีขึ้นตอนเปลี่ยนหน้า (ข้อมูลเก่าจะยังแสดงอยู่จนกว่าข้อมูลใหม่จะโหลดเสร็จ)
    keepPreviousData: true,
  });
}

export function useUpdateAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminUser,
    onSuccess: (updatedUser, variables) => {
      toast.success("อัปเดตข้อมูลผู้ใช้สำเร็จ!");
      // 1. Invalidate list เพื่อให้ Table โหลดใหม่
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      // 2. (สำคัญ) Invalidate user detail เพื่อให้ข้อมูลใน Modal สดใหม่หากเปิดอีกครั้ง
      queryClient.invalidateQueries({
        queryKey: ["adminUserDetail", variables.userId],
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาดในการอัปเดต");
    },
  });
}

export function useGetUserById(line_user_id) {
  return useQuery({
    queryKey: ["adminUserDetail", line_user_id],
    queryFn: async () => {
      const { data } = await axios.get(`/admin/users/${line_user_id}`);
      return data;
    },
    // Query นี้จะทำงานก็ต่อเมื่อมี userId เท่านั้น (เช่น เมื่อ Modal เปิด)
    enabled: !!line_user_id,
  });
}

export function useUserStatus(lineUserId) {
  return useQuery({
    queryKey: ["userStatus", lineUserId],
    queryFn: async () => {
      {
        const { data } = await axios.get(`/user/status/${lineUserId}`);
        return data;
      }
    },
    enabled: !!lineUserId,
  });
}

export function useGetUser(lineUserId) {
  return useQuery({
    queryKey: ["user", lineUserId],
    queryFn: async () => {
      const { data } = await axios.get(`/user/${lineUserId}`);
      return data;
    },
    enabled: !!lineUserId,
    staleTime: 1000 * 60 * 30,
  });
}

export function useLockStatus(lineUserId) {
  return useQuery({
    queryKey: ["lockStatus", lineUserId],
    queryFn: async () => {
      const { data } = await axios.get(`/user/lock/${lineUserId}`);
      console.log("CHECK LOCK DATA: ", data);
      return data;
    },
    enabled: !!lineUserId,
    staleTime: 1000 * 60 * 30,
  });
}

export function useCheckOkMobileUser(line_user_id) {
  const router = useRouter();
  return useQuery({
    queryKey: ["isOkMobileUser", line_user_id],
    queryFn: async () => {
      try {
        const { data } = await externalLinkAxios.get(
          `https://checkuserdb.vercel.app/api/check-user/${line_user_id}`,
        );
        return data;
      } catch (error) {
        if (error.status === 404) router.replace("https://liff.line.me/2006703040-RYAyYAyA");
        return null;
      }
    },
    enabled: !!line_user_id,
  });
}

export function useMainServerUser(line_user_id) {
  return useQuery({
    queryKey: ["mainServerUser", line_user_id],
    queryFn: async () => {
      const mainUserApiUrl = process.env.NEXT_PUBLIC_MAIN_USER_API;
      try {
        if (!mainUserApiUrl) throw new Error("mainUserApiUrl is not defined");
        const { data } = await externalLinkAxios.get(`${mainUserApiUrl}${line_user_id}`);
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
    mutationFn: async (goalData) => {
      const { data } = await axios.post(`/user`, goalData);
      return data;
    },
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
      const errorMessage = error.response?.data?.message || "สร้างเป้าหมายการออมเงินไม่สำเร็จ";
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
      queryClient.invalidateQueries({ queryKey: ["goal", variables.line_user_id] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "ไม่สามารถเปลี่ยนเป้าหมายได้");
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ line_user_id, updateData }) => {
      console.log(line_user_id);
      const { data } = await axios.patch(`/user/${line_user_id}`, updateData);
      return data;
    },
    onSuccess: (data) => {
      // 'data' คือ user object ที่อัปเดตแล้ว
      toast.success("บันทึกข้อมูลสำเร็จ!");
      queryClient.invalidateQueries("user");
      router.back();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    },
  });
}

export function useLockApp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lineUserId) => {
      const { data } = await axios.post(`/user/lock/${lineUserId}`);
      return data;
    },
    onSuccess: (data, lineUserId) => {
      toast.success("แอปถูกล็อคแล้ว");
      // Immediately update the UI to show the lock screen
      // Invalidate the user status query to ensure the backend state is refetched
      queryClient.invalidateQueries({ queryKey: ["userStatus", lineUserId] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "ไม่สามารถล็อคแอปได้");
    },
  });
}

export function useUnlockApp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (unlockData) => {
      // unlockData will be { line_user_id, pin }
      const { data } = await axios.post(`/user/unlock`, unlockData);
      return data;
    },
    onSuccess: (data, variables) => {
      toast.success("ปลดล็อคสำเร็จ!");
      queryClient.invalidateQueries({
        queryKey: ["userStatus", variables.line_user_id],
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "รหัส PIN ไม่ถูกต้อง");
    },
  });
}
