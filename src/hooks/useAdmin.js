import axios from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

async function updateMission({ missionId, payload }) {
  console.log("payload:", missionId);
  const { data } = await axios.patch(`/admin/missions/${missionId}`, payload);
  return data;
}

export function useGetAdminMissions(filters) {
  return useQuery({
    queryKey: ["adminMissions", filters],
    queryFn: async (filters) => {
      const { data } = await axios.get("/admin/missions", { params: filters });
      return data;
    },
    keepPreviousData: true,
    staleTime: 1000 * 120,
  });
}

export function useAdminGetMissionDetails(missionId, participantFilters) {
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
    mutationFn: async ({ payload }) => {
      const { data } = await axios.patch(`/admin/missions`, payload);
      return data;
    },
    onSuccess: () => {
      toast.success("บันทึกการเปลี่ยนแปลงสำเร็จ!");
      queryClient.invalidateQueries({ queryKey: ["adminMissions"] });
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "อัปเดตภารกิจไม่สำเร็จ"),
  });
}

export function useGetAdminTransactions(filters) {
  return useQuery({
    // queryKey จะเปลี่ยนตาม filters เพื่อให้ React Query ดึงข้อมูลใหม่เมื่อ filter เปลี่ยน
    queryKey: ["adminTransactions", filters],
    queryFn: async (filters) => {
      // แปลง object filters เป็น query string, เช่น { page: 1, status: 'PENDING' } -> '?page=1&status=PENDING'
      const params = new URLSearchParams(filters).toString();
      const { data } = await axios.get(`/admin/transactions?${params}`);
      return data;
    },
    staleTime: 1000 * 120,
    keepPreviousData: true, // แสดงข้อมูลเก่าอยู่ขณะโหลดข้อมูลหน้าใหม่ (UX ที่ดีสำหรับ Pagination)
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

export function useAdminGetSystemNotifications(filters) {
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
    // ช่วยให้ UX ดีขึ้นตอนเปลี่ยนหน้า (ข้อมูลเก่าจะยังแสดงอยู่จนกว่าข้อมูลใหม่จะโหลดเสร็จ)
    keepPreviousData: true,
  });
}

export function useAdminCreateSystemNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      // POST /admin/notifications พร้อมกับส่งข้อมูลใน body
      const { data } = await axios.post("/admin/notifications", payload);
      return data;
    },
    onSuccess: () => {
      toast.success("สร้างการแจ้งเตือนใหม่สำเร็จ!");
      // เมื่อสำเร็จ ให้ invalidate query ของ list เพื่อให้ table โหลดข้อมูลใหม่
      queryClient.invalidateQueries({ queryKey: ["adminSystemNotifications"] });
    },
    onError: (error) => {
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
    mutationFn: async ({ notificationId, payload }) => {
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
    onError: (error) => {
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาดในการแก้ไข");
    },
  });
}

export function useAdminDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    // mutationFn จะได้รับ notificationId ที่ต้องการลบ
    mutationFn: async (notificationId) => {
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
    onError: (error) => {
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาดในการลบ");
    },
  });
}

export function useAdminGetBroadcasts(filters) {
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
    keepPreviousData: true,
  });
}

export function useAdminCreateBroadcast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      // POST /admin/broadcasts
      const { data } = await axios.post("/admin/broadcasts", payload);
      return data;
    },
    onSuccess: () => {
      toast.success("สร้าง Broadcast ฉบับร่างสำเร็จ!");
      queryClient.invalidateQueries({ queryKey: ["adminBroadcasts"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาดในการสร้าง");
    },
  });
}

export function useAdminUpdateBroadcast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ broadcastId, payload }) => {
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
    onError: (error) => {
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาดในการแก้ไข");
    },
  });
}

export function useAdminDeleteBroadcast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (broadcastId) => {
      // DELETE /admin/broadcasts/:broadcastId
      await axios.delete(`/admin/broadcasts/${broadcastId}`);
    },
    onSuccess: () => {
      toast.success("ลบ Broadcast สำเร็จ!");
      queryClient.invalidateQueries({ queryKey: ["adminBroadcasts"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาดในการลบ");
    },
  });
}

export function useAdminSendBroadcast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (broadcastId) => {
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
    onError: (error) => {
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาดในการส่ง");
    },
  });
}

/**
 * Hook สำหรับดึงข้อมูล Products ทั้งหมดแบบแบ่งหน้าสำหรับ Admin
 * @param {object} filters - State ของตัวกรองจากหน้า Page (page, pageSize, search, brand, sort)
 */
export function useAdminGetProducts(filters) {
  return useQuery({
    // queryKey ต้องขึ้นอยู่กับ filters เพื่อให้ re-fetch อัตโนมัติเมื่อ filter เปลี่ยน
    queryKey: ["adminProducts", filters],
    queryFn: async () => {
      // GET /admin/products?page=1&brand=Apple...
      const { data } = await axios.get("/admin/products", { params: filters });
      return data; // คาดว่าจะได้ { data, paging }
    },
    keepPreviousData: true,
  });
}

export function useAdminCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      // POST /admin/products
      const { data } = await axios.post("/admin/products", payload);
      return data;
    },
    onSuccess: () => {
      toast.success("สร้างสินค้าใหม่สำเร็จ!");
      // เมื่อสำเร็จ, invalidate query ของ list เพื่อให้ table โหลดข้อมูลใหม่
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "เกิดข้อผิดพลาดในการสร้างสินค้า",
      );
    },
  });
}

export function useAdminEditProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, payload }) => {
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
    onError: (error) => {
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาดในการแก้ไข");
    },
  });
}

export function useAdminDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId) => {
      // DELETE /admin/products/:productId
      await axios.delete(`/admin/products/${productId}`);
    },
    onSuccess: () => {
      toast.success("ลบสินค้าสำเร็จ!");
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
    },
    onError: (error) => {
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
