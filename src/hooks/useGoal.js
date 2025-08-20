import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";

export function useGetGoal(userId) {
  return useQuery({
    queryKey: ["goal", userId],
    queryFn: async () => {
      const { data } = await axios.get(`/goal/${userId}`);
      console.log("goal data : \n", data);
      return data;
    },
    staleTime: 1000 * 120,
    enabled: !!userId,
  });
}
