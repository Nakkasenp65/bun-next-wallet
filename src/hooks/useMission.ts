import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios"; // Assuming you use axios for API calls
import toast from "react-hot-toast";
import { Mission, UserMission } from "@/types/prisma";
import { AxiosError } from "axios";

const fetchAvailableMissions = async (userId: string) => {
  const { data } = await axios.get<Mission[]>(`/mission/available/${userId}`);
  return data;
};

async function deleteMission(missionId: string) {
  const { data } = await axios.delete(`/admin/missions/${missionId}`);
  return data;
}

interface ClaimMissionVariables {
  userId: string;
  userMissionId: string;
}

export const useClaimMission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, userMissionId }: ClaimMissionVariables) => {
      const { data } = await axios.post<UserMission>(`/user-mission/claim`, {
        userId,
        userMissionId,
      });
      return data; // Updated UserMission object
    },
    onMutate: async ({ userId, userMissionId }: ClaimMissionVariables) => {
      const myKey = ["myMissions", userId];
      await queryClient.cancelQueries({ queryKey: myKey });
      const prev = queryClient.getQueryData<UserMission[]>(myKey);

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
    onSuccess: (updatedUserMission, variables) => {
      const { userId, userMissionId } = variables;
      queryClient.setQueryData<UserMission[]>(["myMissions", userId], (old) => {
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
        toast.success("อัปเดตสถานะภารกิจแล้ว");
      }
    },
    onError: (error: AxiosError<any>, variables, context: any) => {
      // Rollback
      if (context?.prev) {
        queryClient.setQueryData(
          ["myMissions", context.userId],
          context.prev,
        );
      }

      // Backend sends helpful messages already per your service
      const msg =
        error?.response?.data?.message ||
        "ไม่สามารถรับรางวัลได้ กรุณาลองใหม่อีกครั้ง";
      toast.error(msg);
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

export const useGetAvailableMissions = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["availableMissions", userId],
    queryFn: () => {
        if (!userId) return [];
        return fetchAvailableMissions(userId);
    },
    staleTime: 15 * 1000,
    refetchOnWindowFocus: false, // avoid surprise refetch restoring stale server data
    enabled: !!userId,
  });
};

export const useGetMyMissions = (userId: string | undefined, filter?: any) => {
  return useQuery({
    queryKey: ["myMissions", userId, filter],
    queryFn: async () => {
      const params = filter ? { filter } : {};
      const { data } = await axios.get<UserMission[]>(`/user-mission/${userId}`, { params });
      return data;
    },
    enabled: !!userId,
    staleTime: 15 * 1000,
  });
};

interface EnrollMissionVariables {
  missionId: string;
  userId: string;
}

async function enrollMission({ missionId, userId }: EnrollMissionVariables) {
  const { data } = await axios.post<UserMission>(`/user-mission/enroll`, {
    missionId,
    userId,
  });
  return data;
}

interface UseEnrollMissionOptions {
  onSuccessCallback?: (data: UserMission, variables: EnrollMissionVariables, context: unknown) => void;
}

export function useEnrollMission({ onSuccessCallback }: UseEnrollMissionOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: enrollMission,
    onSuccess: (data, variables, context) => {
      
      const { userId } = variables;
      toast.success("เข้าร่วมภารกิจสำเร็จ!");

      queryClient.refetchQueries({
        queryKey: ["availableMissions", userId],
      });

      queryClient.refetchQueries({ queryKey: ["myMissions", userId] });

      if (onSuccessCallback)
        onSuccessCallback(data, variables, context);
    },
  }); 
}

interface SubmitReferralVariables {
  newcomerId: string;
  referralCode: string;
}

interface UseSubmitReferralOptions {
  onSuccess?: (data: any, variables: SubmitReferralVariables) => void;
}

export const useSubmitReferral = ({ onSuccess }: UseSubmitReferralOptions = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ newcomerId, referralCode }: SubmitReferralVariables) => {
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
    mutationFn: async function createMission(payload: Partial<Mission>) {
      const { data } = await axios.post("/admin/missions", payload);
      return data;
    },
    onSuccess: () => {
      toast.success("สร้างภารกิจใหม่สำเร็จ!");
      queryClient.invalidateQueries({ queryKey: ["adminMissions"] });
    },
    onError: (err: AxiosError<any>) =>
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
    onError: (err: AxiosError<any>) =>
      toast.error(err.response?.data?.message || "ลบภารกิจไม่สำเร็จ"),
  });
}
