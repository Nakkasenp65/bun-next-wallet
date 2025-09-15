import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";

export function useGetWallet(line_user_id) {
  return useQuery({
    queryKey: ["wallet", line_user_id],
    queryFn: async () => {
      const { data } = await axios.get(`/wallet/${line_user_id}`);
      return data;
    },
    staleTime: 1000 * 30,
    enabled: !!line_user_id,
  });
}
