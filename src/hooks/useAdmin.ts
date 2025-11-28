import axios from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Mission, Transaction, Notification, Broadcast, Product } from "@/types/prisma";
import { AxiosError } from "axios";

// MISSION

interface UpdateMissionPayload {
  missionId: string;
  payload: Partial<Mission>;
}

interface MissionFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  [key: string]: any;
}

interface ParticipantFilters {
  page?: number;
  pageSize?: number;
  [key: string]: any;
}

export interface ApprovePayload {
  status: "SUCCESS" | "REJECTED";
  amount: number;
  description: string;
}

export interface RejectPayload {
  status: "REJECTED";
  description: string;
}

export interface UpdatePayload {
  from: string;
  to: string;
  description: string;
  status: string;
  type: string;
  amount: string;
}

async function updateMission({ missionId, payload }: UpdateMissionPayload) {
  console.log("payload:", missionId);
  const { data } = await axios.patch(`/admin/missions/${missionId}`, payload);
  return data;
}

export function useGetAdminMissions(filters: MissionFilters) {
  return useQuery({
    queryKey: ["adminMissions", filters],
    queryFn: async () => {
      const { data } = await axios.get("/admin/missions", { params: filters });
      return data;
    },
    staleTime: 1000 * 120,
  });
}

export function useAdminGetMissionDetails(missionId: string | undefined, participantFilters: ParticipantFilters) {
  return useQuery({
    // Query Key ต้องขึ้นอยู่กับทั้ง missionId และ filters ของผู้เข้าร่วม
    // เพื่อให้ re-fetch อัตโนมัติเมื่อมีการเปลี่ยนหน้าของผู้เข้าร่วม
    queryKey: ["adminMissionDetails", missionId, participantFilters],
    queryFn: async () => {
      // GET /admin/missions/:missionId?page=1&pageSize=10
      const { data } = await axios.get(`/admin/missions/${missionId}`, {
        params: participantFilters, // ส่ง page, pageSize เป็น query string
      });
      return data;
    },
    staleTime: 1000 * 120,
    enabled: !!missionId,
  });
}

export function useUpdateAdminMission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ payload }: { payload: Partial<Mission> }) => {
      const { data } = await axios.patch(`/admin/missions`, payload);
      return data;
    },
    onSuccess: () => {
      toast.success("บันทึกการเปลี่ยนแปลงสำเร็จ!");
      queryClient.invalidateQueries({ queryKey: ["adminMissions"] });
    },
    onError: (err: AxiosError<any>) =>
      toast.error(err.response?.data?.message || "อัปเดตภารกิจไม่สำเร็จ"),
  });
}

// TRANSACTION

interface TransactionFilters {
  page?: number;
  pageSize?: number;
  status?: string;
  [key: string]: any;
}

export function useGetAdminTransactions(filters: TransactionFilters) {
  return useQuery({
    // queryKey จะเปลี่ยนตาม filters เพื่อให้ React Query ดึงข้อมูลใหม่เมื่อ filter เปลี่ยน
    queryKey: ["adminTransactions", filters],
    queryFn: async () => {
      // แปลง object filters เป็น query string, เช่น { page: 1, status: 'PENDING' } -> '?page=1&status=PENDING'
      const params = new URLSearchParams(filters as any).toString();
      const { data } = await axios.get(`/admin/transactions?${params}`);
      return data;
    },
    staleTime: 1000 * 120,
  });
}

export function useGetAdminDashboardData() {
  return useQuery({
    queryKey: ["adminDashboard"],
    queryFn: async () => {
      const { data } = await axios.get("/admin");
      return data;
    },
    staleTime: 1000 * 120,
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    // mutationFn จะรับ transactionId ที่ต้องการลบ
    mutationFn: async (transactionId: string) => {
      const { data } = await axios.delete(
        `/admin/transactions/${transactionId}`,
      );
      return data;
    },
    onSuccess: () => {
      toast.success("ลบรายการธุรกรรมสำเร็จ");
      // สำคัญมาก: ต้อง invalidate query เพื่อให้ UI อัปเดตและนำรายการที่ถูกลบออกไป
      queryClient.invalidateQueries({ queryKey: ["adminTransactions"] });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาดในการลบ");
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ transactionId, payload }: { transactionId: string; payload: UpdatePayload | ApprovePayload | RejectPayload }) => {
      const { data } = await axios.patch(
        `/admin/transactions/${transactionId}`,
        payload,
      );
      return data;
    },
    onSuccess: (data) => {
      toast.success("อัปเดตข้อมูลสำเร็จ!");
      queryClient.invalidateQueries({ queryKey: ["adminTransactions"] });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาดในการอัปเดต");
    },
  });
}

