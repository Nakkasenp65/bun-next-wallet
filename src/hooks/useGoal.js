import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";

export function useGetGoal(line_user_id) {
  return useQuery({
    queryKey: ["goal", line_user_id],
    queryFn: async () => {
      const { data } = await axios.get(`/goal/${line_user_id}`);
      console.log("goal data : \n", data);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!line_user_id,
  });
}
