import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios"; // Assuming you use axios for API calls
import toast from "react-hot-toast";

const fetchAvailableMissions = async (userId) => {
  const { data } = await axios.get(`/mission/available/${userId}`);
  return data;
};

async function deleteMission(missionId) {
  const { data } = await axios.delete(`/admin/missions/${missionId}`);
  return data;
}

export const useClaimMission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, userMissionId }) => {
      const { data } = await axios.post(`/user-mission/claim`, {
        userId,
        userMissionId,
      });
      return data; // Updated UserMission object
    },
    onSuccess: async (variables) => {
      const { userId, userMissionId } = variables;
      const myKey = ["myMissions", userId];
      // Cancel outgoing fetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: myKey });
      // Snapshot previous cache
      const prevMyMissions = queryClient.getQueryData(myKey);
      // Optimistically mark mission as CLAIMED (only if it was AWAITING_CLAIM)
      if (Array.isArray(prevMyMissions)) {
        const next = prevMyMissions.map((um) => {
          if (um.id !== userMissionId) return um;
          if (um.status !== "AWAITING_CLAIM") return um;
          return {
            ...um,
            status: "CLAIMED",
            claimedAt: new Date().toISOString(),
            // keep everything else; server will replace onSuccess
          };
        });
        queryClient.setQueryData(myKey, next);
      }

      return { prevMyMissions, userId, userMissionId };
    },

    onError: (error, _variables, ctx) => {
      // Rollback
      if (ctx?.prevMyMissions) {
        queryClient.setQueryData(
          ["myMissions", ctx.userId],
          ctx.prevMyMissions,
        );
      }

      // Backend sends helpful messages already per your service
      const msg =
        error?.response?.data?.message ||
        "ไม่สามารถรับรางวัลได้ กรุณาลองใหม่อีกครั้ง";
      toast.error(msg);
    },

    onSuccess: (updatedUserMission, variables) => {
      const { userId, userMissionId } = variables;
      queryClient.setQueryData(["myMissions", userId], (old) => {
        if (!Array.isArray(old)) return old;
        return old.map((um) =>
          um.id === userMissionId ? updatedUserMission : um,
        );
      });

      // If you also keep a "mission detail" cache, you can update it here
      // queryClient.setQueryData(["userMission", userMissionId], updatedUserMission);

      // If server changed it to CLAIM_EXPIRED, reflect that in the toast
      if (updatedUserMission?.status === "CLAIMED") {
        toast.success("รับรางวัลสำเร็จ!");
      } else if (updatedUserMission?.status === "CLAIM_EXPIRED") {
        toast.error("เลยเวลาเคลมรางวัลแล้ว");
      } else {
        toast.message("อัปเดตสถานะภารกิจแล้ว");
      }
    },
    onMutate: async ({ userId, userMissionId }) => {
      const myKey = ["myMissions", userId];
      await queryClient.cancelQueries({ queryKey: myKey });
      const prev = queryClient.getQueryData(myKey);

      if (Array.isArray(prev)) {
        queryClient.setQueryData(
          myKey,
          prev.map((um) =>
            um.id === userMissionId && um.status === "AWAITING_CLAIM"
              ? {
                  ...um,
                  status: "CLAIMED",
                  claimedAt: new Date().toISOString(),
                  _optimistic: true,
                }
              : um,
          ),
        );
      }

      return { prev, userId };
    },

    onError: (_err, { userId }, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["myMissions", userId], ctx.prev);
    },

    onSettled: (_data, _error, variables) => {
      const { userId } = variables ?? {};
      if (!userId) return;
      // Ensure we’re synced with server
      queryClient.invalidateQueries({ queryKey: ["myMissions", userId] });
      // availableMissions typically unaffected, but invalidate if needed:
      // queryClient.invalidateQueries({ queryKey: ["availableMissions", userId] });
    },
  });
};

export const useGetAvailableMissions = (userId) => {
  return useQuery({
    queryKey: ["availableMissions", userId],
    queryFn: () => fetchAvailableMissions(userId),
    staleTime: 15 * 1000,
    refetchOnWindowFocus: false, // avoid surprise refetch restoring stale server data
    enabled: !!userId,
  });
};

export const useGetMyMissions = (userId, filter) => {
  return useQuery({
    queryKey: ["myMissions", userId, filter],
    queryFn: async () => {
      const params = filter ? { filter } : {};
      const { data } = await axios.get(`/user-mission/${userId}`, { params });
      return data;
    },
    enabled: !!userId,
    staleTime: 15 * 1000,
  });
};

async function enrollMission({ missionId, userId }) {
  const { data } = await axios.post(`/user-mission/enroll`, {
    missionId,
    userId,
  });
  return data;
}

export function useEnrollMission({ onSuccessCallback } = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: enrollMission,
    onSuccess: (data, variables, context) => {
      const { userId } = variables;
      console.log("Enrolled data from backend (onSuccess): ", data);
      toast.success("เข้าร่วมภารกิจสำเร็จ!");
      setTimeout(() => {
        console.log("wait for 0.5 second");
      }, 500);
      queryClient.invalidateQueries({
        queryKey: ["availableMissions", userId],
      });
      queryClient.invalidateQueries({ queryKey: ["myMissions", userId] });
      if (onSuccessCallback)
        onSuccessCallback(newUserMission, variables, context);
    },
  });
}

export const useSubmitReferral = ({ onSuccess } = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ newcomerId, referralCode }) => {
      if (!newcomerId) throw new Error("newcomerId is required");
      if (!referralCode) throw new Error("referralCode is required");
      const { data } = await axios.post("/user/refer", {
        newcomerId,
        referralCode,
      });
      return data;
    },
    onSuccess: async (data, variables) => {
      // Invalidate anything that depends on the user/referrals
      // tweak keys to match your app’s query keys
      await Promise.allSettled([
        queryClient.invalidateQueries({
          queryKey: ["user", variables?.newcomerId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["referrals", variables?.newcomerId],
        }),
        queryClient.invalidateQueries({ queryKey: ["me"] }),
      ]);
      onSuccess?.(data, variables);
    },
  });
};

export function useCreateMission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async function createMission(payload) {
      const { data } = await axios.post("/admin/missions", payload);
      return data;
    },
    onSuccess: () => {
      toast.success("สร้างภารกิจใหม่สำเร็จ!");
      queryClient.invalidateQueries({ queryKey: ["adminMissions"] });
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "สร้างภารกิจไม่สำเร็จ"),
  });
}

export function useDeleteMission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMission,
    onSuccess: () => {
      toast.success("ลบภารกิจสำเร็จ!");
      queryClient.invalidateQueries({ queryKey: ["adminMissions"] });
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "ลบภารกิจไม่สำเร็จ"),
  });
}
