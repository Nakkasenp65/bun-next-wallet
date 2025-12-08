import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { Goal } from "@/types/prisma";

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
