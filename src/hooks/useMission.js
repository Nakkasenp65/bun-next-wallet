import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios"; // Assuming you use axios for API calls

const fetchAvailableMissions = async (userId) => {
  const { data } = await axios.get(`/mission/available/${userId}`);
  return data;
};

const fetchMyMissions = async (userId) => {
  const { data } = await axios.get(`/user-mission/${userId}`);
  return data;
};

export const useGetAvailableMissions = (userId) => {
  return useQuery({
    queryKey: ["availableMissions"],
    queryFn: () => fetchAvailableMissions(userId),
    enabled: !!userId,
  });
};

export const useGetMyMissions = (userId) => {
  return useQuery({
    queryKey: ["myMissions", userId],
    queryFn: () => fetchMyMissions(userId),
    enabled: !!userId,
  });
};

const enrollInMission = async ({ missionId, userId }) => {
  const { data } = await axios.post(`/user-mission/enroll`, {
    missionId,
    userId,
  });
  setTimeout(() => {}, 300);
  return (data, userId);
};

export function useEnrollMission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: enrollInMission,
    onSuccess: (newUserMission, userId) => {
      toast.success("เข้าร่วมภารกิจสำเร็จ!");
      queryClient.setQueryData(["availableMissions"], (oldData) => {
        if (!oldData) {
          return oldData;
        }
        // oldData คือ array ของ Mission
        // เราจะกรอง (filter) เอา mission ที่เพิ่งเข้าร่วมไปออก
        return oldData.filter(
          (mission) => mission.id !== newUserMission.missionId,
        );
      });

      // --- 2. อัปเดต Cache ของ 'userMissions' (ภารกิจของฉัน) ---
      // สมมติว่าคุณมี query key ชื่อ "userMissions" สำหรับหน้ารวมภารกิจของฉัน
      queryClient.setQueryData(["myMissions", userId], (oldData) => {
        // newUserMission คือ object ที่ได้จาก backend ซึ่งตรงตาม format อยู่แล้ว
        // ถ้าไม่มีข้อมูลเก่า (เช่น user ยังไม่เคยเปิดหน้านี้)
        // ให้สร้าง array ใหม่ที่มีแค่ mission นี้
        if (!oldData) {
          return [newUserMission];
        }
        return [newUserMission, ...oldData];
      });
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "เข้าร่วมภารกิจไม่สำเร็จ");
    },
  });
}
