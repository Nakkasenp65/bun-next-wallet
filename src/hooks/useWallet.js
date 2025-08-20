import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";

export function useGetWallet(userId) {
  return useQuery({
    queryKey: ["wallet", userId],
    queryFn: async () => {
      const { data } = await axios.get(`/wallet/${userId}`);
      return data;
    },
    staleTime: 1000 * 60,
    enabled: !!userId,
  });
}
