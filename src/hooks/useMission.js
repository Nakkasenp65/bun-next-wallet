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

const enrollInMission = async ({ missionId, userId }) => {
  const { data } = await axios.post(`/user-mission/enroll`, {
    missionId,
    userId,
  });
  setTimeout(() => {}, 300);
  return (data, userId);
};

const claimMissionRewardAPI = async ({ userId, userMissionId }) => {
  // Your backend route: POST /user-mission/claim
  // Body should contain userId + userMissionId
  const { data } = await axios.post(`/user-mission/claim`, {
    userId,
    userMissionId,
  });
  return data; // Updated UserMission object
};

/**
 * Claim a mission reward.
 *
 * Usage:
 * const { mutate: claim, isPending } = useClaimMission();
 * claim({ userId, userMissionId: userMission.id });
 */
export function useClaimMission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: claimMissionRewardAPI,

    onMutate: async (variables) => {
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
}

export const useGetAvailableMissions = (userId) => {
  return useQuery({
    queryKey: ["availableMissions", userId], // <-- add userId
    queryFn: () => fetchAvailableMissions(userId),
    enabled: !!userId,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    placeholderData: (prev) => prev ?? [],
  });
};

export const useGetMyMissions = (userId) => {
  return useQuery({
    queryKey: ["myMissions", userId], // <-- already correct
    queryFn: () => fetchMyMissions(userId),
    enabled: !!userId,
    staleTime: 15_000,
    gcTime: 5 * 60_000,
    placeholderData: (prev) => prev ?? [],
  });
};

export function useEnrollMission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: enrollInMission,

    // Optimistic update for snappy UI
    onMutate: async (variables) => {
      const { userId, missionId } = variables;

      const availableKey = ["availableMissions", userId];
      const myKey = ["myMissions", userId];

      // Cancel outgoing refetches to avoid clobbering our optimistic update
      await Promise.all([
        queryClient.cancelQueries({ queryKey: availableKey }),
        queryClient.cancelQueries({ queryKey: myKey }),
      ]);

      // Snapshot previous cache
      const prevAvailable = queryClient.getQueryData(availableKey);
      const prevMy = queryClient.getQueryData(myKey);

      // Optimistically remove from available missions
      if (Array.isArray(prevAvailable)) {
        queryClient.setQueryData(
          availableKey,
          prevAvailable.filter((m) => m.id !== missionId),
        );
      }

      // Optimistically add a shell UserMission to "my missions"
      if (Array.isArray(prevMy)) {
        const optimisticUserMission = {
          id: `optimistic-${missionId}`,
          missionId,
          mission: prevAvailable?.find((m) => m.id === missionId) ?? null,
          status: "ENROLLED",
          currentProgress: 0,
          completeProgress: 0,
          userExpiresAt: null,
          claimExpiresAt: null,
          _optimistic: true,
        };
        queryClient.setQueryData(myKey, [optimisticUserMission, ...prevMy]);
      }

      // context for rollback
      return { prevAvailable, prevMy, userId, missionId };
    },

    // If server returns an error, rollback
    onError: (error, _variables, context) => {
      const { prevAvailable, prevMy, userId } = context ?? {};
      if (prevAvailable)
        queryClient.setQueryData(["availableMissions", userId], prevAvailable);
      if (prevMy) queryClient.setQueryData(["myMissions", userId], prevMy);

      toast.error(error?.response?.data?.message || "เข้าร่วมภารกิจไม่สำเร็จ");
    },

    // Success: replace optimistic with real data
    onSuccess: (newUserMission, variables) => {
      const { userId, missionId } = variables;

      // Remove from available (defensive – server might refetch later)
      queryClient.setQueryData(["availableMissions", userId], (old) => {
        if (!Array.isArray(old)) return old;
        return old.filter((m) => m.id !== missionId);
      });

      // Insert/replace in my missions
      queryClient.setQueryData(["myMissions", userId], (old) => {
        const list = Array.isArray(old) ? old : [];
        // remove any optimistic one
        const withoutOptimistic = list.filter(
          (um) =>
            um.id !== `optimistic-${missionId}` && um.missionId !== missionId,
        );
        return [newUserMission, ...withoutOptimistic];
      });

      toast.success("เข้าร่วมภารกิจสำเร็จ!");
    },

    // Finally, ensure server truth
    onSettled: (_data, _error, variables) => {
      const { userId } = variables ?? {};
      if (!userId) return;
      queryClient.invalidateQueries({
        queryKey: ["availableMissions", userId],
      });
      queryClient.invalidateQueries({ queryKey: ["myMissions", userId] });
    },
  });
}
