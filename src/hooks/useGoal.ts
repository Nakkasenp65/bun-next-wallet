import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { Goal } from "@/types/prisma";
import { useRouter } from "next/router";
import { CreateGoalPayload } from "../types/goal";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface UpdateGoalDTO {
  userId: string;
  [key: string]: any;
}

export function useGetGoal(line_user_id: string | undefined) {
  return useQuery({
    queryKey: ["goal", line_user_id],
    queryFn: async () => {
      const { data } = await axios.get<Goal>(`/goal/${line_user_id}`);
      console.log("goal data : \n", data);
      return data;
    },
    staleTime: 1000 * 60 * 5,
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
      const errorMessage = error.response?.data?.message || "สร้างเป้าหมายการออมเงินไม่สำเร็จ";
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
      const queryKey = variables["line_user_id"] ? ["goal", variables["line_user_id"]] : ["goal", variables.userId];

      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "ไม่สามารถเปลี่ยนเป้าหมายได้");
    },
  });
}