// NOTIFICATION

interface NotificationFilters {
  page?: number;
  pageSize?: number;
  [key: string]: any;
}

export function useAdminGetSystemNotifications(filters: NotificationFilters) {
  return useQuery({
    // queryKey ต้องขึ้นอยู่กับ filters เพื่อให้ re-fetch อัตโนมัติเมื่อ filter เปลี่ยน
    queryKey: ["adminSystemNotifications", filters],
    queryFn: async () => {
      // axios จะแปลง `filters` object เป็น query string ให้เอง
      // GET /admin/notifications?page=1&pageSize=10
      const { data } = await axios.get("/admin/notifications", {
        params: filters,
      });
      return data;
    },
  });
}

export function useAdminCreateSystemNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Notification>) => {
      // POST /admin/notifications พร้อมกับส่งข้อมูลใน body
      const { data } = await axios.post("/admin/notifications", payload);
      return data;
    },
    onSuccess: () => {
      toast.success("สร้างการแจ้งเตือนใหม่สำเร็จ!");
      // เมื่อสำเร็จ ให้ invalidate query ของ list เพื่อให้ table โหลดข้อมูลใหม่
      queryClient.invalidateQueries({ queryKey: ["adminSystemNotifications"] });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data?.message || "เกิดข้อผิดพลาดในการสร้างการแจ้งเตือน",
      );
    },
  });
}

export function useAdminEditNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    // mutationFn จะได้รับ object ที่มีทั้ง notificationId และ payload
    mutationFn: async ({ notificationId, payload }: { notificationId: string; payload: Partial<Notification> }) => {
      // PATCH /admin/notifications/:notificationId
      const { data } = await axios.patch(
        `/admin/notifications/${notificationId}`,
        payload,
      );
      return data;
    },
    onSuccess: () => {
      toast.success("แก้ไขการแจ้งเตือนสำเร็จ!");
      // Invalidate query ของ list เพื่ออัปเดตข้อมูลในตาราง
      queryClient.invalidateQueries({ queryKey: ["adminSystemNotifications"] });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาดในการแก้ไข");
    },
  });
}

export function useAdminDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    // mutationFn จะได้รับ notificationId ที่ต้องการลบ
    mutationFn: async (notificationId: string) => {
      // DELETE /admin/notifications/:notificationId
      const { data } = await axios.delete(
        `/admin/notifications/${notificationId}`,
      );
      return data;
    },
    onSuccess: () => {
      toast.success("ลบการแจ้งเตือนสำเร็จ!");
      // Invalidate query ของ list เพื่อนำรายการที่ถูกลบออกจากตาราง
      queryClient.invalidateQueries({ queryKey: ["adminSystemNotifications"] });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาดในการลบ");
    },
  });
}

// BROADCAST

interface BroadcastFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  [key: string]: any;
}

export function useAdminGetBroadcasts(filters: BroadcastFilters) {
  return useQuery({
    queryKey: ["adminBroadcasts"],
    queryFn: async () => {
      // GET /admin/broadcasts?page=1&search=...
      const { data } = await axios.get("/admin/broadcasts", {
        params: filters,
      });
      return data;
    },
    staleTime: 1000 * 360,
  });
}

export function useAdminCreateBroadcast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Broadcast>) => {
      // POST /admin/broadcasts
      const { data } = await axios.post("/admin/broadcasts", payload);
      return data;
    },
    onSuccess: () => {
      toast.success("สร้าง Broadcast ฉบับร่างสำเร็จ!");
      queryClient.invalidateQueries({ queryKey: ["adminBroadcasts"] });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาดในการสร้าง");
    },
  });
}

export function useAdminUpdateBroadcast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ broadcastId, payload }: { broadcastId: string; payload: Partial<Broadcast> }) => {
      // PATCH /admin/broadcasts/:broadcastId
      const { data } = await axios.patch(
        `/admin/broadcasts/${broadcastId}`,
        payload,
      );
      return data;
    },
    onSuccess: () => {
      toast.success("แก้ไข Broadcast สำเร็จ!");
      queryClient.invalidateQueries({ queryKey: ["adminBroadcasts"] });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาดในการแก้ไข");
    },
  });
}

export function useAdminDeleteBroadcast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (broadcastId: string) => {
      // DELETE /admin/broadcasts/:broadcastId
      await axios.delete(`/admin/broadcasts/${broadcastId}`);
    },
    onSuccess: () => {
      toast.success("ลบ Broadcast สำเร็จ!");
      queryClient.invalidateQueries({ queryKey: ["adminBroadcasts"] });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาดในการลบ");
    },
  });
}

export function useAdminSendBroadcast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (broadcastId: string) => {
      // POST /admin/broadcasts/:broadcastId/send
      const { data } = await axios.post(
        `/admin/broadcasts/${broadcastId}/send`,
      );
      return data;
    },
    onSuccess: (data) => {
      // `data` คือ { message: "Broadcast sent to 123 users." }
      toast.success(data.message || "ส่ง Broadcast สำเร็จ!");
      queryClient.invalidateQueries({ queryKey: ["adminBroadcasts"] });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาดในการส่ง");
    },
  });
}

/**
 * Hook สำหรับดึงข้อมูล Products ทั้งหมดแบบแบ่งหน้าสำหรับ Admin
 * @param {object} filters - State ของตัวกรองจากหน้า Page (page, pageSize, search, brand, sort)
 */
interface ProductFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  brand?: string;
  sort?: string;
  [key: string]: any;
}

export function useAdminGetProducts(filters: ProductFilters) {
  return useQuery({
    // queryKey ต้องขึ้นอยู่กับ filters เพื่อให้ re-fetch อัตโนมัติเมื่อ filter เปลี่ยน
    queryKey: ["adminProducts", filters],
    queryFn: async () => {
      // GET /admin/products?page=1&brand=Apple...
      const { data } = await axios.get("/admin/products", { params: filters });
      return data; // คาดว่าจะได้ { data, paging }
    },
  });
}

export function useAdminCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Product>) => {
      // POST /admin/products
      const { data } = await axios.post("/admin/products", payload);
      return data;
    },
    onSuccess: () => {
      toast.success("สร้างสินค้าใหม่สำเร็จ!");
      // เมื่อสำเร็จ, invalidate query ของ list เพื่อให้ table โหลดข้อมูลใหม่
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data?.message || "เกิดข้อผิดพลาดในการสร้างสินค้า",
      );
    },
  });
}

export function useAdminEditProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, payload }: { productId: string; payload: Partial<Product> }) => {
      // PATCH /admin/products/:productId
      const { data } = await axios.patch(
        `/admin/products/${productId}`,
        payload,
      );
      return data;
    },
    onSuccess: () => {
      toast.success("แก้ไขข้อมูลสินค้าสำเร็จ!");
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาดในการแก้ไข");
    },
  });
}

export function useAdminDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      // DELETE /admin/products/:productId
      await axios.delete(`/admin/products/${productId}`);
    },
    onSuccess: () => {
      toast.success("ลบสินค้าสำเร็จ!");
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data?.message || "เกิดข้อผิดพลาดในการลบสินค้า",
      );
    },
  });
}

export function useAdminGetProductFilters() {
  return useQuery({
    queryKey: ["adminProductFilters"],
    queryFn: async () => {
      const { data } = await axios.get("/admin/products/filters");
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false, // ไม่จำเป็นต้อง fetch ใหม่เมื่อ focus ที่หน้าต่าง
  });
}
